import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, getCurrentUserProfile } from "@/lib/auth/actions";
import { assertUserOwnsReport, ForbiddenError } from "@/lib/auth/ownership";
import { reportUpdateSchema } from "@/lib/auth/schemas";
import { db } from "@/db";
import { reports } from "@/db/schema";
import { eq } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/reports/:id
 * Lấy chi tiết một bài đăng Lost/Found.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const report = await db.query.reports.findFirst({
      where: eq(reports.id, id),
    });

    if (!report) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy bài đăng." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: report });
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

/**
 * PUT /api/reports/:id (CHG-008 - Ownership Enforced Update)
 * Cập nhật bài đăng.
 * CHỈ chủ bài đăng (USER) hoặc ADMIN mới có quyền sửa.
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Bạn cần đăng nhập để sửa bài đăng." },
        { status: 401 }
      );
    }

    const report = await db.query.reports.findFirst({
      where: eq(reports.id, id),
    });

    if (!report) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy bài đăng để cập nhật." },
        { status: 404 }
      );
    }

    const profile = await getCurrentUserProfile();

    // Enforce Ownership & Authorization
    try {
      assertUserOwnsReport(report, {
        id: user.id,
        role: profile?.role ?? "USER",
      });
    } catch (err: unknown) {
      if (err instanceof ForbiddenError) {
        return NextResponse.json(
          { success: false, error: err.message },
          { status: 403 }
        );
      }
      throw err;
    }

    const body = await request.json();
    const parsed = reportUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || "Dữ liệu cập nhật không hợp lệ.",
        },
        { status: 400 }
      );
    }

    // Cập nhật an toàn: không cho phép ghi đè userId hoặc id
    const { ...safeUpdates } = parsed.data;

    const [updatedReport] = await db
      .update(reports)
      .set({
        ...safeUpdates,
        updatedAt: new Date(),
      })
      .where(eq(reports.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      data: updatedReport,
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

/**
 * DELETE /api/reports/:id (CHG-008 - Ownership Enforced Delete)
 * Xóa bài đăng.
 * CHỈ chủ bài đăng (USER) hoặc ADMIN mới có quyền xóa.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Bạn cần đăng nhập để xóa bài đăng." },
        { status: 401 }
      );
    }

    const report = await db.query.reports.findFirst({
      where: eq(reports.id, id),
    });

    if (!report) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy bài đăng để xóa." },
        { status: 404 }
      );
    }

    const profile = await getCurrentUserProfile();

    // Enforce Ownership & Authorization
    try {
      assertUserOwnsReport(report, {
        id: user.id,
        role: profile?.role ?? "USER",
      });
    } catch (err: unknown) {
      if (err instanceof ForbiddenError) {
        return NextResponse.json(
          { success: false, error: err.message },
          { status: 403 }
        );
      }
      throw err;
    }

    await db.delete(reports).where(eq(reports.id, id));

    return NextResponse.json({
      success: true,
      message: "Đã xóa bài đăng thành công.",
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
