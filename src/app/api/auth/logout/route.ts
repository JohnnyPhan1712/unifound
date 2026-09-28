import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/auth/actions";

/**
 * POST /api/auth/logout (CHG-008)
 * Đăng xuất và hủy phiên làm việc.
 */
export async function POST() {
  try {
    const supabase = await getSupabaseServerClient();
    await supabase.auth.signOut();

    return NextResponse.json({
      success: true,
      message: "Đăng xuất thành công.",
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Đã có lỗi xảy ra khi đăng xuất.",
      },
      { status: 500 }
    );
  }
}
