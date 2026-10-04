"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { claims, db, locations, reports } from "@/db";
import { forbidden, formValues, invalid, type ActionState } from "@/lib/action-state";
import { requireUser } from "@/lib/auth/session";
import { formatDateTime } from "@/lib/labels";
import { notify, type NewNotification } from "@/lib/notifications";
import { applyConfirmation, handoverRole, meetingSchema } from "./handover";
import { canTransition } from "./rules";

/** Người nhặt chọn điểm hẹn + giờ hẹn sau khi đã chấp nhận yêu cầu; người mất được thông báo. */
export async function setMeeting(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const values = formValues(formData);
  const parsed = meetingSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  const { id, meetLocationId, meetTime } = parsed.data;

  const [row] = await db
    .select({ status: claims.status, claimantId: claims.claimantId, finderId: reports.userId, title: reports.title })
    .from(claims)
    .innerJoin(reports, eq(claims.reportId, reports.id))
    .where(eq(claims.id, id));
  if (!row) return { message: "Yêu cầu không tồn tại." };
  if (handoverRole(user.id, row) !== "finder") return forbidden;
  if (row.status !== "ACCEPTED") return { message: "Chỉ hẹn được khi yêu cầu đang ở trạng thái đã chấp nhận." };
  const [location] = await db.select({ name: locations.name }).from(locations).where(and(eq(locations.id, meetLocationId), eq(locations.isActive, true)));
  if (!location) return { fieldErrors: { meetLocationId: ["Địa điểm không còn khả dụng."] }, values };

  await db.update(claims).set({ meetLocationId, meetTime, updatedAt: new Date() }).where(eq(claims.id, id));
  await notify([
    {
      userId: row.claimantId,
      type: "MEETING",
      message: `Lịch hẹn nhận “${row.title}”: ${location.name}, ${formatDateTime(meetTime)}.`,
      link: `/claims/${id}`,
    },
  ]);
  revalidatePath(`/claims/${id}`);
  revalidatePath("/", "layout");
  return { ok: true, message: "Đã lưu lịch hẹn và báo cho người nhận." };
}

/** "Đã trả đồ" (người nhặt) / "Đã nhận đồ" (người mất). Đủ hai bên: claim COMPLETED + tin RETURNED trong một transaction. */
export async function confirmHandover(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { message: "Yêu cầu không hợp lệ." };

  type Outcome = ActionState & { notifications?: NewNotification[] };
  const outcome = await db.transaction(async (tx): Promise<Outcome> => {
    const [row] = await tx
      .select({
        status: claims.status,
        claimantId: claims.claimantId,
        finderConfirmedAt: claims.finderConfirmedAt,
        ownerConfirmedAt: claims.ownerConfirmedAt,
        reportId: reports.id,
        finderId: reports.userId,
        title: reports.title,
      })
      .from(claims)
      .innerJoin(reports, eq(claims.reportId, reports.id))
      .where(eq(claims.id, id))
      .for("update");
    if (!row) return { message: "Yêu cầu không tồn tại." };
    const role = handoverRole(user.id, row);
    if (!role) return forbidden;
    if (row.status === "COMPLETED") return { ok: true, message: "Việc bàn giao đã hoàn tất." };
    if (row.status !== "ACCEPTED") return { message: "Chỉ xác nhận được khi yêu cầu đã được chấp nhận." };
    // Bấm lặp lại: không ghi đè mốc cũ, không gửi lại thông báo
    if ((role === "finder" ? row.finderConfirmedAt : row.ownerConfirmedAt) !== null) {
      return { ok: true, message: "Bạn đã xác nhận trước đó. Chờ bên còn lại xác nhận." };
    }

    const next = applyConfirmation(row, role, new Date());
    await tx
      .update(claims)
      .set({
        finderConfirmedAt: next.finderConfirmedAt,
        ownerConfirmedAt: next.ownerConfirmedAt,
        ...(next.completed ? { status: "COMPLETED" as const } : {}),
        updatedAt: new Date(),
      })
      .where(eq(claims.id, id));
    const link = `/claims/${id}`;
    if (next.completed) {
      await tx.update(reports).set({ status: "RETURNED", updatedAt: new Date() }).where(eq(reports.id, row.reportId));
      const message = `Hoàn tất: “${row.title}” đã được trả về đúng chủ.`;
      return {
        ok: true,
        message: "Hai bên đã xác nhận. Tin chuyển sang Đã trả.",
        notifications: [
          { userId: row.finderId, type: "RETURNED", message, link },
          { userId: row.claimantId, type: "RETURNED", message, link },
        ],
      };
    }
    const other = role === "finder" ? row.claimantId : row.finderId;
    return {
      ok: true,
      message: "Đã ghi nhận xác nhận của bạn. Chờ bên còn lại xác nhận.",
      notifications: [
        {
          userId: other,
          type: "MEETING",
          message: `${role === "finder" ? "Người nhặt đã xác nhận trả" : "Người nhận đã xác nhận nhận"} “${row.title}”. Bấm xác nhận phía bạn để hoàn tất.`,
          link,
        },
      ],
    };
  });

  if (outcome.notifications) await notify(outcome.notifications);
  revalidatePath("/", "layout");
  return { ok: outcome.ok, message: outcome.message };
}

/** Một trong hai bên hủy bàn giao khi không gặp được nhau: claim CANCELLED, tin về OPEN để nhận yêu cầu khác. */
export async function cancelHandover(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { message: "Yêu cầu không hợp lệ." };

  type Outcome = ActionState & { notifications?: NewNotification[] };
  const outcome = await db.transaction(async (tx): Promise<Outcome> => {
    const [row] = await tx
      .select({ status: claims.status, claimantId: claims.claimantId, reportId: reports.id, finderId: reports.userId, title: reports.title })
      .from(claims)
      .innerJoin(reports, eq(claims.reportId, reports.id))
      .where(eq(claims.id, id))
      .for("update");
    if (!row) return { message: "Yêu cầu không tồn tại." };
    const role = handoverRole(user.id, row);
    if (!role) return forbidden;
    if (row.status === "CANCELLED") return { ok: true, message: "Bàn giao đã được hủy trước đó." };
    if (!canTransition(row.status, "CANCELLED")) return { message: "Chỉ hủy được khi yêu cầu đang ở trạng thái đã chấp nhận." };

    await tx.update(claims).set({ status: "CANCELLED", updatedAt: new Date() }).where(eq(claims.id, id));
    await tx.update(reports).set({ status: "OPEN", updatedAt: new Date() }).where(and(eq(reports.id, row.reportId), eq(reports.status, "IN_PROGRESS")));
    return {
      ok: true,
      message: "Đã hủy bàn giao. Tin quay về trạng thái Đang mở.",
      notifications: [
        {
          userId: role === "finder" ? row.claimantId : row.finderId,
          type: "CLAIM_DECISION",
          message: `${role === "finder" ? "Người nhặt" : "Người nhận"} đã hủy bàn giao “${row.title}”.`,
          link: `/claims/${id}`,
        },
      ],
    };
  });

  if (outcome.notifications) await notify(outcome.notifications);
  revalidatePath("/", "layout");
  return { ok: outcome.ok, message: outcome.message };
}
