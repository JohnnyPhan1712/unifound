import { and, count, desc, eq, gte, ne, sql } from "drizzle-orm";
import { categories, db, reports } from "@/db";

export const STATS_WEEKS = 8;
const TZ_OFFSET_MS = 7 * 3_600_000; // Asia/Ho_Chi_Minh, không có giờ mùa hè

/** Tỉ lệ % làm tròn; không chia cho 0. */
export function percent(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

/** Ngày thứ Hai (YYYY-MM-DD, giờ Việt Nam) của tuần chứa thời điểm d. */
export function weekKey(d: Date): string {
  const local = new Date(d.getTime() + TZ_OFFSET_MS);
  const dow = (local.getUTCDay() + 6) % 7; // 0 = thứ Hai
  local.setUTCDate(local.getUTCDate() - dow);
  return local.toISOString().slice(0, 10);
}

/** Đủ N tuần gần nhất (cũ → mới), tuần không có tin thì 0. */
export function fillWeeks(rows: { week: string; n: number }[], now: Date, weeks = STATS_WEEKS) {
  const byWeek = new Map(rows.map((r) => [r.week, r.n]));
  return Array.from({ length: weeks }, (_, i) => {
    const week = weekKey(new Date(now.getTime() - (weeks - 1 - i) * 7 * 86_400_000));
    return { week, n: byWeek.get(week) ?? 0 };
  });
}

/** Số liệu tổng quan (FR16). Không tính tin bị ẩn. */
export async function getStats(now = new Date()) {
  const visible = ne(reports.status, "HIDDEN");
  const since = new Date(`${weekKey(new Date(now.getTime() - (STATS_WEEKS - 1) * 7 * 86_400_000))}T00:00:00+07:00`);
  const localWeek = sql<string>`to_char(date_trunc('week', ${reports.createdAt} at time zone 'Asia/Ho_Chi_Minh'), 'YYYY-MM-DD')`;

  const [byType, byStatus, weekly, topCategories] = await Promise.all([
    db.select({ type: reports.type, n: count() }).from(reports).where(visible).groupBy(reports.type),
    db.select({ status: reports.status, n: count() }).from(reports).where(and(visible, eq(reports.type, "FOUND"))).groupBy(reports.status),
    db
      .select({ week: localWeek, n: count() })
      .from(reports)
      .where(and(visible, gte(reports.createdAt, since)))
      .groupBy(localWeek),
    db
      .select({ name: categories.name, n: count() })
      .from(reports)
      .innerJoin(categories, eq(reports.categoryId, categories.id))
      .where(visible)
      .groupBy(categories.name)
      .orderBy(desc(count()), categories.name)
      .limit(5),
  ]);

  const lost = byType.find((r) => r.type === "LOST")?.n ?? 0;
  const found = byType.find((r) => r.type === "FOUND")?.n ?? 0;
  const returned = byStatus.find((r) => r.status === "RETURNED")?.n ?? 0;
  return {
    total: lost + found,
    lost,
    found,
    returned,
    // Chỉ tin Nhặt được mới có thể chuyển sang Đã trả, nên tỉ lệ tính trên số tin Nhặt được
    returnedRate: percent(returned, found),
    weekly: fillWeeks(weekly, now),
    topCategories,
  };
}
