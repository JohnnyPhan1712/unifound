import { redirect } from "next/navigation";
import { authUrl } from "@/lib/auth/auth-url";
import { getSessionUser } from "@/lib/auth/session";

/** URL cũ: chuyển sang popup đăng nhập trên bảng tin; đã đăng nhập thì về `next`. */
export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next: rawNext, error, reset } = await searchParams;
  // Chỉ nhận đường dẫn nội bộ để tránh open redirect
  const next = typeof rawNext === "string" && rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : undefined;
  const user = await getSessionUser();
  if (user?.status === "active") redirect(next ?? "/");
  redirect(authUrl("login", { next, error: typeof error === "string" ? error : undefined, reset: typeof reset === "string" ? reset : undefined }));
}
