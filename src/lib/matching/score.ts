import type { ReportStatus, ReportType } from "@/db/schema";

// Trọng số theo 02_requirements_design.md mục 11; đổi ở đây thì ghi lại trong CHG.
export const MATCH_THRESHOLD = 50;
export const MATCH_WINDOW_DAYS = 14;
export const POINTS = { location: 40, school: 15, within1Day: 25, within3Days: 15, otherTime: 5, perKeyword: 5, keywordMax: 20 };
const DAY_MS = 86_400_000;

export type MatchInput = {
  id: string;
  userId: string;
  type: ReportType;
  status: ReportStatus;
  categoryId: string;
  locationId: string | null;
  locationName?: string | null;
  schoolId: string | null;
  schoolName?: string | null;
  eventTime: Date | null;
  createdAt: Date;
  expiresAt: Date;
  title: string;
  description: string | null;
};

/** Bước 1 — lọc: loại đối ứng, cùng danh mục, đang mở, còn hạn, đăng trong 14 ngày, không phải tin của chính mình. */
export function isCandidate(source: MatchInput, other: MatchInput, now: Date): boolean {
  return (
    other.id !== source.id &&
    other.userId !== source.userId &&
    other.type !== source.type &&
    other.categoryId === source.categoryId &&
    other.status === "OPEN" &&
    other.expiresAt.getTime() > now.getTime() &&
    other.createdAt.getTime() >= now.getTime() - MATCH_WINDOW_DAYS * DAY_MS
  );
}

// Từ quá phổ biến trong tin đồ thất lạc, không giúp phân biệt món đồ
const STOPWORDS = new Set(
  "của và có tôi bị mất nhặt được ở tại trong một là này đã lúc khi cho với các những ai đồ bên sau trước gần rơi quên để thấy nhờ giúp bạn mình em anh chị màu không rất hơi lại ra vào từ trên dưới hay hoặc thì mà nhé ạ".split(
    " "
  )
);

/** Tách từ khóa: chữ thường, chuẩn hóa Unicode, bỏ dấu câu, bỏ từ dừng và từ 1 ký tự. */
export function keywords(text: string): Set<string> {
  const words = text.normalize("NFC").toLowerCase().split(/[^\p{L}\p{N}]+/u);
  return new Set(words.filter((w) => w.length >= 2 && !STOPWORDS.has(w)));
}

export type MatchResult = { score: number; reasons: string[] };

/** Bước 2 — chấm điểm. Thuần và deterministic; field thiếu không cộng điểm. */
export function scorePair(a: MatchInput, b: MatchInput): MatchResult {
  let score = 0;
  const reasons: string[] = [];

  if (a.locationId && a.locationId === b.locationId) {
    score += POINTS.location;
    reasons.push(`Cùng địa điểm${a.locationName ? `: ${a.locationName}` : ""} (+${POINTS.location})`);
  } else if (a.schoolId && a.schoolId === b.schoolId) {
    score += POINTS.school;
    reasons.push(`Cùng trường${a.schoolName ? `: ${a.schoolName}` : ""} (+${POINTS.school})`);
  }

  if (a.eventTime && b.eventTime) {
    const days = Math.abs(a.eventTime.getTime() - b.eventTime.getTime()) / DAY_MS;
    const pts = days <= 1 ? POINTS.within1Day : days <= 3 ? POINTS.within3Days : POINTS.otherTime;
    score += pts;
    reasons.push(days <= 1 ? `Thời gian cách nhau ≤ 1 ngày (+${pts})` : days <= 3 ? `Thời gian cách nhau ≤ 3 ngày (+${pts})` : `Thời gian cách nhau hơn 3 ngày (+${pts})`);
  }

  const ka = keywords(`${a.title} ${a.description ?? ""}`);
  const shared = [...keywords(`${b.title} ${b.description ?? ""}`)].filter((w) => ka.has(w)).sort();
  if (shared.length) {
    const pts = Math.min(POINTS.keywordMax, shared.length * POINTS.perKeyword);
    score += pts;
    reasons.push(`Trùng từ khóa: ${shared.slice(0, 6).join(", ")} (+${pts})`);
  }

  return { score: Math.max(0, Math.min(100, score)), reasons };
}

export function shouldSuggest(result: MatchResult): boolean {
  return result.score >= MATCH_THRESHOLD;
}
