import { NextResponse, type NextRequest } from "next/server";
import { ensureUserRow } from "@/lib/auth/session";
import { createClient } from "@/utils/supabase/server";

/** Đích của liên kết "đặt lại mật khẩu" trong mail: đổi `code` lấy phiên tạm rồi sang trang đặt mật khẩu mới. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      const user = await ensureUserRow(data.user.id, data.user.email ?? "");
      if (user.status === "locked") {
        await supabase.auth.signOut();
        return NextResponse.redirect(new URL("/login?error=locked", origin));
      }
      return NextResponse.redirect(new URL("/reset-password", origin));
    }
  }
  return NextResponse.redirect(new URL("/forgot-password?error=expired", origin));
}
