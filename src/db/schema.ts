import { sql, relations } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  text,
  varchar,
  timestamp,
  date,
  uuid,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Enums theo các quyết định MVP (DEC-002, DEC-005)
// ---------------------------------------------------------------------------

<<<<<<< HEAD
=======
export const userRoleEnum = pgEnum("user_role", [
  "USER",
  "ADMIN",
]);

>>>>>>> fa95b3b (Add code by Quan)
export const reportTypeEnum = pgEnum("report_type", [
  "lost",
  "found",
]);

export const reportCategoryEnum = pgEnum("report_category", [
  "electronics",
  "wallet-docs",
  "keys",
  "clothing",
  "study",
  "other",
]);

export const reportLocationEnum = pgEnum("report_location", [
  "H1",
  "H2",
  "H3",
  "H6",
  "parking",
  "canteen",
  "sports",
  "other",
]);

export const reportStatusEnum = pgEnum("report_status", [
  "open",
  "pending",
  "accepted",
  "returned",
  "closed",
]);

export const claimStatusEnum = pgEnum("claim_status", [
  "pending",
  "accepted",
  "rejected",
  "closed",
]);

// ---------------------------------------------------------------------------
// Tables
// ---------------------------------------------------------------------------

/**
 * Bảng User / Profile ứng dụng
 * Ánh xạ với tài khoản Supabase Auth (auth.users) qua trường id (UUID)
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  fullName: varchar("full_name", { length: 255 }),
  avatarUrl: text("avatar_url"),
<<<<<<< HEAD
=======
  role: userRoleEnum("role").default("USER").notNull(),
>>>>>>> fa95b3b (Add code by Quan)
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Bảng Report (Lost hoặc Found item)
 * Lưu thông tin báo mất hoặc nhặt được theo DEC-001/DEC-002
 */
export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: reportTypeEnum("type").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  category: reportCategoryEnum("category").notNull(),
  location: reportLocationEnum("location").notNull(),
  description: text("description").notNull(),
  eventDate: date("event_date", { mode: "string" }).notNull(),
  imageUrl: text("image_url"),
  status: reportStatusEnum("status").default("open").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * Bảng Claim
 * Yêu cầu nhận lại đồ nhặt được kèm thông tin xác minh riêng tư (DEC-002, DEC-005)
 * Constraint: Mỗi Found Report chỉ có tối đa một claim ở trạng thái 'accepted'.
 */
export const claims = pgTable(
  "claims",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reportId: uuid("report_id")
      .notNull()
      .references(() => reports.id, { onDelete: "cascade" }),
    claimantId: uuid("claimant_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    proof: text("proof").notNull(),
    status: claimStatusEnum("status").default("pending").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("unique_accepted_claim_per_report")
      .on(table.reportId)
      .where(sql`${table.status} = 'accepted'`),
  ]
);

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const usersRelations = relations(users, ({ many }) => ({
  reports: many(reports),
  claims: many(claims),
}));

export const reportsRelations = relations(reports, ({ one, many }) => ({
  user: one(users, {
    fields: [reports.userId],
    references: [users.id],
  }),
  claims: many(claims),
}));

export const claimsRelations = relations(claims, ({ one }) => ({
  report: one(reports, {
    fields: [claims.reportId],
    references: [reports.id],
  }),
  claimant: one(users, {
    fields: [claims.claimantId],
    references: [users.id],
  }),
}));

// ---------------------------------------------------------------------------
// Type Definitions & Helpers
// ---------------------------------------------------------------------------

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;

export type Claim = typeof claims.$inferSelect;
export type NewClaim = typeof claims.$inferInsert;

export type ReportType = (typeof reportTypeEnum.enumValues)[number];
export type ReportCategory = (typeof reportCategoryEnum.enumValues)[number];
export type ReportLocation = (typeof reportLocationEnum.enumValues)[number];
export type ReportStatus = (typeof reportStatusEnum.enumValues)[number];
export type ClaimStatus = (typeof claimStatusEnum.enumValues)[number];
<<<<<<< HEAD
=======
export type UserRole = (typeof userRoleEnum.enumValues)[number];
>>>>>>> fa95b3b (Add code by Quan)

export const REPORT_TYPES = reportTypeEnum.enumValues;
export const REPORT_CATEGORIES = reportCategoryEnum.enumValues;
export const REPORT_LOCATIONS = reportLocationEnum.enumValues;
export const REPORT_STATUSES = reportStatusEnum.enumValues;
export const CLAIM_STATUSES = claimStatusEnum.enumValues;
<<<<<<< HEAD
=======
export const USER_ROLES = userRoleEnum.enumValues;
>>>>>>> fa95b3b (Add code by Quan)
