import { sql, relations } from "drizzle-orm";
import {
  customType,
  pgTable,
  pgEnum,
  text,
  varchar,
  timestamp,
  uuid,
  integer,
  boolean,
  jsonb,
  index,
  uniqueIndex,
  check,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Enums theo ERD (docs/02_reports/02_requirements_design.md mục 9)
// ---------------------------------------------------------------------------

export const userRoleEnum = pgEnum("user_role", ["USER", "ADMIN"]);
export const userStatusEnum = pgEnum("user_status", ["active", "locked"]);
export const reportTypeEnum = pgEnum("report_type", ["LOST", "FOUND"]);
export const reportStatusEnum = pgEnum("report_status", [
  "OPEN",
  "IN_PROGRESS",
  "RETURNED",
  "CLOSED",
  "HIDDEN",
]);
export const matchStatusEnum = pgEnum("match_status", ["SUGGESTED", "DISMISSED", "USED"]);
export const claimStatusEnum = pgEnum("claim_status", [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "COMPLETED",
  "EXPIRED",
]);
export const notificationTypeEnum = pgEnum("notification_type", [
  "MATCH",
  "CLAIM_NEW",
  "CLAIM_DECISION",
  "MEETING",
  "RETURNED",
  "REPORT_HIDDEN",
]);
export const flagStatusEnum = pgEnum("flag_status", ["NEW", "HANDLED"]);

const tsvector = customType<{ data: string }>({ dataType: () => "tsvector" });

const createdAt = () => timestamp("created_at", { withTimezone: true }).defaultNow().notNull();
const updatedAt = () => timestamp("updated_at", { withTimezone: true }).defaultNow().notNull();

// ---------------------------------------------------------------------------
// Tables
// RLS bật nhưng không có policy: app chỉ truy cập qua Drizzle phía server,
// nên Data API công khai của Supabase không đọc được các bảng này.
// ---------------------------------------------------------------------------

export const schools = pgTable("schools", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 32 }).notNull().unique(),
  // Tên miền email dùng để gán school_id khi đăng ký
  emailDomain: varchar("email_domain", { length: 255 }).unique(),
}).enableRLS();

/** id trùng với auth.users.id của Supabase Auth */
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  schoolId: uuid("school_id").references(() => schools.id, { onDelete: "set null" }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  fullName: varchar("full_name", { length: 120 }),
  studentCode: varchar("student_code", { length: 20 }),
  contactInfo: varchar("contact_info", { length: 120 }),
  role: userRoleEnum("role").default("USER").notNull(),
  status: userStatusEnum("status").default("active").notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}).enableRLS();

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 80 }).notNull().unique(),
  // Ẩn thay vì xóa cứng để tin cũ vẫn tham chiếu được (CHG-022)
  isActive: boolean("is_active").default(true).notNull(),
}).enableRLS();

export const locations = pgTable("locations", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Để trống nếu địa điểm dùng chung giữa các trường (ví dụ KTX)
  schoolId: uuid("school_id").references(() => schools.id, { onDelete: "set null" }),
  name: varchar("name", { length: 120 }).notNull().unique(),
  type: varchar("type", { length: 40 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
}).enableRLS();

export const reports = pgTable(
  "reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id),
    locationId: uuid("location_id")
      .notNull()
      .references(() => locations.id),
    type: reportTypeEnum("type").notNull(),
    title: varchar("title", { length: 120 }).notNull(),
    description: text("description").notNull(),
    eventTime: timestamp("event_time", { withTimezone: true }).notNull(),
    keepingPlace: varchar("keeping_place", { length: 200 }),
    verifyQuestion: varchar("verify_question", { length: 200 }),
    // Không bao giờ đưa vào query công khai
    verifyAnswer: varchar("verify_answer", { length: 200 }),
    status: reportStatusEnum("status").default("OPEN").notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    // Full-text search (FR07). Cấu hình 'simple' vì Postgres không có từ điển tiếng Việt.
    searchVector: tsvector("search_vector").generatedAlwaysAs(
      sql`to_tsvector('simple', coalesce("title", '') || ' ' || coalesce("description", ''))`
    ),
  },
  (t) => [
    index("reports_feed_idx").on(t.type, t.status, t.expiresAt),
    index("reports_user_idx").on(t.userId),
    index("reports_search_idx").using("gin", t.searchVector),
  ]
).enableRLS();

export const reportImages = pgTable(
  "report_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reportId: uuid("report_id")
      .notNull()
      .references(() => reports.id, { onDelete: "cascade" }),
    // Đường dẫn object trong bucket Supabase Storage
    imageUrl: text("image_url").notNull(),
    position: integer("position").default(0).notNull(),
  },
  (t) => [index("report_images_report_idx").on(t.reportId)]
).enableRLS();

export const matches = pgTable(
  "matches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    lostReportId: uuid("lost_report_id")
      .notNull()
      .references(() => reports.id, { onDelete: "cascade" }),
    foundReportId: uuid("found_report_id")
      .notNull()
      .references(() => reports.id, { onDelete: "cascade" }),
    score: integer("score").notNull(),
    reasons: jsonb("reasons").$type<string[]>().default([]).notNull(),
    status: matchStatusEnum("status").default("SUGGESTED").notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex("matches_pair_unique").on(t.lostReportId, t.foundReportId),
    check("matches_score_range", sql`${t.score} between 0 and 100`),
  ]
).enableRLS();

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
    answerText: text("answer_text").notNull(),
    note: text("note"),
    status: claimStatusEnum("status").default("PENDING").notNull(),
    meetLocationId: uuid("meet_location_id").references(() => locations.id),
    meetTime: timestamp("meet_time", { withTimezone: true }),
    finderConfirmedAt: timestamp("finder_confirmed_at", { withTimezone: true }),
    ownerConfirmedAt: timestamp("owner_confirmed_at", { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex("claims_report_claimant_unique").on(t.reportId, t.claimantId),
    uniqueIndex("claims_one_accepted_per_report")
      .on(t.reportId)
      .where(sql`${t.status} = 'ACCEPTED'`),
  ]
).enableRLS();

/** Ảnh minh chứng người mất đồ đính kèm yêu cầu; nằm trong bucket riêng tư `claim-images`. */
export const claimImages = pgTable(
  "claim_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    claimId: uuid("claim_id")
      .notNull()
      .references(() => claims.id, { onDelete: "cascade" }),
    // Đường dẫn object trong bucket Supabase Storage
    imagePath: text("image_path").notNull(),
    position: integer("position").default(0).notNull(),
  },
  (t) => [index("claim_images_claim_idx").on(t.claimId)]
).enableRLS();

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: notificationTypeEnum("type").notNull(),
    message: text("message").notNull(),
    link: text("link"),
    isRead: boolean("is_read").default(false).notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("notifications_user_idx").on(t.userId, t.isRead)]
).enableRLS();

export const flags = pgTable(
  "flags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reportId: uuid("report_id")
      .notNull()
      .references(() => reports.id, { onDelete: "cascade" }),
    reporterId: uuid("reporter_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    reason: varchar("reason", { length: 500 }).notNull(),
    status: flagStatusEnum("status").default("NEW").notNull(),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("flags_report_reporter_unique").on(t.reportId, t.reporterId)]
).enableRLS();

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const usersRelations = relations(users, ({ one, many }) => ({
  school: one(schools, { fields: [users.schoolId], references: [schools.id] }),
  reports: many(reports),
  claims: many(claims),
}));

export const locationsRelations = relations(locations, ({ one }) => ({
  school: one(schools, { fields: [locations.schoolId], references: [schools.id] }),
}));

export const reportsRelations = relations(reports, ({ one, many }) => ({
  user: one(users, { fields: [reports.userId], references: [users.id] }),
  category: one(categories, { fields: [reports.categoryId], references: [categories.id] }),
  location: one(locations, { fields: [reports.locationId], references: [locations.id] }),
  images: many(reportImages),
  claims: many(claims),
}));

export const reportImagesRelations = relations(reportImages, ({ one }) => ({
  report: one(reports, { fields: [reportImages.reportId], references: [reports.id] }),
}));

export const claimsRelations = relations(claims, ({ one }) => ({
  report: one(reports, { fields: [claims.reportId], references: [reports.id] }),
  claimant: one(users, { fields: [claims.claimantId], references: [users.id] }),
  meetLocation: one(locations, { fields: [claims.meetLocationId], references: [locations.id] }),
}));

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type User = typeof users.$inferSelect;
export type Report = typeof reports.$inferSelect;
export type Claim = typeof claims.$inferSelect;
export type Match = typeof matches.$inferSelect;

export type UserRole = (typeof userRoleEnum.enumValues)[number];
export type UserStatus = (typeof userStatusEnum.enumValues)[number];
export type ReportType = (typeof reportTypeEnum.enumValues)[number];
export type ReportStatus = (typeof reportStatusEnum.enumValues)[number];
export type MatchStatus = (typeof matchStatusEnum.enumValues)[number];
export type ClaimStatus = (typeof claimStatusEnum.enumValues)[number];
export type NotificationType = (typeof notificationTypeEnum.enumValues)[number];

export const REPORT_TYPES = reportTypeEnum.enumValues;
export const REPORT_STATUSES = reportStatusEnum.enumValues;
export const CLAIM_STATUSES = claimStatusEnum.enumValues;
