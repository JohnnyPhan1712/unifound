import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CategoryIcon } from "@/components/ui/category-icon";
import { feedHref } from "@/lib/reports/feed-url";
import type { FeedParams } from "@/lib/reports/query";
import type { CatalogOption } from "./report-form";

type Props = {
  params: FeedParams;
  categories: CatalogOption[];
  locations: CatalogOption[];
  schools: CatalogOption[];
};

/** Ô tìm kiếm dạng pill + hàng danh mục + bộ lọc phụ. Form GET: chạy không cần JS, URL chia sẻ được. */
export function FeedFilters({ params, categories, locations, schools }: Props) {
  const extra = [params.schoolId, params.from, params.to].filter(Boolean).length;
  const groups = new Map<string, CatalogOption[]>();
  for (const l of locations) groups.set(l.group ?? "Khác", [...(groups.get(l.group ?? "Khác") ?? []), l]);

  const chips: { label: string; href: string }[] = [];
  if (params.q) chips.push({ label: `“${params.q}”`, href: feedHref(params, { q: "", page: 1 }) });
  const cat = categories.find((c) => c.id === params.categoryId);
  if (cat) chips.push({ label: cat.name, href: feedHref(params, { categoryId: undefined, page: 1 }) });
  const loc = locations.find((l) => l.id === params.locationId);
  if (loc) chips.push({ label: loc.name, href: feedHref(params, { locationId: undefined, page: 1 }) });
  const school = schools.find((s) => s.id === params.schoolId);
  if (school) chips.push({ label: school.name, href: feedHref(params, { schoolId: undefined, page: 1 }) });
  if (params.from) chips.push({ label: `Từ ${params.from.split("-").reverse().join("/")}`, href: feedHref(params, { from: undefined, page: 1 }) });
  if (params.to) chips.push({ label: `Đến ${params.to.split("-").reverse().join("/")}`, href: feedHref(params, { to: undefined, page: 1 }) });

  return (
    <form method="get" action="/" role="search">
      {params.type !== "ALL" && <input type="hidden" name="type" value={params.type} />}

      <div className="flex justify-center pb-6 pt-4 max-[744px]:pb-4">
        <div className="flex h-[66px] w-full max-w-[860px] items-center rounded-full border border-line bg-canvas py-0 pl-0 pr-2 shadow-panel max-[744px]:h-14 max-[744px]:pl-5">
          <label className="relative flex h-full min-w-0 flex-[1.5] flex-col justify-center rounded-full pl-8 pr-6 hover:bg-surface-soft focus-within:bg-canvas focus-within:shadow-[0_6px_20px_rgba(0,0,0,0.12)] max-[744px]:flex-1 max-[744px]:px-0 max-[744px]:hover:bg-transparent max-[744px]:focus-within:shadow-none">
            <span className="text-[0.75rem] font-semibold max-[744px]:sr-only">Tìm gì</span>
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={params.q}
              placeholder="Tai nghe, ví, chìa khóa…"
              maxLength={100}
              className="w-full bg-transparent text-[0.875rem] outline-none placeholder:text-muted max-[744px]:text-[0.9375rem]"
            />
          </label>
          <label className="relative flex h-full min-w-0 flex-1 flex-col justify-center rounded-full px-6 before:absolute before:inset-y-[18px] before:left-0 before:w-px before:bg-line hover:bg-surface-soft focus-within:bg-canvas focus-within:shadow-[0_6px_20px_rgba(0,0,0,0.12)] max-[744px]:hidden">
            <span className="text-[0.75rem] font-semibold">Danh mục</span>
            <select name="category" defaultValue={params.categoryId ?? ""} className="w-full cursor-pointer appearance-none truncate bg-transparent text-[0.875rem] outline-none">
              <option value="">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="relative flex h-full min-w-0 flex-1 flex-col justify-center rounded-full px-6 before:absolute before:inset-y-[18px] before:left-0 before:w-px before:bg-line hover:bg-surface-soft focus-within:bg-canvas focus-within:shadow-[0_6px_20px_rgba(0,0,0,0.12)] max-[744px]:hidden">
            <span className="text-[0.75rem] font-semibold">Khu vực</span>
            <select name="location" defaultValue={params.locationId ?? ""} className="w-full cursor-pointer appearance-none truncate bg-transparent text-[0.875rem] outline-none">
              <option value="">Mọi khu vực</option>
              {[...groups].map(([group, list]) => (
                <optgroup key={group} label={group}>
                  {list.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <button type="submit" aria-label="Tìm kiếm" className="grid size-12 flex-none place-items-center rounded-full bg-primary text-white hover:bg-primary-hover max-[744px]:size-10">
            <Search className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      <div className="-mx-[var(--gutter)] border-b border-line-soft px-[var(--gutter)]">
        <div className="relative flex items-center gap-6">
          <nav aria-label="Lọc theo danh mục" className="flex flex-1 gap-8 overflow-x-auto [scrollbar-width:none] max-[744px]:gap-6">
            {categories.map((c) => {
              const on = c.id === params.categoryId;
              return (
                <Link
                  key={c.id}
                  href={feedHref(params, { categoryId: on ? undefined : c.id, page: 1 })}
                  aria-current={on ? "true" : undefined}
                  className={`flex shrink-0 flex-col items-center gap-2 border-b-2 pb-3.5 pt-3 text-[0.75rem] font-semibold no-underline ${
                    on ? "border-ink text-ink" : "border-transparent text-muted opacity-85 hover:border-line hover:text-ink hover:opacity-100"
                  }`}
                >
                  <CategoryIcon name={c.name} className="size-6" />
                  <span>{c.name}</span>
                </Link>
              );
            })}
          </nav>
          <details className="group shrink-0" open={extra > 0}>
            <summary className="flex h-12 cursor-pointer list-none items-center gap-2 rounded-md border border-line bg-canvas px-4 text-[0.75rem] font-semibold hover:border-ink max-[744px]:w-12 max-[744px]:justify-center max-[744px]:rounded-full max-[744px]:px-0 [&::-webkit-details-marker]:hidden">
              <SlidersHorizontal className="size-5" aria-hidden />
              <span className="max-[744px]:hidden">Bộ lọc</span>
              {extra > 0 && <span className="tabular grid size-5 place-items-center rounded-full bg-ink text-[0.75rem] text-white">{extra}</span>}
            </summary>
            <div className="absolute right-0 top-[calc(100%+8px)] z-30 grid w-[min(420px,calc(100vw-48px))] gap-4 rounded-md border border-line bg-canvas p-5 shadow-panel">
              <div className="grid gap-2">
                <label htmlFor="flt-school" className="text-[0.875rem] font-semibold">
                  Trường
                </label>
                <select id="flt-school" name="school" defaultValue={params.schoolId ?? ""} className="control">
                  <option value="">Tất cả trường</option>
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <label htmlFor="from" className="text-[0.875rem] font-semibold">
                    Từ ngày
                  </label>
                  <input id="from" name="from" type="date" defaultValue={params.from} className="control tabular" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="to" className="text-[0.875rem] font-semibold">
                    Đến ngày
                  </label>
                  <input id="to" name="to" type="date" defaultValue={params.to} className="control tabular" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Link href={feedHref(params, { schoolId: undefined, from: undefined, to: undefined, page: 1 })} className="btn btn-text">
                  Xóa
                </Link>
                <button type="submit" className="btn btn-primary btn-sm">
                  Áp dụng
                </button>
              </div>
            </div>
          </details>
        </div>
      </div>

      {chips.length > 0 && (
        <ul className="flex flex-wrap gap-2 pt-4" aria-label="Bộ lọc đang bật">
          {chips.map((c) => (
            <li key={c.label} className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-canvas pl-3 pr-2 text-[0.8125rem]">
              {c.label}
              <Link href={c.href} aria-label={`Bỏ ${c.label}`} className="grid size-5 place-items-center rounded-full hover:bg-surface-strong">
                <X className="size-3.5" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
