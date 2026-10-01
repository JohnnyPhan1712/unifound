import Link from "next/link";
import { Info, SearchX } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { FeedFilters } from "@/components/reports/feed-filters";
import { ReportCard } from "@/components/reports/report-card";
import { getCurrentUser } from "@/lib/auth/session";
import { feedHref } from "@/lib/reports/feed-url";
import { getCatalogOptions } from "@/lib/reports/catalog";
import { getFeed, parseFeedParams } from "@/lib/reports/query";

const TYPE_FILTERS = [
  { type: "ALL", label: "Tất cả" },
  { type: "LOST", label: "Mất đồ" },
  { type: "FOUND", label: "Nhặt được" },
] as const;

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const params = parseFeedParams(await searchParams);
  const [{ items, total, pages }, catalog, viewer] = await Promise.all([getFeed(params), getCatalogOptions(), getCurrentUser()]);
  const filtered = Boolean(params.q || params.categoryId || params.schoolId || params.locationId || params.from || params.to);

  return (
    <div>
      <FeedFilters params={params} {...catalog} />

      {/* Điện thoại: ba tab loại tin nằm dưới ô tìm kiếm vì header không còn chỗ */}
      <nav aria-label="Loại tin" className="hidden gap-2 overflow-x-auto py-3 max-[744px]:flex">
        {TYPE_FILTERS.map(({ type, label }) => (
          <Link
            key={type}
            href={feedHref(params, { type, page: 1 })}
            aria-current={params.type === type ? "page" : undefined}
            className="inline-flex h-10 shrink-0 items-center rounded-full border border-line px-4 text-[0.875rem] font-medium no-underline aria-[current=page]:border-ink aria-[current=page]:bg-surface-soft aria-[current=page]:shadow-[inset_0_0_0_1px_var(--color-ink)]"
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex flex-wrap items-baseline justify-between gap-4 pb-4 pt-6">
        <div>
          <h1 className="text-[1.375rem] font-semibold">Đồ thất lạc quanh trường</h1>
          <p className="text-[0.875rem] text-muted" aria-live="polite">
            <span className="tabular">{total}</span> tin · mới nhất trước
          </p>
        </div>
        {!viewer && (
          <div className="flex items-start gap-3 rounded-md bg-primary-soft px-3.5 py-2.5 text-[0.875rem] text-info">
            <Info className="mt-px size-5 shrink-0 text-primary-hover" aria-hidden />
            <span>
              Ai cũng xem được bảng tin.{" "}
              <Link href="/login" className="font-semibold">
                Đăng nhập
              </Link>{" "}
              để đăng tin hoặc gửi yêu cầu nhận lại.
            </span>
          </div>
        )}
      </div>

      {items.length ? (
        <ul className="grid grid-cols-4 gap-x-6 gap-y-10 pb-16 max-[1128px]:grid-cols-3 max-[900px]:grid-cols-2 max-[744px]:grid-cols-1 max-[744px]:gap-y-8">
          {items.map((r) => (
            <li key={r.id} className="flex">
              <ReportCard r={r} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={SearchX}
          title={filtered ? "Không có tin khớp bộ lọc" : "Chưa có tin nào"}
          action={
            filtered ? (
              <Link href={feedHref(params, { q: "", categoryId: undefined, schoolId: undefined, locationId: undefined, from: undefined, to: undefined, page: 1 })} className="btn btn-secondary">
                Xóa bộ lọc
              </Link>
            ) : (
              <Link href="/reports/new" className="btn btn-primary">
                Đăng tin đầu tiên
              </Link>
            )
          }
        >
          {filtered ? "Thử bỏ bớt bộ lọc, đổi từ khóa ngắn hơn hoặc xem tab loại tin khác." : "Khi có người đăng, tin sẽ hiện ở đây."}
        </EmptyState>
      )}

      <Pagination page={params.page} pages={pages} href={(page) => feedHref(params, { page })} />
    </div>
  );
}
