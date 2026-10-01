"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db, schools, users } from "@/db";
import { createClient } from "@/utils/supabase/server";
import { formValues, invalid, type ActionState } from "@/lib/action-state";
import { allowedDomains, isAllowedEmail } from "./email";
import { credentialsSchema, profileSchema } from "./schemas";
import { ensureUserRow, requireUser } from "./session";

const domainError = (): ActionState => ({
  fieldErrors: {
    email: [`Chỉ nhận email do trường cấp (${allowedDomains().map((d) => "@" + d).join(", ")}).`],
  },
});

/** Chỉ cho chuyển hướng nội bộ để tránh open redirect. */
function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const values = formValues(formData);
  const parsed = credentialsSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, { email: values.email ?? "" });
  const { email, password } = parsed.data;
  if (!isAllowedEmail(email, allowedDomains())) return { ...domainError(), values: { email } };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    const message =
      error?.code === "email_not_confirmed"
        ? "Email chưa được xác nhận. Mở hộp thư và bấm liên kết xác nhận."
        : "Email hoặc mật khẩu không đúng.";
    return { message, values: { email } };
  }

  const user = await ensureUserRow(data.user.id, email);
  if (user.status === "locked") {
    await supabase.auth.signOut();
    return { message: "Tài khoản đã bị khóa. Liên hệ quản trị viên để được hỗ trợ.", values: { email } };
  }

  revalidatePath("/", "layout");
  redirect(safeNext(formData.get("next")));
}

export async function register(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const values = formValues(formData);
  const parsed = credentialsSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, { email: values.email ?? "" });
  const { email, password } = parsed.data;
  if (!isAllowedEmail(email, allowedDomains())) return { ...domainError(), values: { email } };
  if (values.password !== values.confirmPassword) {
    return { fieldErrors: { confirmPassword: ["Mật khẩu nhập lại không khớp."] }, values: { email } };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error || !data.user) {
    const message =
      error?.code === "user_already_exists"
        ? "Email này đã có tài khoản. Hãy đăng nhập."
        : "Không thể đăng ký lúc này, vui lòng thử lại.";
    return { message, values: { email } };
  }
  // Supabase trả user giả (identities rỗng) khi email đã tồn tại mà bật xác nhận email
  if (data.user.identities?.length === 0) {
    return { message: "Email này đã có tài khoản. Hãy đăng nhập.", values: { email } };
  }

  await ensureUserRow(data.user.id, email);
  if (!data.session) {
    return { ok: true, message: "Đã gửi email xác nhận. Mở hộp thư để kích hoạt tài khoản rồi đăng nhập." };
  }

  revalidatePath("/", "layout");
  redirect("/profile?welcome=1");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function updateProfile(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const values = formValues(formData);
  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  if (parsed.data.schoolId) {
    const [school] = await db.select({ id: schools.id }).from(schools).where(eq(schools.id, parsed.data.schoolId));
    if (!school) return { fieldErrors: { schoolId: ["Trường không tồn tại."] }, values };
  }

  await db
    .update(users)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(users.id, user.id));
  revalidatePath("/", "layout");
  return { ok: true, message: "Đã lưu hồ sơ.", values };
}
