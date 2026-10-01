"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LayoutGrid, Package, Search } from "lucide-react";

const TABS = [
  { type: "ALL", label: "Tất cả", Icon: LayoutGrid, tone: "bg-primary-soft text-primary-hover" },
  { type: "LOST", label: "Mất đồ", Icon: Search, tone: "bg-lost-soft text-lost" },
  { type: "FOUND", label: "Nhặt được", Icon: Package, tone: "bg-found-soft text-found" },
] as const;

/** Ba tab loại tin giữa header (chỉ ở bảng tin); giữ nguyên từ khóa/bộ lọc khi đổi tab. */
export function TypeTabs() {
  const pathname = usePathname();
  const params = useSearchParams();
  if (pathname !== "/") return null;
  const current = params.get("type") === "LOST" ? "LOST" : params.get("type") === "FOUND" ? "FOUND" : "ALL";

  const href = (type: string) => {
    const next = new URLSearchParams(params);
    next.delete("page");
    if (type === "ALL") next.delete("type");
    else next.set("type", type);
    const qs = next.toString();
    return qs ? `/?${qs}` : "/";
  };

  return (
    <nav aria-label="Loại tin" className="flex h-20 items-stretch gap-2 max-[900px]:h-16">
      {TABS.map(({ type, label, Icon, tone }) => {
        const active = current === type;
        return (
          <Link
            key={type}
            href={href(type)}
            aria-current={active ? "page" : undefined}
            className={`group relative flex items-center gap-2 px-3 text-[1rem] font-semibold no-underline ${active ? "text-ink" : "text-muted hover:text-ink"}`}
          >
            <span className={`grid size-8 place-items-center rounded-sm max-[900px]:hidden ${tone}`}>
              <Icon className="size-5" aria-hidden />
            </span>
            {label}
            <span
              className={`absolute inset-x-3 bottom-0 h-0.5 origin-center bg-ink transition-transform duration-300 ${active ? "scale-x-100" : "scale-x-0"}`}
              aria-hidden
            />
          </Link>
        );
      })}
    </nav>
  );
}
