import { describe, expect, it } from "vitest";
import {
  assertUserOwnsReport,
  assertCanClaimReport,
  assertCanManageClaim,
  assertCanViewProof,
  assertAdmin,
  canUserManageReport,
  ForbiddenError,
  UnauthorizedError,
} from "./ownership";

describe("Ownership & Authorization Rules (CHG-008 / DEC-001, DEC-002, DEC-005)", () => {
  const userA = "00000000-0000-4000-a000-000000000001";
  const userB = "00000000-0000-4000-a000-000000000002";
  const userC = "00000000-0000-4000-a000-000000000003";
  const adminUser = "00000000-0000-4000-a000-000000000099";

  describe("assertUserOwnsReport (DEC-001 & CHG-008)", () => {
    it("should allow owner to manage their own report with string id", () => {
      const report = { userId: userA };
      expect(() => assertUserOwnsReport(report, userA)).not.toThrow();
    });

    it("should allow owner to manage their own report with user object", () => {
      const report = { userId: userA };
      expect(() =>
        assertUserOwnsReport(report, { id: userA, role: "USER" })
      ).not.toThrow();
    });

    it("should forbid another user from managing someone else's report", () => {
      const report = { userId: userA };
      expect(() => assertUserOwnsReport(report, userB)).toThrow(ForbiddenError);
      expect(() =>
        assertUserOwnsReport(report, { id: userB, role: "USER" })
      ).toThrow(ForbiddenError);
    });

    it("should allow ADMIN to manage any report (Admin Authorization)", () => {
      const report = { userId: userA };
      expect(() =>
        assertUserOwnsReport(report, { id: adminUser, role: "ADMIN" })
      ).not.toThrow();
    });

    it("should reject when userId is empty or undefined", () => {
      const report = { userId: userA };
      expect(() => assertUserOwnsReport(report, "")).toThrow(ForbiddenError);
    });
  });

  describe("assertAdmin (CHG-008 Role Authorization)", () => {
    it("should allow user with ADMIN role", () => {
      expect(() => assertAdmin({ role: "ADMIN" })).not.toThrow();
    });

    it("should forbid user with USER role", () => {
      expect(() => assertAdmin({ role: "USER" })).toThrow(ForbiddenError);
    });

    it("should forbid unauthenticated / null user", () => {
      expect(() => assertAdmin(null)).toThrow(ForbiddenError);
      expect(() => assertAdmin(undefined)).toThrow(ForbiddenError);
    });
  });

  describe("canUserManageReport (CHG-008 UI helper)", () => {
    const report = { userId: userA };

    it("should return true for report owner", () => {
      expect(canUserManageReport(report, { id: userA, role: "USER" })).toBe(true);
    });

    it("should return true for ADMIN user even if not owner", () => {
      expect(canUserManageReport(report, { id: adminUser, role: "ADMIN" })).toBe(true);
    });

    it("should return false for different user with USER role", () => {
      expect(canUserManageReport(report, { id: userB, role: "USER" })).toBe(false);
    });

    it("should return false for unauthenticated user (null/undefined)", () => {
      expect(canUserManageReport(report, null)).toBe(false);
      expect(canUserManageReport(report, undefined)).toBe(false);
    });
  });

  describe("assertCanClaimReport (DEC-001, DEC-002, DEC-005)", () => {
    it("should allow another user to claim an open found report", () => {
      const report = {
        userId: userA, // Người nhặt được (User A)
        type: "found",
        status: "open",
      };

      // User B là người bị mất đồ, muốn nhận lại
      expect(() => assertCanClaimReport(report, userB)).not.toThrow();
    });

    it("should forbid owner from claiming their own report", () => {
      const report = {
        userId: userA,
        type: "found",
        status: "open",
      };

      expect(() => assertCanClaimReport(report, userA)).toThrow(
        /không thể gửi yêu cầu nhận lại cho bài đăng do chính mình/i
      );
    });

    it("should forbid claiming a 'lost' report (can only claim 'found')", () => {
      const report = {
        userId: userA,
        type: "lost",
        status: "open",
      };

      expect(() => assertCanClaimReport(report, userB)).toThrow(
        /Chỉ có thể gửi yêu cầu nhận lại cho bài đăng nhặt được/i
      );
    });

    it("should forbid claiming a report that is already returned", () => {
      const report = {
        userId: userA,
        type: "found",
        status: "returned",
      };

      expect(() => assertCanClaimReport(report, userB)).toThrow(
        /đã hoàn tất trao trả hoặc đã đóng/i
      );
    });

    it("should forbid claiming a report that is closed", () => {
      const report = {
        userId: userA,
        type: "found",
        status: "closed",
      };

      expect(() => assertCanClaimReport(report, userB)).toThrow(
        /đã hoàn tất trao trả hoặc đã đóng/i
      );
    });

    it("should require authentication before claiming", () => {
      const report = {
        userId: userA,
        type: "found",
        status: "open",
      };

      expect(() => assertCanClaimReport(report, "")).toThrow(UnauthorizedError);
    });
  });

  describe("assertCanManageClaim (DEC-001, DEC-005)", () => {
    it("should allow the finder (found report owner) to accept/reject claims", () => {
      const foundReport = { userId: userA };
      expect(() => assertCanManageClaim(foundReport, userA)).not.toThrow();
    });

    it("should forbid other users (including claimant) from accepting/rejecting claims", () => {
      const foundReport = { userId: userA };
      expect(() => assertCanManageClaim(foundReport, userB)).toThrow(ForbiddenError);
    });
  });

  describe("assertCanViewProof (DEC-005 - Privacy Protection)", () => {
    const claim = { claimantId: userB };
    const foundReportOwnerId = userA;

    it("should allow the claimant to view their own proof", () => {
      expect(() =>
        assertCanViewProof(claim, userB, foundReportOwnerId)
      ).not.toThrow();
    });

    it("should allow the found report owner to view the proof for verification", () => {
      expect(() =>
        assertCanViewProof(claim, userA, foundReportOwnerId)
      ).not.toThrow();
    });

    it("should strictly forbid third-party users from seeing private proof", () => {
      expect(() =>
        assertCanViewProof(claim, userC, foundReportOwnerId)
      ).toThrow(ForbiddenError);
    });

    it("should require login to view proof", () => {
      expect(() => assertCanViewProof(claim, "", foundReportOwnerId)).toThrow(
        UnauthorizedError
      );
    });
  });
});
