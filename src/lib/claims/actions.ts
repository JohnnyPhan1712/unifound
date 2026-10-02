"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, eq, ne } from "drizzle-orm";
import { claimImages, claims, db, reports } from "@/db";
import { forbidden, formValues, invalid, type ActionState } from "@/lib/action-state";
import { requireUser } from "@/lib/auth/session";
import { isUniqueViolation } from "@/lib/db-errors";
import { notify, type NewNotification } from "@/lib/notifications";
import { checkImages } from "@/lib/reports/checks";
import { CLAIM_IMAGE_BUCKET } from "@/lib/reports/schemas";
import { canTransition, claimSubmitError, effectiveClaimStatus } from "./rules";
import { claimSchema, decisionSchema } from "./schemas";

export async function submitClaim(reportId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const values = formValues(formData);
  const parsed = claimSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);

  const [report] = /^[0-9a-f-]{36}$/i.test(reportId)
    ? await db
        .select({ id: reports.id, userId: reports.userId, type: reports.type, status: reports.status, expiresAt: reports.expiresAt, title: reports.title })
        .from(reports)
        .where(eq(reports.id, reportId))
    : [];
  if (!report || report.status === "HIDDEN") return { message: "Tin không tồn tại." };
  const [existing] = await db
    .select({ id: claims.id })
    .from(claims)
    .where(and(eq(claims.reportId, reportId), eq(claims.claimantId, user.id)));
  const error = claimSubmitError(report, user.id, Boolean(existing));
  if (error) return { message: error, values };

  const { images, answerText, note } = parsed.data;
  if (images.length) {
    const imageError = await checkImages(images, user.id, CLAIM_IMAGE_BUCKET);
    if (imageError) return { fieldErrors: { images: [imageError] }, values };
  }

  let claimId: string;
  try {
    claimId = await db.transaction(async (tx) => {
      const [row] = await tx.insert(claims).values({ reportId, claimantId: user.id, answerText, note }).returning({ id: claims.id });
      if (images.length) await tx.insert(claimImages).values(images.map((imagePath, position) => ({ claimId: row.id, imagePath, position })));
      return row.id;
    });
  } catch (e) {
    // Hai lần gửi đồng thời: UNIQUE(report_id, claimant_id) chặn lần thứ hai
    if (isUniqueViolation(e)) return { message: "Bạn đã gửi yêu cầu cho tin này, hãy chờ người nhặt phản hồi.", values };
    throw e;
  }

  await notify([
    { userId: report.userId, type: "CLAIM_NEW", message: `Có người gửi yêu cầu nhận đồ cho tin “${report.title}”.`, link: `/claims/${claimId}` },
  ]);
  revalidatePath("/my");
  revalidatePath("/", "layout");
  redirect(`/claims/${claimId}?sent=1`);
}

/** Người nhặt (chủ tin FOUND) chấp nhận hoặc từ chối; chấp nhận thì đóng các yêu cầu còn lại trong cùng transaction. */
export async function decideClaim(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = decisionSchema.safeParse(formValues(formData));
  if (!parsed.success) return { message: "Yêu cầu không hợp lệ." };
  const { id, decision } = parsed.data;

  type Outcome = ActionState & { notifications?: NewNotification[] };
  let outcome: Outcome;
  try {
    outcome = await db.transaction(async (tx): Promise<Outcome> => {
      // Khóa dòng tin để hai lần chấp nhận đồng thời phải chờ nhau
      const [row] = await tx
        .select({
          claimId: claims.id,
          status: claims.status,
          createdAt: claims.createdAt,
          claimantId: claims.claimantId,
          reportId: reports.id,
          reportStatus: reports.status,
          ownerId: reports.userId,
          title: reports.title,
        })
        .from(claims)
        .innerJoin(reports, eq(claims.reportId, reports.id))
        .where(eq(claims.id, id))
        .for("update", { of: reports });
      if (!row) return { message: "Yêu cầu không tồn tại." };
      if (row.ownerId !== user.id) return forbidden;

      const current = effectiveClaimStatus(row);
      if (current === "EXPIRED") return { message: "Yêu cầu đã quá 7 ngày, không thể xử lý." };
      if (!canTransition(current, decision)) return { message: "Yêu cầu này đã được xử lý." };

      if (decision === "REJECTED") {
        await tx.update(claims).set({ status: "REJECTED", updatedAt: new Date() }).where(eq(claims.id, id));
        return {
          ok: true,
          message: "Đã từ chối yêu cầu. Tin vẫn mở để nhận yêu cầu khác.",
          notifications: [{ userId: row.claimantId, type: "CLAIM_DECISION", message: `Yêu cầu nhận đồ cho tin “${row.title}” không được chấp nhận.`, link: `/claims/${id}` }],
        };
      }

      if (row.reportStatus !== "OPEN") return { message: "Tin này đã có yêu cầu được chấp nhận hoặc không còn mở." };
      await tx.update(claims).set({ status: "ACCEPTED", updatedAt: new Date() }).where(eq(claims.id, id));
      await tx.update(reports).set({ status: "IN_PROGRESS", updatedAt: new Date() }).where(eq(reports.id, row.reportId));
      const closed = await tx
        .update(claims)
        .set({ status: "REJECTED", updatedAt: new Date() })
        .where(and(eq(claims.reportId, row.reportId), eq(claims.status, "PENDING"), ne(claims.id, id)))
        .returning({ id: claims.id, claimantId: claims.claimantId });
      return {
        ok: true,
        message: "Đã chấp nhận. Hãy đặt điểm hẹn để bàn giao đồ.",
        notifications: [
          { userId: row.claimantId, type: "CLAIM_DECISION", message: `Yêu cầu nhận đồ cho tin “${row.title}” đã được chấp nhận. Chờ người nhặt hẹn điểm gặp.`, link: `/claims/${id}` },
          ...closed.map((c) => ({
            userId: c.claimantId,
            type: "CLAIM_DECISION" as const,
            message: `Tin “${row.title}” đã chọn một yêu cầu khác; yêu cầu của bạn đã đóng.`,
            link: `/claims/${c.id}`,
          })),
        ],
      };
    });
  } catch (e) {
    // Partial unique index: tối đa một ACCEPTED mỗi tin
    if (isUniqueViolation(e)) return { message: "Tin này đã có yêu cầu được chấp nhận." };
    throw e;
  }

  if (outcome.notifications) await notify(outcome.notifications);
  revalidatePath("/", "layout");
  return { ok: outcome.ok, message: outcome.message };
}
