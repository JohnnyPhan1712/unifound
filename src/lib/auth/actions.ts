"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db, schools, users } from "@/db";
import { createClient } from "@/utils/supabase/server";
import { formValues, invalid, type ActionState } from "@/lib/action-state";
import { authUrl } from "./auth-url";
import { allowedDomains, isAllowedEmail } from "./email";
import { credentialsSchema, emailSchema, newPasswordSchema, profileSchema, registerSchema } from "./schemas";
import { ensureUserRow, getSessionUser, requireUser } from "./session";

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
  const kept = { email: values.email ?? "", fullName: values.fullName ?? "" };
  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, kept);
  const { email, password, fullName } = parsed.data;
  if (!isAllowedEmail(email, allowedDomains())) return { ...domainError(), values: { email, fullName } };
  if (values.password !== values.confirmPassword) {
    return { fieldErrors: { confirmPassword: ["Mật khẩu nhập lại không khớp."] }, values: { email, fullName } };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error || !data.user) {
    const message =
      error?.code === "user_already_exists"
        ? "Email này đã có tài khoản. Hãy đăng nhập."
        : "Không thể đăng ký lúc này, vui lòng thử lại.";
    return { message, values: { email, fullName } };
  }
  // Supabase trả user giả (identities rỗng) khi email đã tồn tại mà bật xác nhận email
  if (data.user.identities?.length === 0) {
    return { message: "Email này đã có tài khoản. Hãy đăng nhập.", values: { email, fullName } };
  }

  await ensureUserRow(data.user.id, email, fullName);
  if (!data.session) {
    return { ok: true, message: "Đã gửi email xác nhận. Mở hộp thư để kích hoạt tài khoản rồi đăng nhập." };
  }

  revalidatePath("/", "layout");
  redirect("/profile?welcome=1");
}

export async function requestPasswordReset(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const values = formValues(formData);
  const parsed = emailSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, { email: values.email ?? "" });
  const { email } = parsed.data;
  if (!isAllowedEmail(email, allowedDomains())) return { ...domainError(), values: { email } };

  const h = await headers();
  const origin = h.get("origin") ?? `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`;
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/callback` });
  if (error) {
    const message =
      error.code === "over_email_send_rate_limit"
        ? "Bạn yêu cầu quá nhiều lần. Hãy thử lại sau ít phút."
        : "Không thể gửi email lúc này, vui lòng thử lại.";
    return { message, values: { email } };
  }
  // Cùng một thông báo dù email có tài khoản hay không, để không lộ email nào đã đăng ký.
  return {
    ok: true,
    message: "Nếu email này đã có tài khoản, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu. Kiểm tra hộp thư (cả thư rác).",
    values: { email },
  };
}

export async function updatePassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = newPasswordSchema.safeParse(formValues(formData));
  if (!parsed.success) return invalid(parsed.error);

  // Phiên tạm có được khi bấm liên kết trong mail (route /auth/callback).
  const user = await getSessionUser();
  if (!user) return { message: "Liên kết đã hết hạn hoặc đã dùng. Hãy yêu cầu liên kết mới." };

  const supabase = await createClient();
  if (user.status === "locked") {
    await supabase.auth.signOut();
    redirect(authUrl("login", { error: "locked" }));
  }
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return {
      message: error.code === "same_password" ? "Mật khẩu mới phải khác mật khẩu cũ." : "Không thể đổi mật khẩu lúc này, vui lòng thử lại.",
    };
  }
  await supabase.auth.signOut();
  redirect(authUrl("login", { reset: "1" }));
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
