import type {
  ReportCategory,
  ReportLocation,
  ReportStatus,
  ReportType,
} from "../../db/schema";

// Labels and icons follow the approved mockup: docs/02_reports/assets/ui/index.html
export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  lost: "Đồ bị mất",
  found: "Đồ nhặt được",
};

export const REPORT_TYPE_ICONS: Record<ReportType, string> = {
  lost: "🔎",
  found: "✓",
};

export const REPORT_CATEGORY_LABELS: Record<ReportCategory, string> = {
  electronics: "Điện tử",
  "wallet-docs": "Ví / giấy tờ",
  keys: "Chìa khóa",
  clothing: "Quần áo / phụ kiện",
  study: "Sách / dụng cụ học tập",
  other: "Khác",
};

export const REPORT_CATEGORY_ICONS: Record<ReportCategory, string> = {
  electronics: "🎧",
  "wallet-docs": "👛",
  keys: "🔑",
  clothing: "🧥",
  study: "📚",
  other: "📦",
};

export const REPORT_LOCATION_LABELS: Record<ReportLocation, string> = {
  H1: "Tòa H1",
  H2: "Tòa H2",
  H3: "Tòa H3",
  H6: "Thư viện H6",
  parking: "Nhà giữ xe",
  canteen: "Căn tin",
  sports: "Khu thể thao",
  other: "Khu vực khác",
};

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  open: "Đang mở",
  pending: "Có yêu cầu đang chờ",
  accepted: "Đã chấp nhận người nhận",
  returned: "Đã trao trả",
  closed: "Đã đóng",
};

export function labelEntries<K extends string>(labels: Record<K, string>) {
  return Object.entries(labels) as [K, string][];
}

// eventDate is a calendar date (YYYY-MM-DD); formatting via Date would shift it across time zones.
export function formatEventDate(date: string): string {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

const createdAtFormatter = new Intl.DateTimeFormat("vi-VN", {
  timeZone: "Asia/Ho_Chi_Minh",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatCreatedAt(date: Date): string {
  return createdAtFormatter.format(date);
}
