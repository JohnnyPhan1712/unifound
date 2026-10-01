import { describe, expect, it } from "vitest";
import { categorySchema, locationSchema } from "./catalog-schemas";
import { fillWeeks, percent, weekKey } from "./stats";

describe("TC-022-01 hàm thống kê", () => {
  it("tỉ lệ đã trả, không chia cho 0", () => {
    expect(percent(1, 3)).toBe(33);
    expect(percent(2, 3)).toBe(67);
    expect(percent(0, 0)).toBe(0);
  });
  it("tuần bắt đầu thứ Hai theo giờ Việt Nam", () => {
    // 2026-10-01 là thứ Năm
    expect(weekKey(new Date("2026-10-01T10:00:00Z"))).toBe("2026-09-28");
    // Chủ nhật 23:30 giờ VN vẫn thuộc tuần trước
    expect(weekKey(new Date("2026-10-04T16:30:00Z"))).toBe("2026-09-28");
    // Thứ Hai 00:30 giờ VN (17:30 UTC Chủ nhật) sang tuần mới
    expect(weekKey(new Date("2026-10-04T17:30:00Z"))).toBe("2026-10-05");
  });
  it("đủ 8 tuần, tuần trống = 0, dữ liệu rỗng không lỗi", () => {
    const now = new Date("2026-10-01T10:00:00Z");
    const weeks = fillWeeks([{ week: "2026-09-28", n: 4 }, { week: "2026-09-14", n: 2 }], now);
    expect(weeks).toHaveLength(8);
    expect(weeks[0].week).toBe("2026-08-10");
    expect(weeks.at(-1)).toEqual({ week: "2026-09-28", n: 4 });
    expect(weeks.find((w) => w.week === "2026-09-14")?.n).toBe(2);
    expect(weeks.reduce((s, w) => s + w.n, 0)).toBe(6);
    expect(fillWeeks([], now).every((w) => w.n === 0)).toBe(true);
  });
});

describe("TC-022-02 Zod danh mục/địa điểm", () => {
  it("từ chối tên rỗng/quá ngắn/quá dài", () => {
    expect(categorySchema.safeParse({ name: "  " }).success).toBe(false);
    expect(categorySchema.safeParse({ name: "A" }).success).toBe(false);
    expect(categorySchema.safeParse({ name: "x".repeat(81) }).success).toBe(false);
    expect(categorySchema.parse({ id: "", name: " Ô dù " })).toEqual({ id: undefined, name: "Ô dù" });
  });
  it("địa điểm: loại bắt buộc, trường rỗng = dùng chung", () => {
    expect(locationSchema.safeParse({ name: "Tòa D", type: "", schoolId: "" }).success).toBe(false);
    expect(locationSchema.parse({ name: "KTX khu C", type: "KTX", schoolId: "" }).schoolId).toBeNull();
  });
  // Trùng tên (không phân biệt hoa/thường) được kiểm phía server bằng truy vấn lower(name) — xem TC-022-02 trên UI
});
