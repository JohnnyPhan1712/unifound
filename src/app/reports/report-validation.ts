import { z } from "zod";
import {
  REPORT_CATEGORIES,
  REPORT_LOCATIONS,
  REPORT_TYPES,
  type ReportCategory,
  type ReportLocation,
  type ReportType,
} from "../../db/schema";
import {
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MIN_LENGTH,
  SEARCH_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
  type CreateReportField,
} from "./report-fields";

const todayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Ho_Chi_Minh",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

// Users are on campus in Vietnam; the server may run in UTC, where "today" can differ.
export function todayInVietnam(now: Date = new Date()): string {
  return todayFormatter.format(now);
}

function buildCreateReportSchema(today: string) {
  return z.object({
    type: z.enum(REPORT_TYPES, { error: "Chọn loại tin: bị mất đồ hoặc nhặt được đồ." }),
    title: z
      .string({ error: `Nhập tên đồ vật từ ${TITLE_MIN_LENGTH} ký tự.` })
      .trim()
      .min(TITLE_MIN_LENGTH, { error: `Nhập tên đồ vật từ ${TITLE_MIN_LENGTH} ký tự.` })
      .max(TITLE_MAX_LENGTH, { error: `Tên đồ vật tối đa ${TITLE_MAX_LENGTH} ký tự.` }),
    category: z.enum(REPORT_CATEGORIES, { error: "Chọn một danh mục." }),
    location: z.enum(REPORT_LOCATIONS, { error: "Chọn khu vực xảy ra sự việc." }),
    eventDate: z.iso
      .date({ error: "Chọn ngày xảy ra." })
      .refine((date) => date <= today, { error: "Ngày xảy ra không được ở tương lai." }),
    description: z
      .string({ error: `Mô tả ít nhất ${DESCRIPTION_MIN_LENGTH} ký tự.` })
      .trim()
      .min(DESCRIPTION_MIN_LENGTH, { error: `Mô tả ít nhất ${DESCRIPTION_MIN_LENGTH} ký tự.` })
      .max(DESCRIPTION_MAX_LENGTH, {
        error: `Mô tả tối đa ${DESCRIPTION_MAX_LENGTH} ký tự.`,
      }),
  });
}

export type CreateReportInput = z.infer<ReturnType<typeof buildCreateReportSchema>>;

export type CreateReportValidation =
  | { success: true; data: CreateReportInput }
  | { success: false; fieldErrors: Partial<Record<CreateReportField, string[]>> };

export function validateCreateReport(
  raw: Record<string, unknown>,
  today: string = todayInVietnam(),
): CreateReportValidation {
  const result = buildCreateReportSchema(today).safeParse(raw);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, fieldErrors: z.flattenError(result.error).fieldErrors };
}

export type ReportFilters = {
  q?: string;
  type?: ReportType;
  category?: ReportCategory;
  location?: ReportLocation;
};

// Unknown filter values are dropped instead of failing the page, so a stale or edited URL still shows the feed.
const reportFiltersSchema = z.object({
  q: z
    .string()
    .optional()
    .catch(undefined)
    .transform((value) => value?.trim().slice(0, SEARCH_MAX_LENGTH) || undefined),
  type: z.enum(REPORT_TYPES).optional().catch(undefined),
  category: z.enum(REPORT_CATEGORIES).optional().catch(undefined),
  location: z.enum(REPORT_LOCATIONS).optional().catch(undefined),
});

type SearchParams = Record<string, string | string[] | undefined>;

export function parseReportFilters(searchParams: SearchParams): ReportFilters {
  const first = (key: keyof ReportFilters) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const filters = reportFiltersSchema.parse({
    q: first("q"),
    type: first("type"),
    category: first("category"),
    location: first("location"),
  });
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined),
  ) as ReportFilters;
}

export function hasActiveFilters(filters: ReportFilters): boolean {
  return Object.values(filters).some((value) => value !== undefined);
}

export function isReportId(value: string): boolean {
  return z.guid().safeParse(value).success;
}

export function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}
