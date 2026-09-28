import { and, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { cache } from "react";
import { db, reports } from "@/db";
import { escapeLikePattern, type ReportFilters } from "./report-validation";

export const FEED_LIMIT = 50;

// Public pages must never select owner identity, contact details or claim verification data.
const publicReportColumns = {
  id: reports.id,
  type: reports.type,
  title: reports.title,
  category: reports.category,
  location: reports.location,
  description: reports.description,
  eventDate: reports.eventDate,
  status: reports.status,
  createdAt: reports.createdAt,
};

export async function listPublicReports(filters: ReportFilters) {
  const conditions: SQL[] = [];
  if (filters.type) conditions.push(eq(reports.type, filters.type));
  if (filters.category) conditions.push(eq(reports.category, filters.category));
  if (filters.location) conditions.push(eq(reports.location, filters.location));
  if (filters.q) {
    const pattern = `%${escapeLikePattern(filters.q)}%`;
    const keyword = or(ilike(reports.title, pattern), ilike(reports.description, pattern));
    if (keyword) conditions.push(keyword);
  }

  const rows = await db
    .select(publicReportColumns)
    .from(reports)
    .where(and(...conditions))
    .orderBy(desc(reports.createdAt))
    .limit(FEED_LIMIT + 1);

  return { reports: rows.slice(0, FEED_LIMIT), hasMore: rows.length > FEED_LIMIT };
}

export type PublicReport = Awaited<ReturnType<typeof listPublicReports>>["reports"][number];

export const getPublicReport = cache(async (id: string): Promise<PublicReport | null> => {
  const [report] = await db
    .select(publicReportColumns)
    .from(reports)
    .where(eq(reports.id, id))
    .limit(1);
  return report ?? null;
});

// Extended columns for detail page: includes imageUrl and userId for claim logic (CHG-011).
// NOT exported as PublicReport to prevent accidental exposure in feed queries.
const detailReportColumns = {
  ...publicReportColumns,
  imageUrl: reports.imageUrl,
  userId: reports.userId,
};

export type DetailReport = Awaited<ReturnType<typeof getReportDetail>>;

export const getReportDetail = cache(async (id: string) => {
  const [report] = await db
    .select(detailReportColumns)
    .from(reports)
    .where(eq(reports.id, id))
    .limit(1);
  return report ?? null;
});
