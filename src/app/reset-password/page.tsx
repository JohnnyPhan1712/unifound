import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetForm } from "@/components/auth/reset-form";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Đặt mật khẩu mới" };

export default async function ResetPasswordPage() {
  // Chỉ vào được sau khi bấm liên kết trong mail (có phiên tạm)
  if (!(await getSessionUser())) redirect("/forgot-password?error=expired");
  return (
    <AuthShell title="Đặt mật khẩu mới" heading="Đặt mật khẩu mới" lede="Chọn mật khẩu mới cho tài khoản của bạn.">
      <ResetForm />
    </AuthShell>
  );
}
