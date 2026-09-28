import type { ReportStatus, ReportType } from "@/db";
import { REPORT_STATUS_LABELS, REPORT_TYPE_ICONS, REPORT_TYPE_LABELS } from "./report-display";

// Text labels carry the meaning; color and icon are secondary cues.
export function ReportTypeBadge({ type, className = "" }: { type: ReportType; className?: string }) {
  return (
    <span className={`type-badge ${type === "lost" ? "lost" : ""} ${className}`}>
      <span aria-hidden="true">{REPORT_TYPE_ICONS[type]}</span>
      {REPORT_TYPE_LABELS[type]}
    </span>
  );
}

export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  return (
    <span className={`status-badge ${status === "open" ? "active" : ""}`}>
      <span className="sr-only">Trạng thái: </span>
      {REPORT_STATUS_LABELS[status]}
    </span>
  );
}
