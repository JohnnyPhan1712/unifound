import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReportStatus } from "@/db";
import { ReportStatusBadge, ReportTypeBadge } from "../report-badges";
import {
  REPORT_CATEGORY_ICONS,
  REPORT_CATEGORY_LABELS,
  REPORT_LOCATION_LABELS,
  REPORT_STATUS_LABELS,
  formatCreatedAt,
  formatEventDate,
} from "../report-display";
import { getPublicReport } from "../report-queries";
import { isReportId } from "../report-validation";

type ReportDetailProps = {
  params: Promise<{ id: string }>;
};

async function findReport(id: string) {
  return isReportId(id) ? getPublicReport(id) : null;
}

export async function generateMetadata({ params }: ReportDetailProps): Promise<Metadata> {
  const report = await findReport((await params).id);
  return { title: report ? `${report.title} · UniFound` : "Không tìm thấy tin · UniFound" };
}

const statusNotes: Record<ReportStatus, string> = {
  open: "Tin đang mở và có thể nhận phản hồi.",
  pending: "Tin đang có yêu cầu nhận lại chờ chủ tin xử lý.",
  accepted: "Chủ tin đã chấp nhận người nhận, đang chờ trao trả.",
  returned: "Món đồ đã được trao trả. Tin chỉ còn để tham khảo.",
  closed: "Tin đã đóng và không còn nhận phản hồi mới.",
};

export default async function ReportDetailPage({ params }: ReportDetailProps) {
  const report = await findReport((await params).id);
  if (!report) notFound();

  return (
    <div className="grid grid-cols-1 gap-5">
      <div>
        <Link href="/" className="btn btn-ghost">
          ← Quay lại danh sách
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.75fr)]">
        <article className="panel grid content-start gap-4">
          <div
            aria-hidden="true"
            className={`report-visual min-h-[200px] rounded-2xl text-[5rem] sm:min-h-[260px] ${report.type === "lost" ? "lost" : ""}`}
          >
            {REPORT_CATEGORY_ICONS[report.category]}
          </div>
          <div className="grid gap-2.5">
            <div className="flex flex-wrap gap-2">
              <ReportTypeBadge type={report.type} />
              <ReportStatusBadge status={report.status} />
            </div>
            <h1 className="wrap-anywhere">{report.title}</h1>
            <p className="whitespace-pre-line text-muted wrap-anywhere">{report.description}</p>
          </div>
        </article>

        <aside className="grid content-start gap-4">
          <dl className="panel grid gap-3 bg-surface-soft">
            <DetailItem icon="⌖" label="Khu vực" value={REPORT_LOCATION_LABELS[report.location]} />
            <DetailItem icon="◷" label="Ngày xảy ra" value={formatEventDate(report.eventDate)} />
            <DetailItem icon="▦" label="Danh mục" value={REPORT_CATEGORY_LABELS[report.category]} />
            <DetailItem icon="✎" label="Ngày đăng" value={formatCreatedAt(report.createdAt)} />
          </dl>

          <section className="grid gap-3 rounded-2xl bg-primary-soft p-4">
            <h3>{REPORT_STATUS_LABELS[report.status]}</h3>
            <p className="text-[0.84rem] text-muted">{statusNotes[report.status]}</p>
          </section>

          <p className="notice info">
            <span aria-hidden="true">ⓘ</span>
            <span>Thông tin liên hệ và chi tiết xác minh không được công khai trên trang tin.</span>
          </p>
        </aside>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="grid grid-cols-[1.2rem_1fr] gap-2">
      <span aria-hidden="true">{icon}</span>
      <div>
        <dt className="font-bold">{label}</dt>
        <dd className="text-muted">{value}</dd>
      </div>
    </div>
  );
}
