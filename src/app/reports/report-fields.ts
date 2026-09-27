// Shared by the client form and server validation, so it must not import the DB schema at runtime.
export const CREATE_REPORT_FIELDS = [
  "type",
  "title",
  "category",
  "location",
  "eventDate",
  "description",
] as const;

export type CreateReportField = (typeof CREATE_REPORT_FIELDS)[number];

// Limits follow the approved mockup: docs/02_reports/assets/ui/index.html
export const TITLE_MIN_LENGTH = 4;
export const TITLE_MAX_LENGTH = 100;
export const DESCRIPTION_MIN_LENGTH = 10;
export const DESCRIPTION_MAX_LENGTH = 600;
export const SEARCH_MAX_LENGTH = 100;
