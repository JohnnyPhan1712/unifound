import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/actions";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * GET /api/auth/me (CHG-008)
 * Lấy thông tin người dùng đang đăng nhập trong phiên làm việc hiện tại.
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Bạn cần đăng nhập để truy cập thông tin tài khoản.",
        },
        { status: 401 }
      );
    }

    const profile = await db.query.users.findFirst({
      where: eq(users.id, user.id),
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: profile?.fullName ?? user.user_metadata?.full_name ?? null,
        role: profile?.role ?? "USER",
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Đã có lỗi hệ thống xảy ra.",
      },
      { status: 500 }
    );
  }
}
