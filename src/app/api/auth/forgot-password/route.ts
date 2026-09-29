import { NextRequest, NextResponse } from "next/server";
import { resetPasswordForEmailAction } from "@/lib/auth/actions";

/**
 * POST /api/auth/forgot-password
 * Yêu cầu gửi email khôi phục mật khẩu.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        {
          success: false,
          error: "Vui lòng cung cấp địa chỉ email sinh viên hợp lệ.",
        },
        { status: 400 }
      );
    }

    const res = await resetPasswordForEmailAction(email);
    if (!res.success) {
      return NextResponse.json(
        { success: false, error: res.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email hướng dẫn đặt lại mật khẩu đã được gửi.",
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
