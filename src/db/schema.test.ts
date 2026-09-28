import { describe, expect, it } from "vitest";
import { getTableColumns } from "drizzle-orm";
import {
  users,
  reports,
  claims,
  REPORT_TYPES,
  REPORT_CATEGORIES,
  REPORT_LOCATIONS,
  REPORT_STATUSES,
  CLAIM_STATUSES,
  USER_ROLES,
  reportTypeEnum,
  reportCategoryEnum,
  reportLocationEnum,
  reportStatusEnum,
  claimStatusEnum,
  userRoleEnum,
} from "./schema";
import { db } from "./index";

describe("Database Schema Contracts (CHG-007)", () => {
  describe("Enum Specifications (DEC-002, DEC-005)", () => {
    it("should define correct report types: lost and found", () => {
      expect(REPORT_TYPES).toEqual(["lost", "found"]);
      expect(reportTypeEnum.enumValues).toEqual(["lost", "found"]);
    });

    it("should define all approved categories according to DEC-002", () => {
      expect(REPORT_CATEGORIES).toEqual([
        "electronics",
        "wallet-docs",
        "keys",
        "clothing",
        "study",
        "other",
      ]);
      expect(reportCategoryEnum.enumValues).toEqual(REPORT_CATEGORIES);
    });

    it("should define campus locations according to DEC-002", () => {
      expect(REPORT_LOCATIONS).toEqual([
        "H1",
        "H2",
        "H3",
        "H6",
        "parking",
        "canteen",
        "sports",
        "other",
      ]);
      expect(reportLocationEnum.enumValues).toEqual(REPORT_LOCATIONS);
    });

    it("should define report lifecycle statuses", () => {
      expect(REPORT_STATUSES).toEqual([
        "open",
        "pending",
        "accepted",
        "returned",
        "closed",
      ]);
      expect(reportStatusEnum.enumValues).toEqual(REPORT_STATUSES);
    });

    it("should define claim lifecycle statuses according to DEC-002", () => {
      expect(CLAIM_STATUSES).toEqual([
        "pending",
        "accepted",
        "rejected",
        "closed",
      ]);
      expect(claimStatusEnum.enumValues).toEqual(CLAIM_STATUSES);
    });
    it("should define user roles: USER and ADMIN (CHG-008)", () => {
      expect(USER_ROLES).toEqual(["USER", "ADMIN"]);
      expect(userRoleEnum.enumValues).toEqual(["USER", "ADMIN"]);
    });
  });

  describe("Table Column Structure & Constraints", () => {
    it("should have expected columns on users table", () => {
      const columns = getTableColumns(users);
      expect(columns).toHaveProperty("id");
      expect(columns).toHaveProperty("email");
      expect(columns).toHaveProperty("fullName");
      expect(columns).toHaveProperty("avatarUrl");
      expect(columns).toHaveProperty("role");
      expect(columns).toHaveProperty("createdAt");
      expect(columns).toHaveProperty("updatedAt");

      expect(columns.email.notNull).toBe(true);
      expect(columns.role.notNull).toBe(true);
      expect(columns.id.primary).toBe(true);
    });

    it("should have expected columns and required constraints on reports table", () => {
      const columns = getTableColumns(reports);
      expect(columns).toHaveProperty("id");
      expect(columns).toHaveProperty("userId");
      expect(columns).toHaveProperty("type");
      expect(columns).toHaveProperty("title");
      expect(columns).toHaveProperty("category");
      expect(columns).toHaveProperty("location");
      expect(columns).toHaveProperty("description");
      expect(columns).toHaveProperty("eventDate");
      expect(columns).toHaveProperty("imageUrl");
      expect(columns).toHaveProperty("status");
      expect(columns).toHaveProperty("createdAt");
      expect(columns).toHaveProperty("updatedAt");

      // Mandatory fields per DEC-002
      expect(columns.type.notNull).toBe(true);
      expect(columns.title.notNull).toBe(true);
      expect(columns.category.notNull).toBe(true);
      expect(columns.location.notNull).toBe(true);
      expect(columns.description.notNull).toBe(true);
      expect(columns.eventDate.notNull).toBe(true);
      expect(columns.userId.notNull).toBe(true);
      expect(columns.status.notNull).toBe(true);
    });

    it("should have expected columns and required constraints on claims table", () => {
      const columns = getTableColumns(claims);
      expect(columns).toHaveProperty("id");
      expect(columns).toHaveProperty("reportId");
      expect(columns).toHaveProperty("claimantId");
      expect(columns).toHaveProperty("proof");
      expect(columns).toHaveProperty("status");
      expect(columns).toHaveProperty("createdAt");
      expect(columns).toHaveProperty("updatedAt");

      expect(columns.reportId.notNull).toBe(true);
      expect(columns.claimantId.notNull).toBe(true);
      expect(columns.proof.notNull).toBe(true);
      expect(columns.status.notNull).toBe(true);
    });
  });

  describe("Database Client Export", () => {
    it("should export db client instance without throwing on import", () => {
      expect(db).toBeDefined();
    });
  });
});
