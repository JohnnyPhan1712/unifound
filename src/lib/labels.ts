import type { ClaimStatus, ReportStatus, ReportType } from "@/db/schema";

export const REPORT_TYPE_LABEL: Record<ReportType, string> = { LOST: "Mất đồ", FOUND: "Nhặt được" };

export const REPORT_STATUS_LABEL: Record<ReportStatus, string> = {
  OPEN: "Đang mở",
  IN_PROGRESS: "Đang bàn giao",
  RETURNED: "Đã trả",
  CLOSED: "Đã đóng",
  HIDDEN: "Đã ẩn",
};

export const CLAIM_STATUS_LABEL: Record<ClaimStatus, string> = {
  PENDING: "Chờ duyệt",
  ACCEPTED: "Đã chấp nhận",
  REJECTED: "Bị từ chối",
  COMPLETED: "Hoàn tất",
  EXPIRED: "Hết hạn",
  CANCELLED: "Đã hủy",
};

const TZ = "Asia/Ho_Chi_Minh";

export function formatDateTime(d: Date | string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: TZ,
  }).format(new Date(d));
}

export function formatDate(d: Date | string): string {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: TZ }).format(new Date(d));
}

/** "3 giờ trước", "2 ngày trước"… */
export function timeAgo(d: Date | string, now = new Date()): string {
  const rtf = new Intl.RelativeTimeFormat("vi", { numeric: "auto" });
  const sec = Math.round((new Date(d).getTime() - now.getTime()) / 1000);
  // Đồng hồ máy chủ app và DB có thể lệch vài giây: thời điểm "tương lai" gần được coi là vừa xong
  if (sec > -60 && sec < 300) return "vừa xong";
  const abs = Math.abs(sec);
  if (abs < 3600) return rtf.format(Math.round(sec / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(sec / 3600), "hour");
  if (abs < 86400 * 30) return rtf.format(Math.round(sec / 86400), "day");
  return formatDate(d);
}

/** "Nguyễn Văn Lan" → "Lan N." (tên gọi + chữ cái đầu họ) để không lộ họ tên đầy đủ trên tin công khai. */
export function shortName(fullName?: string | null): string {
  const parts = (fullName ?? "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "Sinh viên";
  if (parts.length === 1) return parts[0];
  return `${parts[parts.length - 1]} ${parts[0][0].toUpperCase()}.`;
}
