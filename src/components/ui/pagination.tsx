import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** Phân trang giữ nguyên các tham số lọc hiện tại. */
export function Pagination({ page, pages, href }: { page: number; pages: number; href: (page: number) => string }) {
  if (pages <= 1) return null;
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 1);

  return (
    <nav aria-label="Phân trang" className="flex items-center justify-center gap-1 pb-16">
      {page > 1 ? (
        <Link href={href(page - 1)} className="icon-btn" aria-label="Trang trước">
          <ChevronLeft className="size-5" aria-hidden />
        </Link>
      ) : null}
      {nums.map((n, i) => (
        <span key={n} className="flex items-center gap-1">
          {i > 0 && n - nums[i - 1] > 1 && <span className="px-1 text-muted">…</span>}
          <Link
            href={href(n)}
            aria-current={n === page ? "page" : undefined}
            className={`tabular grid h-10 min-w-10 place-items-center rounded-full px-3 text-[0.875rem] font-semibold no-underline ${
              n === page ? "bg-ink text-white" : "text-ink hover:bg-surface-soft"
            }`}
          >
            {n}
          </Link>
        </span>
      ))}
      {page < pages ? (
        <Link href={href(page + 1)} className="icon-btn" aria-label="Trang sau">
          <ChevronRight className="size-5" aria-hidden />
        </Link>
      ) : null}
    </nav>
  );
}
