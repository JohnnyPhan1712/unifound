import {
  MatchableReport,
  MatchResult,
  PotentialMatch,
  MATCH_RULES,
  MATCH_REASON_TEXTS,
} from "./types";
import { daysBetween, hasSharedKeyword } from "./normalize";

/**
 * Tính điểm trùng khớp giữa Lost Report và Found Report theo quy tắc 30/30/20/20 (DEC-003, CHG-010)
 *
 * @param lost - Tin báo mất (bắt buộc type === 'lost')
 * @param found - Tin nhặt được (bắt buộc type === 'found')
 * @returns MatchResult gồm điểm (0-100) và danh sách lý do được cộng điểm
 */
export function scoreMatch(
  lost: MatchableReport,
  found: MatchableReport
): MatchResult {
  const reasons: string[] = [];

  // Quy tắc cốt lõi: Chỉ so sánh giữa Lost Report và Found Report
  if (!lost || !found || lost.type !== "lost" || found.type !== "found") {
    return { score: 0, reasons: [] };
  }

  let score = 0;

  // 1. Cùng danh mục: 30 điểm
  if (
    lost.category &&
    found.category &&
    lost.category.trim().toLowerCase() === found.category.trim().toLowerCase()
  ) {
    score += MATCH_RULES.SCORE_CATEGORY;
    reasons.push(MATCH_REASON_TEXTS.SAME_CATEGORY);
  }

  // 2. Cùng khu vực: 30 điểm
  if (
    lost.location &&
    found.location &&
    lost.location.trim().toLowerCase() === found.location.trim().toLowerCase()
  ) {
    score += MATCH_RULES.SCORE_LOCATION;
    reasons.push(MATCH_REASON_TEXTS.SAME_LOCATION);
  }

  // 3. Ngày xảy ra chênh lệch không quá 3 ngày: 20 điểm
  const diffDays = daysBetween(lost.eventDate, found.eventDate);
  if (diffDays !== null && diffDays <= MATCH_RULES.MAX_DATE_DIFF_DAYS) {
    score += MATCH_RULES.SCORE_DATE;
    reasons.push(MATCH_REASON_TEXTS.WITHIN_THREE_DAYS);
  }

  // 4. Từ khóa trong title hoặc description tương đồng: 20 điểm
  const lostContent = `${lost.title || ""} ${lost.description || ""}`.trim();
  const foundContent = `${found.title || ""} ${found.description || ""}`.trim();
  if (hasSharedKeyword(lostContent, foundContent)) {
    score += MATCH_RULES.SCORE_KEYWORD;
    reasons.push(MATCH_REASON_TEXTS.SHARED_KEYWORD);
  }

  // Đảm bảo điểm từ 0 đến 100
  const finalScore = Math.min(MATCH_RULES.MAX_SCORE, Math.max(0, score));

  return {
    score: finalScore,
    reasons,
  };
}

/**
 * Tìm kiếm danh sách các tin nhặt được tiềm năng cho một tin báo mất
 * Chỉ trả về các tin nhặt được mở có điểm từ ngưỡng MATCH_RULES.THRESHOLD (>= 50 điểm)
 *
 * @param lostReport - Tin báo mất cần tìm đối sánh
 * @param candidates - Danh sách các tin ứng viên trong hệ thống
 * @returns Danh sách PotentialMatch sắp xếp giảm dần theo điểm số
 */
export function findPotentialMatches<T extends MatchableReport>(
  lostReport: MatchableReport,
  candidates: T[]
): PotentialMatch<T>[] {
  if (!lostReport || lostReport.type !== "lost" || !Array.isArray(candidates)) {
    return [];
  }

  const results: PotentialMatch<T>[] = [];

  for (const candidate of candidates) {
    // Bỏ qua tin không phải found, hoặc đã trao trả / đóng
    if (!candidate || candidate.type !== "found") continue;
    if (candidate.status === "returned" || candidate.status === "closed") continue;

    const match = scoreMatch(lostReport, candidate);
    if (match.score >= MATCH_RULES.THRESHOLD) {
      results.push({
        report: candidate,
        score: match.score,
        reasons: match.reasons,
      });
    }
  }

  // Sắp xếp giảm dần theo điểm số
  return results.sort((a, b) => b.score - a.score);
}
