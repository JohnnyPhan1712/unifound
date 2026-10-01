"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db, flags, reports, users } from "@/db";
import { forbidden, type ActionState } from "@/lib/action-state";
import { notify } from "@/lib/notifications";
import { canChangeUserStatus, getAdmin } from "./guard";

const uuid = (v: FormDataEntryValue | null) => (typeof v === "string" && /^[0-9a-f-]{36}$/i.test(v) ? v : null);

function revalidateModeration(reportId?: string) {
  revalidatePath("/admin", "layout");
  revalidatePath("/");
  if (reportId) revalidatePath(`/reports/${reportId}`);
}

/** Ẩn tin (HIDDEN), đóng mọi báo cáo NEW của tin và báo cho chủ tin. */
export async function hideReport(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await getAdmin())) return forbidden;
  const reportId = uuid(formData.get("reportId"));
  if (!reportId) return { message: "Tin không hợp lệ." };

  const report = await db.transaction(async (tx) => {
    const [row] = await tx
      .update(reports)
      .set({ status: "HIDDEN", updatedAt: new Date() })
      .where(eq(reports.id, reportId))
      .returning({ userId: reports.userId, title: reports.title });
    if (row) await tx.update(flags).set({ status: "HANDLED" }).where(and(eq(flags.reportId, reportId), eq(flags.status, "NEW")));
    return row;
  });
  if (!report) return { message: "Tin không tồn tại." };

  await notify([
    {
      userId: report.userId,
      type: "REPORT_HIDDEN",
      message: `Tin “${report.title}” đã bị quản trị viên ẩn do bị báo cáo vi phạm.`,
      link: `/reports/${reportId}`,
    },
  ]);
  revalidateModeration(reportId);
  return { ok: true, message: "Đã ẩn tin và báo cho chủ tin." };
}

/** Bỏ qua: báo cáo chuyển HANDLED, tin giữ nguyên. */
export async function dismissFlags(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await getAdmin())) return forbidden;
  const reportId = uuid(formData.get("reportId"));
  if (!reportId) return { message: "Tin không hợp lệ." };
  await db.update(flags).set({ status: "HANDLED" }).where(and(eq(flags.reportId, reportId), eq(flags.status, "NEW")));
  revalidateModeration(reportId);
  return { ok: true, message: "Đã bỏ qua báo cáo. Tin vẫn hiển thị." };
}

/** Khóa/mở khóa tài khoản (FR15). Tài khoản khóa không đăng nhập/thao tác được (chặn ở requireUser và đăng nhập). */
export async function setUserStatus(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await getAdmin();
  if (!admin) return forbidden;
  const userId = uuid(formData.get("userId"));
  const status = formData.get("status");
  if (!userId || (status !== "active" && status !== "locked")) return { message: "Yêu cầu không hợp lệ." };

  const [target] = await db.select({ id: users.id, role: users.role, email: users.email }).from(users).where(eq(users.id, userId));
  if (!target) return { message: "Tài khoản không tồn tại." };
  if (!canChangeUserStatus(admin, target)) return { message: "Không thể khóa tài khoản quản trị hoặc chính bạn." };

  await db.update(users).set({ status, updatedAt: new Date() }).where(eq(users.id, userId));
  revalidateModeration();
  return { ok: true, message: status === "locked" ? `Đã khóa ${target.email}.` : `Đã mở khóa ${target.email}.` };
}
