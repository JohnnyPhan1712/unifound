import Link from "next/link";
import { Suspense } from "react";
import { ReportFeed, ReportFeedSkeleton } from "./reports/report-feed";
import { ReportFilterForm } from "./reports/report-filters";
import { hasActiveFilters, parseReportFilters } from "./reports/report-validation";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseReportFilters(await searchParams);
  const filterKey = JSON.stringify(filters);

  return (
    <div className="grid grid-cols-1 gap-5">
      <section className="panel grid items-center gap-6 overflow-hidden bg-[radial-gradient(circle_at_90%_15%,rgb(0_104_95/0.15),transparent_35%)] p-5 sm:p-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
        <div className="grid max-w-[680px] gap-3">
          <span className="eyebrow">Đồ thất lạc trong khuôn viên trường</span>
          <h1>Tìm lại đồ nhanh hơn, trả lại đồ đúng người</h1>
          <p className="text-base text-muted">
            Đăng tin mất hoặc nhặt được đồ, tìm theo từ khóa hoặc lọc theo loại tin, danh mục và
            khu vực.
          </p>
          <div className="mt-1 flex flex-col gap-2.5 sm:flex-row">
            <Link href="/reports/new?type=lost" className="btn btn-lost">
              Tôi bị mất đồ
            </Link>
            <Link href="/reports/new?type=found" className="btn btn-primary">
              Tôi nhặt được đồ
            </Link>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="hidden min-h-[190px] place-items-center rounded-[1.4rem] bg-[linear-gradient(145deg,var(--color-primary-soft),#eef8f6)] text-7xl text-primary sm:grid"
        >
          ⌕
        </div>
      </section>

      {/* Keyed by the active filters so inputs reset when the URL changes via "Đặt lại bộ lọc". */}
      <ReportFilterForm key={filterKey} filters={filters} active={hasActiveFilters(filters)} />

      <section aria-label="Danh sách tin" className="grid grid-cols-1 gap-5">
        <Suspense key={filterKey} fallback={<ReportFeedSkeleton />}>
          <ReportFeed filters={filters} />
        </Suspense>
      </section>
    </div>
  );
}
