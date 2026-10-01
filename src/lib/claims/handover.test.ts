import { describe, expect, it } from "vitest";
import { CLAIM_STATUSES } from "@/db/schema";
import { applyConfirmation, canSeeContacts, handoverRole, meetingSchema } from "./handover";

describe("TC-020-01 điều kiện hiện liên hệ", () => {
  it("chỉ ACCEPTED", () => {
    expect(CLAIM_STATUSES.filter(canSeeContacts)).toEqual(["ACCEPTED"]);
  });
});

describe("TC-020-02 xác nhận theo actor và điều kiện COMPLETED", () => {
  const claim = { claimantId: "owner", finderId: "finder" };
  const t1 = new Date("2026-10-01T10:00:00Z");
  const t2 = new Date("2026-10-01T11:00:00Z");
  const none = { finderConfirmedAt: null, ownerConfirmedAt: null };

  it("xác định vai trò; người ngoài không có vai trò", () => {
    expect(handoverRole("finder", claim)).toBe("finder");
    expect(handoverRole("owner", claim)).toBe("owner");
    expect(handoverRole("other", claim)).toBeNull();
  });
  it("một bên xác nhận: chưa hoàn tất", () => {
    const r = applyConfirmation(none, "finder", t1);
    expect(r).toEqual({ finderConfirmedAt: t1, ownerConfirmedAt: null, completed: false });
  });
  it("đủ hai bên: hoàn tất", () => {
    const r = applyConfirmation({ finderConfirmedAt: t1, ownerConfirmedAt: null }, "owner", t2);
    expect(r).toEqual({ finderConfirmedAt: t1, ownerConfirmedAt: t2, completed: true });
  });
  it("bấm lặp lại giữ mốc cũ, không tự xác nhận hộ bên kia", () => {
    const r = applyConfirmation({ finderConfirmedAt: t1, ownerConfirmedAt: null }, "finder", t2);
    expect(r).toEqual({ finderConfirmedAt: t1, ownerConfirmedAt: null, completed: false });
  });
});

describe("TC-020-03 Zod giờ hẹn", () => {
  const id = "11111111-1111-4111-8111-111111111111";
  const loc = "22222222-2222-4222-8222-222222222222";
  it("giờ quá khứ, thiếu địa điểm bị từ chối", () => {
    const past = meetingSchema.safeParse({ id, meetLocationId: loc, meetTime: "2020-01-01T08:00" });
    expect(past.success).toBe(false);
    expect(past.error!.flatten().fieldErrors.meetTime).toEqual(["Giờ hẹn phải ở tương lai."]);
    expect(meetingSchema.safeParse({ id, meetLocationId: "", meetTime: "2999-01-01T08:00" }).success).toBe(false);
  });
  it("giờ tương lai hợp lệ", () => {
    expect(meetingSchema.safeParse({ id, meetLocationId: loc, meetTime: "2999-01-01T08:00" }).success).toBe(true);
  });
});
