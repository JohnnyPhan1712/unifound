import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/auth/actions";
import { loginSchema } from "@/lib/auth/schemas";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * POST /api/auth/login (CHG-008)
 * Đăng nhập người dùng bằng email và mật khẩu.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Thông tin đăng nhập không hợp lệ.",
        },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Email hoặc mật khẩu không chính xác.",
        },
        { status: 401 }
      );
    }

    // Lấy thông tin profile và role từ bảng users
    let profile = await db.query.users.findFirst({
      where: eq(users.id, data.user.id),
    });

    if (!profile) {
      // Tự động đồng bộ profile nếu chưa có
      try {
        await db
          .insert(users)
          .values({
            id: data.user.id,
            email: data.user.email ?? email,
            fullName: data.user.user_metadata?.full_name ?? null,
            role: "USER",
          })
          .onConflictDoNothing({ target: users.id });

        profile = await db.query.users.findFirst({
          where: eq(users.id, data.user.id),
        });
      } catch {
        // Bỏ qua lỗi DB sync
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName: profile?.fullName ?? data.user.user_metadata?.full_name ?? null,
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
