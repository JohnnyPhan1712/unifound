import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { Notice } from "@/components/ui/notice";
import { allowedDomains } from "@/lib/auth/email";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Đăng nhập" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next: rawNext, error, reset } = await searchParams;
  // Chỉ nhận đường dẫn nội bộ để tránh open redirect
  const next = typeof rawNext === "string" && rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : undefined;
  const user = await getSessionUser();
  if (user?.status === "active") redirect(next ?? "/");

  return (
    <AuthShell title="Đăng nhập" heading="Chào mừng đến UniFound" lede="Đăng nhập để đăng tin, gửi yêu cầu nhận lại và theo dõi trạng thái.">
      {(error === "locked" || user?.status === "locked") && <Notice tone="error">Tài khoản đã bị khóa. Liên hệ quản trị viên để được hỗ trợ.</Notice>}
      {reset === "1" && <Notice tone="success">Đã đổi mật khẩu. Hãy đăng nhập bằng mật khẩu mới.</Notice>}
      <AuthForm mode="login" next={next} domains={allowedDomains()} />
    </AuthShell>
  );
}
