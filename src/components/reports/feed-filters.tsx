"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
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

type Tab = "q" | "category" | "place" | "time";

const dmy = (d: string) => d.split("-").reverse().join("/");

const SEGMENT =
  "flex h-full min-w-0 flex-1 flex-col justify-center rounded-full px-6 text-left before:absolute before:inset-y-[18px] before:left-0 before:w-px before:bg-line max-[744px]:h-14 max-[744px]:px-4 max-[744px]:before:hidden min-[745px]:relative";
const POPOVER =
  "absolute top-[calc(100%+8px)] left-0 z-40 grid w-[min(380px,calc(100vw-48px))] gap-4 rounded-md border border-line bg-canvas p-5 shadow-panel max-[744px]:inset-x-0 max-[744px]:w-auto";

/**
 * Thanh tìm kiếm 4 phân đoạn (Tìm kiếm / Danh mục / Vị trí / Thời gian), dính đầu trang khi cuộn.
 * Form GET: URL chia sẻ được. Các popover luôn có trong DOM (chỉ ẩn) để giá trị vẫn được gửi đi.
 * ponytail: popover cần JS để mở; không JS vẫn tìm theo từ khóa và giữ bộ lọc đang chọn.
 */
export function FeedFilters({ params, categories, locations, schools }: Props) {
  const [active, setActive] = useState<Tab | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [category, setCategory] = useState(params.categoryId ?? "");
  const [school, setSchool] = useState(params.schoolId ?? "");
  const [location, setLocation] = useState(params.locationId ?? "");
  const [from, setFrom] = useState(params.from ?? "");
  const [to, setTo] = useState(params.to ?? "");
  const root = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setActive(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Có chọn trường thì chỉ hiện khu vực của trường đó (địa điểm dùng chung không thuộc trường nào bị ẩn).
  const shown = school ? locations.filter((l) => l.schoolId === school) : locations;
  const groups = new Map<string, CatalogOption[]>();
  for (const l of shown) groups.set(l.group ?? "Khác", [...(groups.get(l.group ?? "Khác") ?? []), l]);

  const chips: { label: string; href: string }[] = [];
  if (params.q) chips.push({ label: `“${params.q}”`, href: feedHref(params, { q: "", page: 1 }) });
  const cat = categories.find((c) => c.id === params.categoryId);
  if (cat) chips.push({ label: cat.name, href: feedHref(params, { categoryId: undefined, page: 1 }) });
  const schoolChip = schools.find((s) => s.id === params.schoolId);
  if (schoolChip) chips.push({ label: schoolChip.name, href: feedHref(params, { schoolId: undefined, locationId: undefined, page: 1 }) });
  const loc = locations.find((l) => l.id === params.locationId);
  if (loc) chips.push({ label: loc.name, href: feedHref(params, { locationId: undefined, page: 1 }) });
  if (params.from) chips.push({ label: `Từ ${dmy(params.from)}`, href: feedHref(params, { from: undefined, page: 1 }) });
  if (params.to) chips.push({ label: `Đến ${dmy(params.to)}`, href: feedHref(params, { to: undefined, page: 1 }) });

  const segment = (tab: Tab) =>
    `${SEGMENT} ${active === tab ? "bg-canvas shadow-[0_4px_16px_rgba(0,0,0,0.12)]" : "hover:bg-surface-soft"} ${active && active !== tab ? "opacity-60 hover:opacity-90" : ""}`;
  const toggle = (tab: Tab) => setActive(active === tab ? null : tab);

  const catName = categories.find((c) => c.id === category)?.name;
  const placeText = locations.find((l) => l.id === location)?.name ?? schools.find((s) => s.id === school)?.name;
  const timeText = from || to ? `${from ? dmy(from) : "…"} – ${to ? dmy(to) : "…"}` : undefined;

  return (
    <>
      <form
        ref={root}
        method="get"
        action="/"
        role="search"
        className={`sticky top-0 z-30 -mx-[var(--gutter)] px-[var(--gutter)] pb-4 pt-4 transition-shadow ${
          scrolled ? "border-b border-line-soft bg-canvas/95 shadow-[0_4px_20px_rgba(0,0,0,0.06)] backdrop-blur-md" : ""
        }`}
      >
        {params.type !== "ALL" && <input type="hidden" name="type" value={params.type} />}

        <div className="mx-auto flex max-w-[860px] justify-center">
          <div className="relative flex min-h-[66px] w-full items-center rounded-full border border-line bg-surface pr-2 shadow-panel max-[744px]:flex-wrap max-[744px]:rounded-2xl max-[744px]:p-2">
            <label className={`${segment("q").replace("flex-1", "flex-[1.4]")} max-[744px]:basis-0 max-[744px]:flex-1`}>
              <span className="text-[0.75rem] font-semibold">Tìm kiếm</span>
              <input
                name="q"
                type="text"
                autoComplete="off"
                defaultValue={params.q}
                onFocus={() => setActive("q")}
                placeholder="Tai nghe, ví, chìa khóa…"
                maxLength={100}
                className="w-full bg-transparent text-[0.875rem] text-ink outline-none placeholder:text-muted"
              />
            </label>

            <div className="flex h-full min-w-0 flex-[3] max-[744px]:order-last max-[744px]:grid max-[744px]:basis-full max-[744px]:grid-cols-3">
              <div className={segment("category")}>
                <button type="button" onClick={() => toggle("category")} aria-expanded={active === "category"} className="min-w-0 text-left">
                  <span className="block text-[0.75rem] font-semibold">Danh mục</span>
                  <span className={`block truncate text-[0.875rem] ${catName ? "text-ink" : "text-muted"}`}>{catName ?? "Tất cả"}</span>
                </button>
                <div hidden={active !== "category"} className={`${POPOVER} max-h-[70vh] gap-1 overflow-y-auto p-2`}>
                  {[{ id: "", name: "Tất cả danh mục" }, ...categories].map((c) => (
                    <label key={c.id} className="flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2.5 text-[0.875rem] hover:bg-surface-soft has-[:checked]:bg-surface-strong has-[:checked]:font-semibold">
                      <input
                        type="radio"
                        name="category"
                        value={c.id}
                        checked={category === c.id}
                        onChange={() => {
                          setCategory(c.id);
                          setActive(null);
                        }}
                        className="sr-only"
                      />
                      {c.id ? <CategoryIcon name={c.name} className="size-5 shrink-0" /> : <Search className="size-5 shrink-0" aria-hidden />}
                      {c.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className={segment("place")}>
                <button type="button" onClick={() => toggle("place")} aria-expanded={active === "place"} className="min-w-0 text-left">
                  <span className="block text-[0.75rem] font-semibold">Vị trí</span>
                  <span className={`block truncate text-[0.875rem] ${placeText ? "text-ink" : "text-muted"}`}>{placeText ?? "Mọi nơi"}</span>
                </button>
                <div hidden={active !== "place"} className={POPOVER}>
                  <div className="grid gap-2">
                    <label htmlFor="flt-school" className="text-[0.875rem] font-semibold">
                      Trường
                    </label>
                    <select
                      id="flt-school"
                      name="school"
                      value={school}
                      onChange={(e) => {
                        setSchool(e.target.value);
                        const cur = locations.find((l) => l.id === location);
                        if (cur && e.target.value && cur.schoolId !== e.target.value) setLocation("");
                      }}
                      className="control"
                    >
                      <option value="">Tất cả trường</option>
                      {schools.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="flt-location" className="text-[0.875rem] font-semibold">
                      Khu vực
                    </label>
                    <select id="flt-location" name="location" value={location} onChange={(e) => setLocation(e.target.value)} className="control">
                      <option value="">{school ? "Mọi khu vực của trường" : "Mọi khu vực"}</option>
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
                  </div>
                  <button type="submit" className="btn btn-primary btn-sm justify-self-end">
                    Áp dụng
                  </button>
                </div>
              </div>

              <div className={segment("time")}>
                <button type="button" onClick={() => toggle("time")} aria-expanded={active === "time"} className="min-w-0 text-left">
                  <span className="block text-[0.75rem] font-semibold">Thời gian</span>
                  <span className={`tabular block truncate text-[0.875rem] ${timeText ? "text-ink" : "text-muted"}`}>{timeText ?? "Bất kỳ"}</span>
                </button>
                <div hidden={active !== "time"} className={`${POPOVER}`}>
                  <div className="grid grid-cols-2 gap-3 max-[744px]:grid-cols-1">
                    <div className="grid gap-2">
                      <label htmlFor="from" className="text-[0.875rem] font-semibold">
                        Từ ngày
                      </label>
                      <input id="from" name="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="control tabular w-full min-w-0" />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="to" className="text-[0.875rem] font-semibold">
                        Đến ngày
                      </label>
                      <input id="to" name="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} className="control tabular w-full min-w-0" />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-sm justify-self-end">
                    Áp dụng
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" aria-label="Tìm kiếm" className="ml-2 grid size-12 flex-none place-items-center rounded-full bg-primary text-white hover:bg-primary-hover max-[744px]:size-10">
              <Search className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      </form>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <ul className="contents" aria-label="Bộ lọc đang bật">
            {chips.map((c) => (
              <li key={c.label} className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-canvas pl-3 pr-2 text-[0.8125rem]">
                {c.label}
                <Link href={c.href} aria-label={`Bỏ ${c.label}`} className="grid size-5 place-items-center rounded-full hover:bg-surface-strong">
                  <X className="size-3.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <Link href={feedHref(params, { q: "", categoryId: undefined, schoolId: undefined, locationId: undefined, from: undefined, to: undefined, page: 1 })} className="btn btn-text btn-sm">
            Xóa tất cả
          </Link>
        </div>
      )}
    </>
  );
}
