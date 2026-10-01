import { describe, expect, it } from "vitest";
import { isAdmin } from "@/lib/auth/session";
import { flagSchema } from "@/lib/flags/schemas";
import { canChangeUserStatus } from "./guard";

describe("TC-021-01 quyền admin", () => {
  it("chỉ ADMIN đang hoạt động được dùng action quản trị", () => {
    expect(isAdmin({ role: "ADMIN", status: "active" })).toBe(true);
    expect(isAdmin({ role: "ADMIN", status: "locked" })).toBe(false);
    expect(isAdmin({ role: "USER", status: "active" })).toBe(false);
    expect(isAdmin(null)).toBe(false);
  });
  it("khóa/mở khóa: không tự khóa mình, không khóa ADMIN khác", () => {
    const admin = { id: "z" };
    expect(canChangeUserStatus(admin, { id: "u", role: "USER" })).toBe(true);
    expect(canChangeUserStatus(admin, { id: "z", role: "ADMIN" })).toBe(false);
    expect(canChangeUserStatus(admin, { id: "y", role: "ADMIN" })).toBe(false);
  });
});

describe("TC-021-02 Zod lý do báo cáo", () => {
  it("từ chối rỗng, quá ngắn, quá dài", () => {
    expect(flagSchema.safeParse({ reason: "   " }).success).toBe(false);
    expect(flagSchema.safeParse({ reason: "spam" }).success).toBe(false);
    expect(flagSchema.safeParse({ reason: "x".repeat(501) }).success).toBe(false);
    expect(flagSchema.parse({ reason: "  Tin rao bán đồ  " })).toEqual({ reason: "Tin rao bán đồ" });
  });
});
