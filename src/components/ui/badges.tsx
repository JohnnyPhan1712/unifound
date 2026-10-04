import { Check, Package, Search } from "lucide-react";
import type { ClaimStatus, ReportStatus, ReportType } from "@/db/schema";
import { CLAIM_STATUS_LABEL, REPORT_STATUS_LABEL, REPORT_TYPE_LABEL } from "@/lib/labels";

// Loại tin luôn có icon + chữ, không chỉ dựa vào màu (Not-Just-Color Rule).
// `onPlate`: viên thuốc trắng có bóng, đặt trên vùng minh họa; mặc định là nền nhạt theo loại.
export function TypeBadge({ type, onPlate }: { type: ReportType; onPlate?: boolean }) {
  const lost = type === "LOST";
  const Icon = lost ? Search : Package;
  return (
    <span className={`type-badge ${lost ? "lost" : "found"} ${onPlate ? "" : "flat"}`}>
      <Icon className="size-4" aria-hidden />
      {REPORT_TYPE_LABEL[type]}
    </span>
  );
}

type Tone = "open" | "pending" | "accepted" | "rejected" | "closed" | "returned";

function Pill({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span className={`status ${tone}`}>
      {tone === "returned" ? <Check className="size-3.5" strokeWidth={2.4} aria-hidden /> : <span className="dot" aria-hidden />}
      {children}
    </span>
  );
}

const reportTone: Record<ReportStatus, Tone> = {
  OPEN: "open",
  IN_PROGRESS: "accepted",
  RETURNED: "returned",
  CLOSED: "closed",
  HIDDEN: "rejected",
};

export function StatusBadge({ status, expired }: { status: ReportStatus; expired?: boolean }) {
  if (expired && status === "OPEN") return <Pill tone="closed">Đã hết hạn</Pill>;
  return <Pill tone={reportTone[status]}>{REPORT_STATUS_LABEL[status]}</Pill>;
}

const claimTone: Record<ClaimStatus, Tone> = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  COMPLETED: "returned",
  EXPIRED: "closed",
  CANCELLED: "closed",
};

export function ClaimBadge({ status }: { status: ClaimStatus }) {
  return <Pill tone={claimTone[status]}>{CLAIM_STATUS_LABEL[status]}</Pill>;
}
