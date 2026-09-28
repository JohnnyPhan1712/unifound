import { describe, expect, it } from "vitest";
import {
  REPORT_CATEGORIES,
  REPORT_LOCATIONS,
  REPORT_STATUSES,
  REPORT_TYPES,
} from "../../db/schema";
import {
  REPORT_CATEGORY_LABELS,
  REPORT_LOCATION_LABELS,
  REPORT_STATUS_LABELS,
  REPORT_TYPE_LABELS,
  formatEventDate,
  labelEntries,
} from "./report-display";

describe("report labels", () => {
  it("cover exactly the enum values of the database contract, in order", () => {
    expect(labelEntries(REPORT_TYPE_LABELS).map(([value]) => value)).toEqual(REPORT_TYPES);
    expect(labelEntries(REPORT_CATEGORY_LABELS).map(([value]) => value)).toEqual(
      REPORT_CATEGORIES,
    );
    expect(labelEntries(REPORT_LOCATION_LABELS).map(([value]) => value)).toEqual(
      REPORT_LOCATIONS,
    );
    expect(labelEntries(REPORT_STATUS_LABELS).map(([value]) => value)).toEqual(REPORT_STATUSES);
  });
});

describe("formatEventDate", () => {
  it("formats the calendar date without shifting time zones", () => {
    expect(formatEventDate("2026-01-01")).toBe("01/01/2026");
  });
});
