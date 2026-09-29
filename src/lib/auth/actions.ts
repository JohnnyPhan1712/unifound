"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { db } from "@/db";
import { users, reports } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
  type AuthActionResult,
  type ReportUpdateInput,
} from "./schemas";
import { requireAuth, assertUserOwnsReport } from "./ownership";

/**
 * Lấy Supabase Server Client với cookies hiện tại
 */
export async function getSupabaseServerClient() {
  const cookieStore = await cookies();
  return createClient(cookieStore);
}

/**
 * Lấy thông tin user hiện tại từ session server-side
 */
export async function getCurrentUser() {
  try {
    // Nếu chưa cấu hình Supabase thực, trả về null (chế độ demo)
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;

    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

/**
 * Lấy thông tin profile người dùng từ cơ sở dữ liệu (bảng users)
 */
export async function getCurrentUserProfile() {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const profile = await db.query.users.findFirst({
      where: eq(users.id, user.id),
    });

    return profile ?? null;
  } catch {
    return null;
  }
}

/**
 * Server Action Đăng nhập với Email & Password
 */
export async function signInWithPassword(
  formData: LoginInput | FormData
): Promise<AuthActionResult<{ id: string; email?: string }>> {
  const rawData =
    formData instanceof FormData
      ? {
          email: formData.get("email"),
          password: formData.get("password"),
        }
      : formData;

  const parsed = loginSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Dữ liệu đăng nhập không hợp lệ",
    };
  }

  const { email, password } = parsed.data;

  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return {
        success: false,
        error: error?.message || "Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.",
      };
    }

    // Đảm bảo user có bản ghi trong bảng users
    try {
      await db
        .insert(users)
        .values({
          id: data.user.id,
          email: data.user.email ?? email,
          fullName: data.user.user_metadata?.full_name ?? null,
          role: "USER",
        })
        .onConflictDoNothing({ target: users.id });
    } catch {
      // Bỏ qua lỗi sync db nếu đã tồn tại hoặc db chưa sẵn sàng
    }

    return {
      success: true,
      data: {
        id: data.user.id,
        email: data.user.email,
      },
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Đã có lỗi xảy ra khi đăng nhập",
    };
  }
}

/**
 * Server Action Đăng ký tài khoản với Email & Password
 */
export async function signUpWithPassword(
  formData: RegisterInput | FormData
): Promise<AuthActionResult<{ id: string; email?: string }>> {
  const rawData =
    formData instanceof FormData
      ? {
          email: formData.get("email"),
          password: formData.get("password"),
          confirmPassword: formData.get("confirmPassword"),
          fullName: formData.get("fullName") || undefined,
        }
      : formData;

  const parsed = registerSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Dữ liệu đăng ký không hợp lệ",
    };
  }

  const { email, password, fullName } = parsed.data;

  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error || !data.user) {
      return {
        success: false,
        error: error?.message || "Đăng ký không thành công. Vui lòng thử lại.",
      };
    }

    // Lưu thông tin người dùng vào bảng users trong DB
    try {
      await db
        .insert(users)
        .values({
          id: data.user.id,
          email: data.user.email ?? email,
          fullName: fullName ?? null,
          role: "USER",
        })
        .onConflictDoNothing({ target: users.id });
    } catch {
      // Bỏ qua lỗi insert nếu đã tồn tại
    }

    return {
      success: true,
      data: {
        id: data.user.id,
        email: data.user.email,
      },
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Đã có lỗi xảy ra khi đăng ký",
    };
  }
}

/**
 * Lấy thông tin user hiện tại kèm theo Profile và Role từ Database
 */
export async function getCurrentUserWithProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  const profile = await getCurrentUserProfile();
  return {
    ...user,
    role: profile?.role ?? "USER",
    fullName: profile?.fullName ?? user.user_metadata?.full_name ?? null,
  };
}

/**
 * Server Action Đăng xuất
 */
export async function signOut(): Promise<void> {
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

/**
 * Server Action Xóa Report (CHG-008 - Enforce Ownership & Admin at Backend)
 */
export async function deleteReportAction(
  reportId: string
): Promise<AuthActionResult<{ id: string }>> {
  try {
    const user = await requireAuth();
    const profile = await getCurrentUserProfile();

    const report = await db.query.reports.findFirst({
      where: eq(reports.id, reportId),
    });

    if (!report) {
      return { success: false, error: "Không tìm thấy bài đăng." };
    }

    // Kiểm tra ownership: chỉ chủ sở hữu hoặc ADMIN mới có quyền xóa
    assertUserOwnsReport(report, {
      id: user.id,
      role: profile?.role ?? "USER",
    });

    await db.delete(reports).where(eq(reports.id, reportId));

    return { success: true, data: { id: reportId } };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Không thể xóa bài đăng.",
    };
  }
}

/**
 * Server Action Cập nhật Report (CHG-008 - Enforce Ownership & Admin at Backend)
 */
export async function updateReportAction(
  reportId: string,
  updateData: ReportUpdateInput
): Promise<AuthActionResult<{ id: string }>> {
  try {
    const user = await requireAuth();
    const profile = await getCurrentUserProfile();

    const report = await db.query.reports.findFirst({
      where: eq(reports.id, reportId),
    });

    if (!report) {
      return { success: false, error: "Không tìm thấy bài đăng." };
    }

    // Kiểm tra ownership: chỉ chủ sở hữu hoặc ADMIN mới có quyền sửa
    assertUserOwnsReport(report, {
      id: user.id,
      role: profile?.role ?? "USER",
    });

    // Tuyệt đối không cho phép thay đổi userId hoặc id
    const { ...safeUpdate } = updateData;

    await db
      .update(reports)
      .set({
        ...safeUpdate,
        updatedAt: new Date(),
      })
      .where(eq(reports.id, reportId));

    return { success: true, data: { id: reportId } };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Không thể cập nhật bài đăng.",
    };
  }
}

/**
 * Server Action Yêu cầu Quên mật khẩu (Gửi email khôi phục)
 */
export async function resetPasswordForEmailAction(
  email: string
): Promise<AuthActionResult<{ email: string }>> {
  if (!email || !email.includes("@")) {
    return { success: false, error: "Vui lòng nhập địa chỉ email hợp lệ." };
  }

  try {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`,
    });

    if (error) {
      return {
        success: false,
        error: error.message || "Không thể gửi email khôi phục mật khẩu.",
      };
    }

    return { success: true, data: { email } };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Đã có lỗi xảy ra khi yêu cầu khôi phục mật khẩu.",
    };
  }
}

/**
 * Server Action Đặt lại mật khẩu mới
 */
export async function updatePasswordAction(
  newPassword: string
): Promise<AuthActionResult<void>> {
  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: "Mật khẩu mới phải có ít nhất 6 ký tự." };
  }

  try {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return {
        success: false,
        error: error.message || "Không thể cập nhật mật khẩu mới.",
      };
    }

    return { success: true, data: undefined };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Đã có lỗi xảy ra khi cập nhật mật khẩu.",
    };
  }
}


