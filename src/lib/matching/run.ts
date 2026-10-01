import { and, eq, gt, gte, ne } from "drizzle-orm";
import { db, locations, matches, reports, schools } from "@/db";
import { notify } from "@/lib/notifications";
import { REPORT_TYPE_LABEL } from "@/lib/labels";
import { isCandidate, MATCH_WINDOW_DAYS, scorePair, shouldSuggest, type MatchInput } from "./score";

const matchColumns = {
  id: reports.id,
  userId: reports.userId,
  type: reports.type,
  status: reports.status,
  categoryId: reports.categoryId,
  locationId: reports.locationId,
  locationName: locations.name,
  schoolId: locations.schoolId,
  schoolName: schools.name,
  eventTime: reports.eventTime,
  createdAt: reports.createdAt,
  expiresAt: reports.expiresAt,
  title: reports.title,
  description: reports.description,
};

function selectReports() {
  return db
    .select(matchColumns)
    .from(reports)
    .innerJoin(locations, eq(reports.locationId, locations.id))
    .leftJoin(schools, eq(locations.schoolId, schools.id));
}

/** Chạy ngay sau khi đăng tin: tìm tin đối ứng, lưu gợi ý score >= 50 và báo cho cả hai bên. Trả số gợi ý mới. */
export async function runMatching(reportId: string, now = new Date()): Promise<number> {
  const [source] = await selectReports().where(eq(reports.id, reportId));
  if (!source || source.status !== "OPEN") return 0;

  // Lọc thô bằng SQL, rồi lọc lại bằng isCandidate để luật nằm ở một chỗ có unit test
  const pool: MatchInput[] = await selectReports().where(
    and(
      ne(reports.type, source.type),
      eq(reports.categoryId, source.categoryId),
      eq(reports.status, "OPEN"),
      ne(reports.userId, source.userId),
      gt(reports.expiresAt, now),
      gte(reports.createdAt, new Date(now.getTime() - MATCH_WINDOW_DAYS * 86_400_000))
    )
  );

  let created = 0;
  for (const other of pool.filter((o) => isCandidate(source, o, now))) {
    const result = scorePair(source, other);
    if (!shouldSuggest(result)) continue;
    const [lost, found] = source.type === "LOST" ? [source, other] : [other, source];
    // Cặp đã có (kể cả DISMISSED) không tạo lại → "Không phải" không bị gợi ý lại
    const inserted = await db
      .insert(matches)
      .values({ lostReportId: lost.id, foundReportId: found.id, score: result.score, reasons: result.reasons })
      .onConflictDoNothing()
      .returning({ id: matches.id });
    if (!inserted.length) continue;
    created++;
    await notify([
      {
        userId: source.userId,
        type: "MATCH",
        message: `Có tin ${REPORT_TYPE_LABEL[other.type].toLowerCase()} “${other.title}” có thể khớp với tin “${source.title}” của bạn (${result.score} điểm).`,
        link: "/matches",
      },
      {
        userId: other.userId,
        type: "MATCH",
        message: `Tin mới “${source.title}” có thể khớp với tin “${other.title}” của bạn (${result.score} điểm).`,
        link: "/matches",
      },
    ]);
  }
  return created;
}

/** Lỗi matching không được làm hỏng việc đăng tin (tin đã lưu trước đó). */
export async function runMatchingSafely(reportId: string, run: (id: string) => Promise<number> = runMatching): Promise<boolean> {
  try {
    await run(reportId);
    return true;
  } catch (error) {
    console.error("[matching] lỗi khi chạy gợi ý cho tin", reportId, error);
    return false;
  }
}
