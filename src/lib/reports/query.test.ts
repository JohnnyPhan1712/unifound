import { describe, expect, it } from "vitest";
import { PgDialect } from "drizzle-orm/pg-core";
import { feedConditions, isPubliclyVisible, parseFeedParams, publicReportColumns } from "./query";

const dialect = new PgDialect();
const now = new Date("2026-10-01T05:00:00Z");
const cat = "33333333-3333-4333-8333-333333333333";

describe("TC-016-01 tham số và điều kiện lọc", () => {
  it("mặc định tab Tất cả, trang 1; bỏ qua giá trị lạ", () => {
    expect(parseFeedParams({ type: "X", page: "-3", category: "abc", from: "1/10/2026" })).toEqual({
      type: "ALL",
      q: "",
      categoryId: undefined,
      schoolId: undefined,
      locationId: undefined,
      from: undefined,
      to: undefined,
      page: 1,
    });
  });

  it("kết hợp loại + danh mục + khoảng thời gian + từ khóa", () => {
    const p = parseFeedParams({ type: "FOUND", category: cat, from: "2026-09-01", to: "2026-09-30", q: " ví ", page: "2" });
    expect(p).toMatchObject({ type: "FOUND", categoryId: cat, q: "ví", page: 2 });
    const { sql, params } = dialect.sqlToQuery(feedConditions(p, now));
    expect(sql).toContain(`"reports"."type" = $1`);
    expect(sql).toContain(`"reports"."category_id" =`);
    expect(sql).toContain(`"reports"."event_time" >=`);
    expect(sql).toContain(`"reports"."event_time" <`);
    expect(sql).toContain("websearch_to_tsquery('simple'");
    expect(params).toContain("FOUND");
    expect(params).toContain(cat);
    expect(params).toContain("ví");
    // "đến ngày 30/09" tính hết ngày theo giờ VN → trước 01/10 00:00 +07
    expect(params).toContain(new Date("2026-09-30T17:00:00.000Z").toISOString());
  });
});

describe("tab Tất cả", () => {
  it("ALL không lọc theo loại, LOST/FOUND thì có", () => {
    const all = dialect.sqlToQuery(feedConditions(parseFeedParams({}), now));
    expect(all.sql).not.toContain(`"reports"."type" =`);
    expect(dialect.sqlToQuery(feedConditions(parseFeedParams({ type: "LOST" }), now)).sql).toContain(`"reports"."type" =`);
  });
});

describe("TC-016-02 hết hạn / HIDDEN", () => {
  it("feed luôn lọc theo expires_at > now và chỉ trạng thái công khai", () => {
    const { sql, params } = dialect.sqlToQuery(feedConditions(parseFeedParams({}), now));
    expect(sql).toContain(`"reports"."expires_at" >`);
    expect(sql).toContain(`"reports"."status" in`);
    expect(params).toEqual(expect.arrayContaining(["OPEN", "IN_PROGRESS", "RETURNED"]));
    expect(params).not.toContain("HIDDEN");
    expect(params).not.toContain("CLOSED");
  });
  it("chi tiết: HIDDEN không công khai", () => {
    expect(isPubliclyVisible({ status: "HIDDEN" })).toBe(false);
    expect(isPubliclyVisible({ status: "RETURNED" })).toBe(true);
  });
  it("cột công khai không có đáp án xác minh hay liên hệ", () => {
    expect(Object.keys(publicReportColumns)).not.toContain("verifyAnswer");
    expect(Object.keys(publicReportColumns)).not.toContain("contactInfo");
  });
});
