import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/actions";
import { reportCreateSchema } from "@/lib/auth/schemas";
import { db } from "@/db";
import { reports } from "@/db/schema";
import { desc } from "drizzle-orm";

/**
 * GET /api/reports (CHG-008)
 * Lấy danh sách các bài đăng Lost/Found công khai.
 */
export async function GET() {
  try {
    const reportList = await db.query.reports.findMany({
      orderBy: [desc(reports.createdAt)],
      limit: 50,
    });

    return NextResponse.json({
      success: true,
      data: reportList,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Đã có lỗi xảy ra khi lấy danh sách bài đăng.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reports (CHG-008 - Secure Post Creation)
 * Tạo bài đăng mới.
 * BẮT BUỘC: Backend tự gán userId từ session người dùng đăng nhập.
 * KHÔNG BAO GIỜ tin tưởng userId gửi từ client.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Bạn cần đăng nhập để tạo bài đăng tìm/nhặt đồ.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = reportCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Dữ liệu bài đăng không hợp lệ.",
        },
        { status: 400 }
      );
    }

    const { type, title, category, location, description, eventDate, imageUrl } =
      parsed.data;

    // Gán userId = user.id từ session xác thực
    const [newReport] = await db
      .insert(reports)
      .values({
        userId: user.id,
        type,
        title,
        category,
        location,
        description,
        eventDate,
        imageUrl: imageUrl ?? null,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        data: newReport,
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
