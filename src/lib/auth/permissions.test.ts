import { describe, expect, it } from "vitest";
import { canManageReport, statusAllows } from "./permissions";

const owner = { id: "a", role: "USER" as const, status: "active" as const };
const other = { id: "b", role: "USER" as const, status: "active" as const };
const admin = { id: "z", role: "ADMIN" as const, status: "active" as const };
const report = { userId: "a" };

describe("TC-017-01 phân quyền sửa/xóa tin", () => {
  it("chủ tin và ADMIN được phép", () => {
    expect(canManageReport(owner, report)).toBe(true);
    expect(canManageReport(admin, report)).toBe(true);
  });
  it("user khác, khách, tài khoản bị khóa bị từ chối", () => {
    expect(canManageReport(other, report)).toBe(false);
    expect(canManageReport(null, report)).toBe(false);
    expect(canManageReport({ ...owner, status: "locked" }, report)).toBe(false);
    expect(canManageReport({ ...admin, status: "locked" }, report)).toBe(false);
  });
});

describe("TC-017-02 trạng thái được phép", () => {
  it("sửa/đóng chỉ khi OPEN", () => {
    expect(statusAllows("edit", "OPEN")).toBe(true);
    expect(statusAllows("close", "OPEN")).toBe(true);
    for (const s of ["IN_PROGRESS", "RETURNED", "CLOSED", "HIDDEN"] as const) {
      expect(statusAllows("edit", s)).toBe(false);
      expect(statusAllows("close", s)).toBe(false);
    }
  });
  it("xóa: không khi IN_PROGRESS hoặc RETURNED", () => {
    expect(statusAllows("delete", "OPEN")).toBe(true);
    expect(statusAllows("delete", "CLOSED")).toBe(true);
    expect(statusAllows("delete", "HIDDEN")).toBe(true);
    expect(statusAllows("delete", "IN_PROGRESS")).toBe(false);
    expect(statusAllows("delete", "RETURNED")).toBe(false);
  });
});
