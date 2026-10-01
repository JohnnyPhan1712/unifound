"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db, reportImages, reports } from "@/db";
import { forbidden, formValues, invalid, type ActionState } from "@/lib/action-state";
import { canManageReport, statusAllows, STATUS_BLOCK_MESSAGE, type ReportAction } from "@/lib/auth/permissions";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/utils/supabase/server";
import { checkCatalog } from "./checks";
import { IMAGE_BUCKET, updateReportSchema } from "./schemas";

/** Tải tin và kiểm tra quyền + trạng thái phía server; trả lỗi thay vì ném để form hiện được. */
async function authorize(id: string, action: ReportAction) {
  const user = await requireUser();
  const [report] = /^[0-9a-f-]{36}$/i.test(id)
    ? await db.select({ id: reports.id, userId: reports.userId, status: reports.status, type: reports.type }).from(reports).where(eq(reports.id, id))
    : [];
  if (!report) return { error: { message: "Tin không tồn tại hoặc đã bị xóa." } as ActionState };
  if (!canManageReport(user, report)) return { error: forbidden };
  if (!statusAllows(action, report.status)) return { error: { message: STATUS_BLOCK_MESSAGE[action] } as ActionState };
  return { user, report };
}

function revalidateReport(id: string) {
  revalidatePath("/");
  revalidatePath("/my");
  revalidatePath(`/reports/${id}`);
}

export async function updateReport(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await authorize(id, "edit");
  if (auth.error) return auth.error;
  const values = formValues(formData);
  // Loại tin không đổi được khi sửa
  const parsed = updateReportSchema.safeParse({ ...values, type: auth.report.type });
  if (!parsed.success) return invalid(parsed.error, values);
  const data = parsed.data;
  const catalogErrors = await checkCatalog(data.categoryId, data.locationId);
  if (catalogErrors) return { fieldErrors: catalogErrors, values };

  await db
    .update(reports)
    .set({
      title: data.title,
      description: data.description,
      categoryId: data.categoryId,
      locationId: data.locationId,
      eventTime: data.eventTime,
      keepingPlace: data.type === "FOUND" ? data.keepingPlace : null,
      verifyQuestion: data.type === "FOUND" ? data.verifyQuestion : null,
      verifyAnswer: data.type === "FOUND" ? data.verifyAnswer : null,
      updatedAt: new Date(),
    })
    .where(eq(reports.id, id));
  revalidateReport(id);
  redirect(`/reports/${id}?updated=1`);
}

export async function closeReport(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  const auth = await authorize(id, "close");
  if (auth.error) return auth.error;
  await db.update(reports).set({ status: "CLOSED", updatedAt: new Date() }).where(eq(reports.id, id));
  revalidateReport(id);
  return { ok: true, message: "Đã đóng tin. Tin không còn hiện trên bảng tin." };
}

export async function deleteReport(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  const auth = await authorize(id, "delete");
  if (auth.error) return auth.error;

  const images = await db.select({ path: reportImages.imageUrl }).from(reportImages).where(eq(reportImages.reportId, id));
  // Xóa tin trước (cascade ảnh, yêu cầu, gợi ý, báo cáo) rồi mới dọn file; lỗi Storage không làm tin còn sót lại.
  await db.delete(reports).where(eq(reports.id, id));
  if (images.length) {
    const supabase = await createClient();
    const { error } = await supabase.storage.from(IMAGE_BUCKET).remove(images.map((i) => i.path));
    if (error) console.error("[deleteReport] dọn ảnh Storage thất bại", id, error.message);
  }
  revalidateReport(id);
  redirect(auth.user.id === auth.report.userId ? "/my?deleted=1" : "/?deleted=1");
}
