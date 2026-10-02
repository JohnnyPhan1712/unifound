import { redirect } from "next/navigation";
import { authUrl } from "@/lib/auth/auth-url";

/** URL cũ (và đích khi liên kết đặt lại mật khẩu hết hạn): chuyển sang popup quên mật khẩu. */
export default async function ForgotPasswordPage({ searchParams }: PageProps<"/forgot-password">) {
  const { error } = await searchParams;
  redirect(authUrl("forgot", { error: typeof error === "string" ? error : undefined }));
}
