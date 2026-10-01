import type { ClaimStatus, ReportStatus, ReportType } from "@/db/schema";

export const CLAIM_TTL_DAYS = 7;
const DAY_MS = 86_400_000;

/** Chuyển trạng thái hợp lệ của yêu cầu nhận đồ; mọi chuyển khác bị từ chối. */
const TRANSITIONS: Record<ClaimStatus, ClaimStatus[]> = {
  PENDING: ["ACCEPTED", "REJECTED"],
  ACCEPTED: ["COMPLETED"],
  REJECTED: [],
  COMPLETED: [],
  EXPIRED: [],
};

export function canTransition(from: ClaimStatus, to: ClaimStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

/** Không có tác vụ nền: PENDING quá 7 ngày được coi là EXPIRED khi đọc. */
export function effectiveClaimStatus(claim: { status: ClaimStatus; createdAt: Date }, now = new Date()): ClaimStatus {
  if (claim.status === "PENDING" && now.getTime() - claim.createdAt.getTime() >= CLAIM_TTL_DAYS * DAY_MS) return "EXPIRED";
  return claim.status;
}

type ReportForClaim = { userId: string; type: ReportType; status: ReportStatus; expiresAt: Date };

/** Luật gửi yêu cầu (FR09); trả thông báo lỗi tiếng Việt hoặc null nếu hợp lệ. */
export function claimSubmitError(
  report: ReportForClaim,
  userId: string,
  hasExisting: boolean,
  now = new Date()
): string | null {
  if (report.type !== "FOUND") return "Chỉ gửi yêu cầu nhận đồ cho tin Nhặt được.";
  if (report.userId === userId) return "Bạn không thể gửi yêu cầu vào tin của chính mình.";
  if (hasExisting) return "Bạn đã gửi yêu cầu cho tin này, hãy chờ người nhặt phản hồi.";
  if (report.status !== "OPEN" || report.expiresAt.getTime() <= now.getTime()) return "Tin này không còn nhận yêu cầu.";
  return null;
}
