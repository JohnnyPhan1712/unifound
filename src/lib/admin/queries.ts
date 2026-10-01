import { asc, count, desc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db, flags, reports, users } from "@/db";

const reporter = alias(users, "reporter");
const owner = alias(users, "owner");

/** Hàng đợi báo cáo NEW, gom theo tin. */
export async function getFlagQueue() {
  const rows = await db
    .select({
      flagId: flags.id,
      reason: flags.reason,
      createdAt: flags.createdAt,
      reporterEmail: reporter.email,
      reportId: reports.id,
      reportTitle: reports.title,
      reportType: reports.type,
      reportStatus: reports.status,
      ownerId: owner.id,
      ownerEmail: owner.email,
      ownerStatus: owner.status,
      ownerRole: owner.role,
    })
    .from(flags)
    .innerJoin(reports, eq(flags.reportId, reports.id))
    .innerJoin(reporter, eq(flags.reporterId, reporter.id))
    .innerJoin(owner, eq(reports.userId, owner.id))
    .where(eq(flags.status, "NEW"))
    .orderBy(asc(flags.createdAt));

  const groups = new Map<string, { report: (typeof rows)[number]; flags: typeof rows }>();
  for (const r of rows) {
    const g = groups.get(r.reportId) ?? { report: r, flags: [] };
    g.flags.push(r);
    groups.set(r.reportId, g);
  }
  return [...groups.values()];
}

export async function listUsers() {
  const reportCounts = db
    .select({ userId: reports.userId, n: count().as("n") })
    .from(reports)
    .groupBy(reports.userId)
    .as("rc");
  return db
    .select({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      role: users.role,
      status: users.status,
      createdAt: users.createdAt,
      reports: reportCounts.n,
    })
    .from(users)
    .leftJoin(reportCounts, eq(reportCounts.userId, users.id))
    .orderBy(desc(users.status), asc(users.email));
}
