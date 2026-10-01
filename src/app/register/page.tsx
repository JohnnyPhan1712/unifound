import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { allowedDomains } from "@/lib/auth/email";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Đăng ký" };

export default async function RegisterPage() {
  if (await getCurrentUser()) redirect("/");

  return (
    <AuthShell
      title="Tạo tài khoản"
      heading="Tạo tài khoản"
      lede="Chỉ sinh viên có email trường mới đăng ký được, để bảng tin giữ trong cộng đồng UIT. Quyền quản trị do nhóm cấp sẵn."
    >
      <AuthForm mode="register" domains={allowedDomains()} />
    </AuthShell>
  );
}
