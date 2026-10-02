import { and, asc, desc, eq, or, sql } from "drizzle-orm";
import { claimImages, claims, db, locations, reportImages, reports, users } from "@/db";
import { CLAIM_IMAGE_BUCKET } from "@/lib/reports/schemas";
import { createClient } from "@/utils/supabase/server";

const cover = sql<string | null>`(select ${reportImages.imageUrl} from ${reportImages}
  where ${reportImages.reportId} = ${reports.id} order by ${reportImages.position} limit 1)`;

const listColumns = {
  id: claims.id,
  status: claims.status,
  createdAt: claims.createdAt,
  reportId: reports.id,
  reportTitle: reports.title,
  reportType: reports.type,
  reportStatus: reports.status,
  cover,
};

/** Tab "Yêu cầu tôi đã gửi". */
export function listSentClaims(userId: string) {
  return db
    .select(listColumns)
    .from(claims)
    .innerJoin(reports, eq(claims.reportId, reports.id))
    .where(eq(claims.claimantId, userId))
    .orderBy(desc(claims.createdAt));
}

/** Tab "Yêu cầu tôi nhận được": yêu cầu gửi vào tin Nhặt được của tôi. */
export function listReceivedClaims(userId: string) {
  return db
    .select({ ...listColumns, claimantName: users.fullName })
    .from(claims)
    .innerJoin(reports, eq(claims.reportId, reports.id))
    .innerJoin(users, eq(claims.claimantId, users.id))
    .where(eq(reports.userId, userId))
    .orderBy(desc(claims.createdAt));
}

export async function getMyClaimForReport(reportId: string, userId: string) {
  const [row] = await db
    .select({ id: claims.id, status: claims.status, createdAt: claims.createdAt })
    .from(claims)
    .where(and(eq(claims.reportId, reportId), eq(claims.claimantId, userId)));
  return row ?? null;
}

/**
 * Chi tiết yêu cầu (S08). Có câu trả lời xác minh nên chỉ trả về cho claimant hoặc chủ tin;
 * nơi gọi phải kiểm tra `canView` trước khi hiển thị.
 */
export async function getClaimDetail(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [row] = await db
    .select({
      id: claims.id,
      status: claims.status,
      createdAt: claims.createdAt,
      answerText: claims.answerText,
      note: claims.note,
      claimantId: claims.claimantId,
      claimantName: users.fullName,
      meetLocationId: claims.meetLocationId,
      meetTime: claims.meetTime,
      meetLocationName: sql<string | null>`(select ${locations.name} from ${locations} where ${locations.id} = ${claims.meetLocationId})`,
      finderConfirmedAt: claims.finderConfirmedAt,
      ownerConfirmedAt: claims.ownerConfirmedAt,
      report: {
        id: reports.id,
        userId: reports.userId,
        title: reports.title,
        type: reports.type,
        status: reports.status,
        verifyQuestion: reports.verifyQuestion,
        // Chỉ được render cho chủ tin (người nhặt)
        verifyAnswer: reports.verifyAnswer,
        keepingPlace: reports.keepingPlace,
        cover,
      },
    })
    .from(claims)
    .innerJoin(reports, eq(claims.reportId, reports.id))
    .innerJoin(users, eq(claims.claimantId, users.id))
    .where(eq(claims.id, id));
  return row ?? null;
}

export type ClaimDetail = NonNullable<Awaited<ReturnType<typeof getClaimDetail>>>;

/** Chỉ người gửi yêu cầu và chủ tin Nhặt được liên quan được xem câu trả lời xác minh. */
export function canViewClaim(claim: { claimantId: string; report: { userId: string } }, userId: string | undefined): boolean {
  return Boolean(userId) && (claim.claimantId === userId || claim.report.userId === userId);
}

/** Liên hệ hai bên; nơi gọi chỉ dùng khi `canSeeContacts(status)` và người xem là một trong hai bên. */
export async function getHandoverContacts(claim: { claimantId: string; report: { userId: string } }) {
  const rows = await db
    .select({ id: users.id, fullName: users.fullName, email: users.email, contactInfo: users.contactInfo })
    .from(users)
    .where(or(eq(users.id, claim.claimantId), eq(users.id, claim.report.userId)));
  return {
    finder: rows.find((u) => u.id === claim.report.userId) ?? null,
    owner: rows.find((u) => u.id === claim.claimantId) ?? null,
  };
}

/** Yêu cầu gửi vào một tin Nhặt được; chỉ gọi khi người xem là chủ tin. Không trả câu trả lời xác minh. */
export function listClaimsForReport(reportId: string) {
  return db
    .select({ id: claims.id, status: claims.status, createdAt: claims.createdAt, claimantName: users.fullName })
    .from(claims)
    .innerJoin(users, eq(claims.claimantId, users.id))
    .where(eq(claims.reportId, reportId))
    .orderBy(desc(claims.createdAt));
}

/** Ảnh minh chứng riêng tư của yêu cầu, dưới dạng URL ký có hạn 1 giờ; nơi gọi phải kiểm tra `canViewClaim` trước. */
export async function getClaimImageUrls(claimId: string): Promise<string[]> {
  const rows = await db.select({ path: claimImages.imagePath }).from(claimImages).where(eq(claimImages.claimId, claimId)).orderBy(asc(claimImages.position));
  if (!rows.length) return [];
  const supabase = await createClient();
  const { data } = await supabase.storage.from(CLAIM_IMAGE_BUCKET).createSignedUrls(
    rows.map((r) => r.path),
    3600
  );
  return data?.flatMap((d) => (d.signedUrl ? [d.signedUrl] : [])) ?? [];
}
