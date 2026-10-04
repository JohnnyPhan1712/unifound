import { describe, expect, it } from "vitest";
import { CLAIM_STATUSES } from "@/db/schema";
import { canViewClaim } from "./query";
import { canTransition, claimSubmitError, effectiveClaimStatus } from "./rules";
import { checkImages } from "@/lib/reports/checks";
import { CLAIM_IMAGE_BUCKET } from "@/lib/reports/schemas";
import { claimSchema } from "./schemas";

const now = new Date("2026-10-01T10:00:00Z");
const day = 86_400_000;

describe("TC-019-01 state machine", () => {
  it("chỉ cho các chuyển hợp lệ", () => {
    const allowed = CLAIM_STATUSES.flatMap((from) => CLAIM_STATUSES.filter((to) => canTransition(from, to)).map((to) => `${from}->${to}`));
    expect(allowed.sort()).toEqual(["ACCEPTED->CANCELLED", "ACCEPTED->COMPLETED", "PENDING->ACCEPTED", "PENDING->REJECTED"]);
  });
  it("TC-032-01 chỉ ACCEPTED mới hủy được", () => {
    for (const from of CLAIM_STATUSES.filter((s) => s !== "ACCEPTED")) expect(canTransition(from, "CANCELLED")).toBe(false);
    expect(canTransition("CANCELLED", "ACCEPTED")).toBe(false);
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
    expect(claimSchema.parse({ answerText: " thẻ xe ", note: "" })).toEqual({ answerText: "thẻ xe", note: null, images: [] });
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

describe("TC-028 ảnh minh chứng (Zod)", () => {
  const ok = { answerText: "thẻ xe" };
  const path = (n: number) => `${"a".repeat(8)}-aaaa-aaaa-aaaa-aaaaaaaaaaaa/${"b".repeat(8)}-bbbb-bbbb-bbbb-bbbbbbbbbb0${n}.jpg`;
  it("không bắt buộc, tối đa 3 ảnh", () => {
    expect(claimSchema.safeParse({ ...ok, images: "[]" }).success).toBe(true);
    expect(claimSchema.parse({ ...ok, images: JSON.stringify([path(1), path(2), path(3)]) }).images).toHaveLength(3);
    expect(claimSchema.safeParse({ ...ok, images: JSON.stringify([1, 2, 3, 4].map(path)) }).success).toBe(false);
  });
  it("từ chối chuỗi ảnh hỏng", () => {
    expect(claimSchema.safeParse({ ...ok, images: "không phải json" }).success).toBe(false);
    expect(claimSchema.safeParse({ ...ok, images: "[1]" }).success).toBe(false);
  });
});

describe("TC-028-06 checkImages từ chối sớm (không cần Storage)", () => {
  const me = "11111111-1111-1111-1111-111111111111";
  const mine = `${me}/22222222-2222-2222-2222-222222222222.jpg`;
  it("ảnh trùng", async () => {
    expect(await checkImages([mine, mine], me, CLAIM_IMAGE_BUCKET)).toBe("Ảnh bị trùng.");
  });
  it("đường dẫn của người khác hoặc sai dạng", async () => {
    const theirs = "99999999-9999-9999-9999-999999999999/22222222-2222-2222-2222-222222222222.jpg";
    expect(await checkImages([theirs], me, CLAIM_IMAGE_BUCKET)).toBe("Ảnh không hợp lệ.");
    expect(await checkImages([`${me}/../x.jpg`], me, CLAIM_IMAGE_BUCKET)).toBe("Ảnh không hợp lệ.");
  });
});
