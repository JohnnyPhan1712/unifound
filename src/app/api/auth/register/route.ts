import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/auth/actions";
import { registerSchema } from "@/lib/auth/schemas";
import { db } from "@/db";
import { users } from "@/db/schema";

/**
 * POST /api/auth/register (CHG-008)
 * Đăng ký tài khoản người dùng mới.
 * Role luôn được backend kiểm soát và mặc định là "USER".
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Dữ liệu đăng ký không hợp lệ.",
        },
        { status: 400 }
      );
    }

    const { email, password, fullName } = parsed.data;

    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error || !data.user) {
      const isConflict = error?.message?.toLowerCase().includes("already registered");
      return NextResponse.json(
        {
          success: false,
          error: error?.message || "Đăng ký không thành công.",
        },
        { status: isConflict ? 409 : 400 }
      );
    }

    // Luôn gán role = USER ở backend, bỏ qua mọi tham số role từ client
    try {
      await db
        .insert(users)
        .values({
          id: data.user.id,
          email: data.user.email ?? email,
          fullName: fullName ?? null,
          role: "USER",
        })
        .onConflictDoNothing({ target: users.id });
    } catch {
      // Bỏ qua lỗi sync nếu db offline hoặc user đã tồn tại
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          fullName: fullName ?? null,
          role: "USER",
        },
      },
      { status: 201 }
    );
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
