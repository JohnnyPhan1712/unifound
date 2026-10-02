import { cache } from "react";
import { and, asc, count, desc, eq, gt, gte, inArray, lt, or, sql, type SQL } from "drizzle-orm";
import { categories, db, locations, reportImages, reports, schools, users, type ReportStatus, type ReportType } from "@/db";
import { parseLocalDateTime } from "./schemas";

export const PAGE_SIZE = 12;
/** Trạng thái hiện trên bảng tin; CLOSED và HIDDEN không hiện, RETURNED hiện kèm nhãn "Đã trả". */
export const FEED_STATUSES: ReportStatus[] = ["OPEN", "IN_PROGRESS", "RETURNED"];

export type FeedParams = {
  /** ALL = cả hai loại (tab "Tất cả"). */
  type: ReportType | "ALL";
  q: string;
  categoryId?: string;
  schoolId?: string;
  locationId?: string;
  from?: string;
  to?: string;
  page: number;
};

type Raw = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)?.trim() ?? "";
const uuidOrUndef = (v: string) => (/^[0-9a-f-]{36}$/i.test(v) ? v : undefined);
const dateOrUndef = (v: string) => (/^\d{4}-\d{2}-\d{2}$/.test(v) ? v : undefined);

/** Chuẩn hóa searchParams của bảng tin; giá trị lạ bị bỏ qua thay vì gây lỗi. */
export function parseFeedParams(raw: Raw): FeedParams {
  const page = Number.parseInt(one(raw.page), 10);
  return {
    type: one(raw.type) === "FOUND" ? "FOUND" : one(raw.type) === "LOST" ? "LOST" : "ALL",
    q: one(raw.q).slice(0, 100),
    categoryId: uuidOrUndef(one(raw.category)),
    schoolId: uuidOrUndef(one(raw.school)),
    locationId: uuidOrUndef(one(raw.location)),
    from: dateOrUndef(one(raw.from)),
    to: dateOrUndef(one(raw.to)),
    page: Number.isFinite(page) && page > 0 ? Math.min(page, 1000) : 1,
  };
}

/** Bỏ dấu tiếng Việt: "Ví da" → "vi da". */
export const removeTones = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase();

// translate() của Postgres bỏ dấu ngay trong SQL, không cần extension unaccent hay đổi schema.
const TONED: Record<string, string> = {
  a: "àáạảãâầấậẩẫăằắặẳẵ",
  e: "èéẹẻẽêềếệểễ",
  i: "ìíịỉĩ",
  o: "òóọỏõôồốộổỗơờớợởỡ",
  u: "ùúụủũưừứựửữ",
  y: "ỳýỵỷỹ",
  d: "đ",
};
const TONED_FROM = Object.values(TONED).join("");
const TONED_TO = Object.entries(TONED)
  .map(([plain, chars]) => plain.repeat(chars.length))
  .join("");

/** Khớp không dấu (gõ "vi" ra "ví") trên tiêu đề + mô tả; không dùng index nên chỉ hợp quy mô nhỏ. */
function unaccentedMatch(q: string): SQL {
  const pattern = `%${removeTones(q).replace(/[\\%_]/g, "\\$&")}%`;
  return sql`translate(${reports.title} || ' ' || coalesce(${reports.description}, ''), ${TONED_FROM + TONED_FROM.toUpperCase()}, ${TONED_TO + TONED_TO}) ilike ${pattern}`;
}

/** Điều kiện SQL của bảng tin: còn hạn, đúng trạng thái công khai, cộng các bộ lọc. */
export function feedConditions(p: FeedParams, now: Date): SQL {
  const conds: (SQL | undefined)[] = [
    p.type === "ALL" ? undefined : eq(reports.type, p.type),
    inArray(reports.status, FEED_STATUSES),
    gt(reports.expiresAt, now),
    p.categoryId ? eq(reports.categoryId, p.categoryId) : undefined,
    p.locationId ? eq(reports.locationId, p.locationId) : undefined,
    p.schoolId ? eq(locations.schoolId, p.schoolId) : undefined,
    p.from ? gte(reports.eventTime, parseLocalDateTime(`${p.from}T00:00`)!) : undefined,
    // "đến ngày" tính hết ngày đó
    p.to ? lt(reports.eventTime, new Date(parseLocalDateTime(`${p.to}T00:00`)!.getTime() + 86_400_000)) : undefined,
    p.q ? or(sql`${reports.searchVector} @@ websearch_to_tsquery('simple', ${p.q})`, unaccentedMatch(p.q)) : undefined,
  ];
  return and(...conds)!;
}

/** Tin công khai (không HIDDEN). Dùng cho chi tiết tin; tin hết hạn vẫn xem được kèm nhãn. */
export function isPubliclyVisible(r: { status: ReportStatus }): boolean {
  return r.status !== "HIDDEN";
}

const coverImage = sql<string | null>`(select ${reportImages.imageUrl} from ${reportImages}
  where ${reportImages.reportId} = ${reports.id} order by ${reportImages.position} limit 1)`;

/** Cột an toàn để hiện công khai: KHÔNG có verify_answer hay thông tin liên hệ. */
export const publicReportColumns = {
  id: reports.id,
  userId: reports.userId,
  type: reports.type,
  title: reports.title,
  description: reports.description,
  status: reports.status,
  eventTime: reports.eventTime,
  createdAt: reports.createdAt,
  expiresAt: reports.expiresAt,
  keepingPlace: reports.keepingPlace,
  categoryId: reports.categoryId,
  locationId: reports.locationId,
  categoryName: categories.name,
  locationName: locations.name,
  schoolName: schools.name,
  schoolId: locations.schoolId,
};

export async function getFeed(p: FeedParams, now = new Date()) {
  const where = feedConditions(p, now);
  const base = () =>
    db
      .select({ ...publicReportColumns, cover: coverImage })
      .from(reports)
      .innerJoin(categories, eq(reports.categoryId, categories.id))
      .innerJoin(locations, eq(reports.locationId, locations.id))
      .leftJoin(schools, eq(locations.schoolId, schools.id));

  const [items, [{ total }]] = await Promise.all([
    base()
      .where(where)
      .orderBy(desc(reports.createdAt))
      .limit(PAGE_SIZE)
      .offset((p.page - 1) * PAGE_SIZE),
    db
      .select({ total: count() })
      .from(reports)
      .innerJoin(locations, eq(reports.locationId, locations.id))
      .where(where),
  ]);
  return { items, total, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export type FeedItem = Awaited<ReturnType<typeof getFeed>>["items"][number];

/** cache: generateMetadata và page dùng chung một truy vấn trong cùng request. */
export const getReport = cache(async (id: string) => {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [row] = await db
    .select({ ...publicReportColumns, ownerName: users.fullName, ownerSince: users.createdAt })
    .from(reports)
    .innerJoin(categories, eq(reports.categoryId, categories.id))
    .innerJoin(locations, eq(reports.locationId, locations.id))
    .leftJoin(schools, eq(locations.schoolId, schools.id))
    .innerJoin(users, eq(reports.userId, users.id))
    .where(eq(reports.id, id));
  if (!row) return null;
  const [{ n: ownerReports }] = await db
    .select({ n: count() })
    .from(reports)
    .where(and(eq(reports.userId, row.userId), inArray(reports.status, FEED_STATUSES)));
  const images = await db
    .select({ path: reportImages.imageUrl })
    .from(reportImages)
    .where(eq(reportImages.reportId, id))
    .orderBy(asc(reportImages.position));
  return { ...row, ownerReports, images: images.map((i) => i.path) };
});

export type PublicReport = NonNullable<Awaited<ReturnType<typeof getReport>>>;

const sevenDaysAgo = sql`now() - interval '7 days'`;

/** "Tin của tôi": mọi trạng thái, kể cả đã ẩn/hết hạn; kèm số yêu cầu và gợi ý để biết bước tiếp theo. */
export async function getMyReports(userId: string) {
  return db
    .select({
      ...publicReportColumns,
      cover: coverImage,
      pendingClaims: sql<number>`(select count(*)::int from claims c where c.report_id = ${reports.id} and c.status = 'PENDING' and c.created_at > ${sevenDaysAgo})`,
      acceptedClaims: sql<number>`(select count(*)::int from claims c where c.report_id = ${reports.id} and c.status in ('ACCEPTED', 'COMPLETED'))`,
      suggestions: sql<number>`(select count(*)::int from matches m
        join reports o on o.id = case when m.lost_report_id = ${reports.id} then m.found_report_id else m.lost_report_id end
        where m.status = 'SUGGESTED' and (m.lost_report_id = ${reports.id} or m.found_report_id = ${reports.id})
          and o.status in ('OPEN', 'IN_PROGRESS') and o.expires_at > now())`,
    })
    .from(reports)
    .innerJoin(categories, eq(reports.categoryId, categories.id))
    .innerJoin(locations, eq(reports.locationId, locations.id))
    .leftJoin(schools, eq(locations.schoolId, schools.id))
    .where(eq(reports.userId, userId))
    .orderBy(desc(reports.createdAt));
}
