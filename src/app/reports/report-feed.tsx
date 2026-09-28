import Link from "next/link";
import { ReportStatusBadge, ReportTypeBadge } from "./report-badges";
import {
  REPORT_CATEGORY_ICONS,
  REPORT_LOCATION_LABELS,
  formatEventDate,
} from "./report-display";
import { FEED_LIMIT, listPublicReports, type PublicReport } from "./report-queries";
import { hasActiveFilters, type ReportFilters } from "./report-validation";

export async function ReportFeed({ filters }: { filters: ReportFilters }) {
  const { reports, hasMore } = await listPublicReports(filters);

  if (reports.length === 0) {
    return (
      <>
        <ResultsBar summary="Không có tin nào." />
        <EmptyFeed filtered={hasActiveFilters(filters)} />
      </>
    );
  }

  return (
    <>
      <ResultsBar
        summary={
          hasMore
            ? `Đang hiển thị ${FEED_LIMIT} tin mới nhất. Thêm từ khóa hoặc bộ lọc để thu hẹp kết quả.`
            : `Tìm thấy ${reports.length} tin.`
        }
      />
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <li key={report.id} className="min-w-0">
            <ReportCard report={report} />
          </li>
        ))}
      </ul>
    </>
  );
}

function ResultsBar({ summary }: { summary?: string }) {
  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div>
        <h2>Tin gần đây</h2>
        <p className="text-muted" role="status">
          {summary ?? "Đang tải tin…"}
        </p>
      </div>
      <span className="text-muted">Thông tin xác minh riêng tư không hiển thị công khai.</span>
    </div>
  );
}

function ReportCard({ report }: { report: PublicReport }) {
  return (
    <article className="grid h-full grid-rows-[auto_1fr_auto] overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_4px_16px_rgb(30_50_60/0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgb(30_50_60/0.08)]">
      <div className="relative">
        <div
          aria-hidden="true"
          className={`report-visual min-h-[125px] text-[3.5rem] sm:min-h-[150px] ${report.type === "lost" ? "lost" : ""}`}
        >
          {REPORT_CATEGORY_ICONS[report.category]}
        </div>
        <ReportTypeBadge type={report.type} className="absolute top-3 left-3" />
      </div>
      <div className="grid content-start gap-2 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <ReportStatusBadge status={report.status} />
        </div>
        <h3 className="line-clamp-2 wrap-anywhere">{report.title}</h3>
        <p className="flex items-start gap-1.5 text-[0.8rem] text-muted">
          <span aria-hidden="true">⌖</span>
          <span>
            {REPORT_LOCATION_LABELS[report.location]} · {formatEventDate(report.eventDate)}
          </span>
        </p>
        <p className="line-clamp-2 text-muted wrap-anywhere">{report.description}</p>
      </div>
      <div className="flex gap-2 px-4 pb-4">
        <Link href={`/reports/${report.id}`} className="btn btn-secondary btn-small flex-1">
          Xem chi tiết<span className="sr-only">: {report.title}</span>
        </Link>
      </div>
    </article>
  );
}

function EmptyFeed({ filtered }: { filtered: boolean }) {
  return (
    <section className="empty-state">
      <span aria-hidden="true" className="text-[2.5rem]">
        ⌕
      </span>
      <h3>{filtered ? "Không tìm thấy tin phù hợp" : "Chưa có tin nào"}</h3>
      <p className="text-muted">
        {filtered
          ? "Thử đổi từ khóa hoặc mở rộng bộ lọc."
          : "Khi có sinh viên báo mất hoặc nhặt được đồ, tin sẽ xuất hiện tại đây."}
      </p>
      {filtered ? (
        <Link href="/" className="btn btn-secondary">
          Đặt lại bộ lọc
        </Link>
      ) : (
        <Link href="/reports/new" className="btn btn-primary">
          Đăng tin mới
        </Link>
      )}
    </section>
  );
}

export function ReportFeedSkeleton() {
  return (
    <div aria-busy="true" className="grid gap-5">
      <ResultsBar />
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
        {Array.from({ length: 6 }, (_, index) => (
          <li key={index} className="overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="h-[125px] animate-pulse bg-surface-soft sm:h-[150px]" />
            <div className="grid gap-3 p-4">
              <div className="h-5 w-20 animate-pulse rounded-full bg-line" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-line" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-line" />
              <div className="h-4 w-full animate-pulse rounded bg-line" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
