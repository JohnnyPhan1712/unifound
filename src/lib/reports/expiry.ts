export const REPORT_TTL_DAYS = 60;
const DAY_MS = 86_400_000;

/** expires_at = created_at + 60 ngày (FR05). */
export function expiresAtFrom(createdAt: Date): Date {
  return new Date(createdAt.getTime() + REPORT_TTL_DAYS * DAY_MS);
}

/** Không có tác vụ nền: tin quá expires_at được coi là hết hạn khi truy vấn. */
export function isExpired(expiresAt: Date, now = new Date()): boolean {
  return expiresAt.getTime() <= now.getTime();
}
