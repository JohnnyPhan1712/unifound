"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db, flags, reports } from "@/db";
import { formValues, invalid, type ActionState } from "@/lib/action-state";
import { requireUser } from "@/lib/auth/session";
import { isUniqueViolation } from "@/lib/db-errors";
import { flagSchema } from "./schemas";

/** Báo cáo vi phạm (FR14): mỗi người một báo cáo cho mỗi tin; tin vẫn hiện tới khi admin xử lý. */
export async function flagReport(reportId: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const values = formValues(formData);
  const parsed = flagSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);

  const [report] = /^[0-9a-f-]{36}$/i.test(reportId)
    ? await db.select({ userId: reports.userId, status: reports.status }).from(reports).where(eq(reports.id, reportId))
    : [];
  if (!report || report.status === "HIDDEN") return { message: "Tin không tồn tại hoặc đã bị ẩn." };
  if (report.userId === user.id) return { message: "Bạn không thể báo cáo tin của chính mình." };

  try {
    await db.insert(flags).values({ reportId, reporterId: user.id, reason: parsed.data.reason });
  } catch (e) {
    if (isUniqueViolation(e)) return { message: "Bạn đã báo cáo tin này rồi. Quản trị viên sẽ xem xét." };
    throw e;
  }
  revalidatePath("/admin/moderation");
  return { ok: true, message: "Đã gửi báo cáo. Cảm ơn bạn, quản trị viên sẽ xem xét." };
}
