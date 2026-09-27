import { describe, expect, it } from "vitest";
import {
  escapeLikePattern,
  hasActiveFilters,
  isReportId,
  parseReportFilters,
  todayInVietnam,
  validateCreateReport,
} from "./report-validation";

const TODAY = "2026-09-26";

const validInput = {
  type: "lost",
  title: "  Ví da màu đen  ",
  category: "wallet-docs",
  location: "H6",
  eventDate: "2026-09-25",
  description: "Ví gấp đôi, có ngăn khóa kéo nhỏ.",
};

describe("validateCreateReport", () => {
  it("accepts a complete lost report and trims text fields", () => {
    const result = validateCreateReport(validInput, TODAY);

    expect(result).toEqual({
      success: true,
      data: { ...validInput, title: "Ví da màu đen" },
    });
  });

  it("accepts a found report dated today", () => {
    const result = validateCreateReport({ ...validInput, type: "found", eventDate: TODAY }, TODAY);

    expect(result.success).toBe(true);
  });

  it("reports an error for every missing required field", () => {
    const result = validateCreateReport(
      { type: "", title: "", category: "", location: "", eventDate: "", description: "" },
      TODAY,
    );

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(Object.keys(result.fieldErrors).sort()).toEqual(
      ["category", "description", "eventDate", "location", "title", "type"].sort(),
    );
    expect(result.fieldErrors.title).toEqual(["Nhập tên đồ vật từ 4 ký tự."]);
  });

  it("rejects whitespace-only title and description", () => {
    const result = validateCreateReport(
      { ...validInput, title: "   ", description: "\n\t " },
      TODAY,
    );

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.fieldErrors.title).toEqual(["Nhập tên đồ vật từ 4 ký tự."]);
    expect(result.fieldErrors.description).toEqual(["Mô tả ít nhất 10 ký tự."]);
  });

  it("rejects values outside the approved type, category and location lists", () => {
    const result = validateCreateReport(
      { ...validInput, type: "stolen", category: "jewelry", location: "library" },
      TODAY,
    );

    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.fieldErrors.type).toBeDefined();
    expect(result.fieldErrors.category).toEqual(["Chọn một danh mục."]);
    expect(result.fieldErrors.location).toEqual(["Chọn khu vực xảy ra sự việc."]);
  });

  it("rejects impossible and future event dates", () => {
    const impossible = validateCreateReport({ ...validInput, eventDate: "2026-02-30" }, TODAY);
    const future = validateCreateReport({ ...validInput, eventDate: "2026-09-27" }, TODAY);

    expect(impossible.success).toBe(false);
    expect(future.success).toBe(false);
    if (future.success) return;
    expect(future.fieldErrors.eventDate).toEqual(["Ngày xảy ra không được ở tương lai."]);
  });

  it("enforces the mockup length limits for title and description", () => {
    const tooShort = validateCreateReport(
      { ...validInput, title: " abc ", description: "Quá ngắn" },
      TODAY,
    );
    const tooLong = validateCreateReport(
      { ...validInput, title: "a".repeat(101), description: "b".repeat(601) },
      TODAY,
    );
    const atLimits = validateCreateReport(
      { ...validInput, title: "a".repeat(100), description: "b".repeat(600) },
      TODAY,
    );

    expect(tooShort.success).toBe(false);
    if (tooShort.success) return;
    expect(tooShort.fieldErrors.title).toEqual(["Nhập tên đồ vật từ 4 ký tự."]);
    expect(tooShort.fieldErrors.description).toEqual(["Mô tả ít nhất 10 ký tự."]);
    expect(tooLong.success).toBe(false);
    if (tooLong.success) return;
    expect(tooLong.fieldErrors.title).toEqual(["Tên đồ vật tối đa 100 ký tự."]);
    expect(tooLong.fieldErrors.description).toEqual(["Mô tả tối đa 600 ký tự."]);
    expect(atLimits.success).toBe(true);
  });

  it("ignores client-supplied fields that are not part of the contract", () => {
    const result = validateCreateReport(
      { ...validInput, userId: "someone-else", status: "returned" },
      TODAY,
    );

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data).not.toHaveProperty("userId");
    expect(result.data).not.toHaveProperty("status");
  });
});

describe("todayInVietnam", () => {
  it("uses the Vietnam calendar date even when UTC is still on the previous day", () => {
    expect(todayInVietnam(new Date("2026-09-25T18:30:00Z"))).toBe("2026-09-26");
  });
});

describe("parseReportFilters", () => {
  it("keeps valid filters and trims the keyword", () => {
    expect(
      parseReportFilters({ q: "  ví đen ", type: "found", category: "keys", location: "parking" }),
    ).toEqual({ q: "ví đen", type: "found", category: "keys", location: "parking" });
  });

  it("drops empty, unknown and repeated values safely", () => {
    const filters = parseReportFilters({
      q: "   ",
      type: "stolen",
      category: ["electronics", "keys"],
      location: "",
    });

    expect(filters).toEqual({ category: "electronics" });
    expect(hasActiveFilters(filters)).toBe(true);
    expect(hasActiveFilters(parseReportFilters({}))).toBe(false);
  });

  it("caps the keyword length", () => {
    expect(parseReportFilters({ q: "x".repeat(500) }).q).toHaveLength(100);
  });
});

describe("isReportId", () => {
  it("accepts seeded UUIDs and rejects other strings", () => {
    expect(isReportId("10000000-0000-4000-b000-000000000001")).toBe(true);
    expect(isReportId("not-a-report")).toBe(false);
    expect(isReportId("1; drop table reports")).toBe(false);
  });
});

describe("escapeLikePattern", () => {
  it("escapes LIKE wildcards so keywords match literally", () => {
    expect(escapeLikePattern("50%_off\\")).toBe("50\\%\\_off\\\\");
  });
});
