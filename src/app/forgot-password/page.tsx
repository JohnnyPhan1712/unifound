import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotForm } from "@/components/auth/forgot-form";
import { Notice } from "@/components/ui/notice";
import { allowedDomains } from "@/lib/auth/email";

export const metadata: Metadata = { title: "Quên mật khẩu" };

export default async function ForgotPasswordPage({ searchParams }: PageProps<"/forgot-password">) {
  const { error } = await searchParams;
  return (
    <AuthShell title="Quên mật khẩu" heading="Đặt lại mật khẩu" lede="Nhập email trường, chúng tôi sẽ gửi liên kết để bạn đặt mật khẩu mới.">
      {error === "expired" && <Notice tone="warn">Liên kết đã hết hạn hoặc đã dùng. Hãy yêu cầu liên kết mới.</Notice>}
      <ForgotForm domains={allowedDomains()} />
    </AuthShell>
  );
}
