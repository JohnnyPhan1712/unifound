/**
 * Kiểu dữ liệu và hằng số cho module gợi ý trùng khớp (Matching Module)
 * Theo DEC-003 và CHG-010
 */

export interface MatchableReport {
  id?: string | number;
  type: "lost" | "found" | string;
  title: string;
  category: string;
  location: string;
  description?: string | null;
  eventDate: string | Date;
  status?: string | null;
}

export interface MatchResult {
  score: number;
  reasons: string[];
}

export interface PotentialMatch<T extends MatchableReport = MatchableReport> {
  report: T;
  score: number;
  reasons: string[];
}

export const MATCH_RULES = {
  SCORE_CATEGORY: 30,
  SCORE_LOCATION: 30,
  SCORE_DATE: 20,
  SCORE_KEYWORD: 20,
  MAX_SCORE: 100,
  THRESHOLD: 50,
  MAX_DATE_DIFF_DAYS: 3,
  MIN_KEYWORD_LENGTH: 4,
} as const;

export const MATCH_REASON_TEXTS = {
  SAME_CATEGORY: "Cùng danh mục +30",
  SAME_LOCATION: "Cùng khu vực +30",
  WITHIN_THREE_DAYS: "Trong 3 ngày +20",
  SHARED_KEYWORD: "Có từ khóa chung +20",
} as const;
