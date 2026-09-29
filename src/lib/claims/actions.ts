"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { db } from "@/db";
import { claims, reports } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";
import { createClaimSchema } from "./schema";
import { eq, and } from "drizzle-orm";

export async function createClaim(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Bạn cần đăng nhập để thực hiện thao tác này." };
  }

  const rawData = {
    reportId: formData.get("reportId"),
    proof: formData.get("proof"),
  };

  const parsed = createClaimSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ." };
  }

  const { reportId, proof } = parsed.data;

  try {
    const report = await db.query.reports.findFirst({
      where: (reports, { eq }) => eq(reports.id, reportId),
    });

    if (!report) {
      return { error: "Không tìm thấy báo cáo." };
    }

    if (report.type !== "found") {
      return { error: "Chỉ có thể gửi yêu cầu cho báo cáo Đồ nhặt được." };
    }

    if (report.status !== "open" && report.status !== "pending") {
      return { error: "Báo cáo này không còn nhận yêu cầu." };
    }

    if (report.userId === user.id) {
      return { error: "Bạn không thể tự gửi yêu cầu cho báo cáo của chính mình." };
    }

    const existingClaim = await db.query.claims.findFirst({
      where: (claims, { eq, and }) =>
        and(eq(claims.reportId, reportId), eq(claims.claimantId, user.id)),
    });

    if (existingClaim) {
      return { error: "Bạn đã gửi yêu cầu cho món đồ này rồi." };
    }

    await db.insert(claims).values({
      reportId,
      claimantId: user.id,
      proof,
      status: "pending",
    });

    revalidatePath(`/reports/${reportId}`);
    return { success: true };
  } catch (err: any) {
    console.error("Create claim error:", err);
    return { error: "Đã xảy ra lỗi khi tạo yêu cầu. Vui lòng thử lại sau." };
  }
}

export async function acceptClaim(claimId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Bạn cần đăng nhập để thực hiện thao tác này." };
  }

  try {
    const claim = await db.query.claims.findFirst({
      where: (claims, { eq }) => eq(claims.id, claimId),
      with: {
        report: true,
      },
    });

    if (!claim) {
      return { error: "Không tìm thấy yêu cầu." };
    }

    if (claim.report.userId !== user.id) {
      return { error: "Bạn không có quyền duyệt yêu cầu này." };
    }

    if (claim.status !== "pending") {
      return { error: "Yêu cầu này không ở trạng thái chờ duyệt." };
    }

    await db.transaction(async (tx) => {
      // Reject other pending claims for this report
      await tx
        .update(claims)
        .set({ status: "rejected", updatedAt: new Date() })
        .where(
          and(
            eq(claims.reportId, claim.reportId),
            eq(claims.status, "pending")
          )
        );

      // Accept this claim
      await tx
        .update(claims)
        .set({ status: "accepted", updatedAt: new Date() })
        .where(eq(claims.id, claimId));

      // Update report status
      await tx
        .update(reports)
        .set({ status: "returned", updatedAt: new Date() })
        .where(eq(reports.id, claim.reportId));
    });

    revalidatePath(`/reports/${claim.reportId}`);
    return { success: true };
  } catch (err: any) {
    console.error("Accept claim error:", err);
    return { error: "Đã xảy ra lỗi khi duyệt yêu cầu." };
  }
}

export async function rejectClaim(claimId: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Bạn cần đăng nhập để thực hiện thao tác này." };
  }

  try {
    const claim = await db.query.claims.findFirst({
      where: (claims, { eq }) => eq(claims.id, claimId),
      with: {
        report: true,
      },
    });

    if (!claim) {
      return { error: "Không tìm thấy yêu cầu." };
    }

    if (claim.report.userId !== user.id) {
      return { error: "Bạn không có quyền từ chối yêu cầu này." };
    }

    if (claim.status !== "pending") {
      return { error: "Yêu cầu này không ở trạng thái chờ duyệt." };
    }

    await db
      .update(claims)
      .set({ status: "rejected", updatedAt: new Date() })
      .where(eq(claims.id, claimId));

    revalidatePath(`/reports/${claim.reportId}`);
    return { success: true };
  } catch (err: any) {
    console.error("Reject claim error:", err);
    return { error: "Đã xảy ra lỗi khi từ chối yêu cầu." };
  }
}
