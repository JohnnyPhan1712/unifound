import { and, desc, eq, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db, locations, matches, reportImages, reports } from "@/db";
import { isExpired } from "@/lib/reports/expiry";

const lost = alias(reports, "lost");
const found = alias(reports, "found");
const lostLoc = alias(locations, "lost_loc");
const foundLoc = alias(locations, "found_loc");

type ReportAlias = typeof lost | typeof found;
type LocationAlias = typeof lostLoc | typeof foundLoc;

const cover = (r: ReportAlias) =>
  sql<string | null>`(select ${reportImages.imageUrl} from ${reportImages} where ${reportImages.reportId} = ${r.id} order by ${reportImages.position} limit 1)`;

const categoryName = (r: ReportAlias) => sql<string>`(select c.name from categories c where c.id = ${r.categoryId})`;

const side = (r: ReportAlias, loc: LocationAlias) => ({
  id: r.id,
  description: r.description,
  categoryName: categoryName(r),
  userId: r.userId,
  type: r.type,
  title: r.title,
  status: r.status,
  eventTime: r.eventTime,
  expiresAt: r.expiresAt,
  locationName: loc.name,
  cover: cover(r),
});

/** Gợi ý SUGGESTED liên quan tới tin của user; bỏ cặp mà một bên đã đóng, ẩn, đã trả hoặc hết hạn. */
export async function getMyMatches(userId: string, now = new Date()) {
  const rows = await db
    .select({ id: matches.id, score: matches.score, reasons: matches.reasons, createdAt: matches.createdAt, lost: side(lost, lostLoc), found: side(found, foundLoc) })
    .from(matches)
    .innerJoin(lost, eq(matches.lostReportId, lost.id))
    .innerJoin(found, eq(matches.foundReportId, found.id))
    .innerJoin(lostLoc, eq(lost.locationId, lostLoc.id))
    .innerJoin(foundLoc, eq(found.locationId, foundLoc.id))
    .where(and(eq(matches.status, "SUGGESTED"), or(eq(lost.userId, userId), eq(found.userId, userId))))
    .orderBy(desc(matches.score), desc(matches.createdAt));

  return rows
    .map((m) => {
      const mineIsLost = m.lost.userId === userId;
      return { id: m.id, score: m.score, reasons: m.reasons, mine: mineIsLost ? m.lost : m.found, other: mineIsLost ? m.found : m.lost };
    })
    .filter((m) => [m.mine, m.other].every((r) => (r.status === "OPEN" || r.status === "IN_PROGRESS") && !isExpired(r.expiresAt, now)));
}

export type MyMatch = Awaited<ReturnType<typeof getMyMatches>>[number];

/** Số gợi ý còn hiệu lực của một tin (dùng ở chi tiết tin của chủ tin). */
export async function countSuggestions(reportId: string): Promise<number> {
  const rows = await db.execute<{ n: number }>(sql`
    select count(*)::int as n from matches m
    join reports o on o.id = case when m.lost_report_id = ${reportId} then m.found_report_id else m.lost_report_id end
    where m.status = 'SUGGESTED' and (m.lost_report_id = ${reportId} or m.found_report_id = ${reportId})
      and o.status in ('OPEN', 'IN_PROGRESS') and o.expires_at > now()`);
  return rows[0]?.n ?? 0;
}
