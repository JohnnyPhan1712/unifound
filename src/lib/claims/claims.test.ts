import { describe, expect, it } from "vitest";
import { CLAIM_STATUSES } from "@/db/schema";
import { canViewClaim } from "./query";
import { canTransition, claimSubmitError, effectiveClaimStatus } from "./rules";
import { claimSchema } from "./schemas";

const now = new Date("2026-10-01T10:00:00Z");
const day = 86_400_000;

describe("TC-019-01 state machine", () => {
  it("chỉ cho các chuyển hợp lệ", () => {
    const allowed = CLAIM_STATUSES.flatMap((from) => CLAIM_STATUSES.filter((to) => canTransition(from, to)).map((to) => `${from}->${to}`));
    expect(allowed.sort()).toEqual(["ACCEPTED->COMPLETED", "PENDING->ACCEPTED", "PENDING->REJECTED"]);
  });
  it("không quay lại từ trạng thái kết thúc", () => {
    expect(canTransition("REJECTED", "ACCEPTED")).toBe(false);
    expect(canTransition("COMPLETED", "ACCEPTED")).toBe(false);
    expect(canTransition("EXPIRED", "ACCEPTED")).toBe(false);
    expect(canTransition("ACCEPTED", "REJECTED")).toBe(false);
  });
});

describe("TC-019-02 luật gửi yêu cầu", () => {
  const report = { userId: "finder", type: "FOUND" as const, status: "OPEN" as const, expiresAt: new Date(now.getTime() + day) };
  it("hợp lệ", () => {
    expect(claimSubmitError(report, "owner", false, now)).toBeNull();
  });
  it("tin của mình, tin Mất đồ, gửi lần hai", () => {
    expect(claimSubmitError(report, "finder", false, now)).toMatch("chính mình");
    expect(claimSubmitError({ ...report, type: "LOST" }, "owner", false, now)).toMatch("Nhặt được");
    expect(claimSubmitError(report, "owner", true, now)).toMatch("đã gửi");
  });
  it("tin đã trả/đóng/ẩn/đang bàn giao/hết hạn", () => {
    for (const status of ["RETURNED", "CLOSED", "HIDDEN", "IN_PROGRESS"] as const) {
      expect(claimSubmitError({ ...report, status }, "owner", false, now)).toMatch("không còn nhận");
    }
    expect(claimSubmitError({ ...report, expiresAt: now }, "owner", false, now)).toMatch("không còn nhận");
  });
  it("Zod: câu trả lời bắt buộc, giới hạn độ dài", () => {
    expect(claimSchema.safeParse({ answerText: "  " }).success).toBe(false);
    expect(claimSchema.safeParse({ answerText: "x".repeat(501) }).success).toBe(false);
    expect(claimSchema.parse({ answerText: " thẻ xe ", note: "" })).toEqual({ answerText: "thẻ xe", note: null });
  });
});

describe("TC-019-03 hết hạn 7 ngày", () => {
  const pending = (ageMs: number) => ({ status: "PENDING" as const, createdAt: new Date(now.getTime() - ageMs) });
  it("đúng ranh giới", () => {
    expect(effectiveClaimStatus(pending(7 * day - 1), now)).toBe("PENDING");
    expect(effectiveClaimStatus(pending(7 * day), now)).toBe("EXPIRED");
  });
  it("chỉ áp dụng cho PENDING", () => {
    expect(effectiveClaimStatus({ status: "ACCEPTED", createdAt: new Date(0) }, now)).toBe("ACCEPTED");
  });
});

describe("TC-019-08 quyền xem câu trả lời", () => {
  const claim = { claimantId: "owner", report: { userId: "finder" } };
  it("chỉ claimant và người nhặt", () => {
    expect(canViewClaim(claim, "owner")).toBe(true);
    expect(canViewClaim(claim, "finder")).toBe(true);
    expect(canViewClaim(claim, "someone")).toBe(false);
    expect(canViewClaim(claim, undefined)).toBe(false);
  });
});
