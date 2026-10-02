import { redirect } from "next/navigation";
import { authUrl } from "@/lib/auth/auth-url";
import { getCurrentUser } from "@/lib/auth/session";

/** URL cũ: chuyển sang popup đăng ký trên bảng tin. */
export default async function RegisterPage() {
  redirect((await getCurrentUser()) ? "/" : authUrl("register"));
}
