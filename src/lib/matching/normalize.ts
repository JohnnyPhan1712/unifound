import { MATCH_RULES } from "./types";

/**
 * Chuẩn hóa chuỗi văn bản tiếng Việt thành tập hợp các từ khóa không dấu
 * Độ dài tối thiểu của từ khóa được quy định tại MATCH_RULES.MIN_KEYWORD_LENGTH (>= 4 ký tự)
 */
export function extractKeywords(text?: string | null): Set<string> {
  if (!text || typeof text !== "string") {
    return new Set<string>();
  }

  const normalized = text
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .trim();

  if (!normalized) {
    return new Set<string>();
  }

  const words = normalized
    .split(/\s+/)
    .filter((word) => word.length >= MATCH_RULES.MIN_KEYWORD_LENGTH);

  return new Set(words);
}

/**
 * Kiểm tra xem hai đoạn văn bản có từ khóa trùng khớp hay không
 */
export function hasSharedKeyword(
  first?: string | null,
  second?: string | null
): boolean {
  const left = extractKeywords(first);
  if (left.size === 0) return false;

  const right = extractKeywords(second);
  if (right.size === 0) return false;

  for (const word of left) {
    if (right.has(word)) {
      return true;
    }
  }

  return false;
}

/**
 * Tính số ngày chênh lệch tuyệt đối giữa hai mốc thời gian
 * Trả về null nếu định dạng ngày không hợp lệ hoặc bị thiếu
 */
export function daysBetween(
  first?: string | Date | null,
  second?: string | Date | null
): number | null {
  if (!first || !second) return null;

  try {
    const parseDate = (val: string | Date): Date => {
      if (val instanceof Date) return val;
      const str = String(val).trim();
      // Đảm bảo parse ở mốc 12:00:00Z để tránh lệch múi giờ
      const datePart = str.split("T")[0];
      return new Date(`${datePart}T12:00:00Z`);
    };

    const d1 = parseDate(first);
    const d2 = parseDate(second);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return null;
    }

    return Math.round(Math.abs(d1.getTime() - d2.getTime()) / 86400000);
  } catch {
    return null;
  }
}
