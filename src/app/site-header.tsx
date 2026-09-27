"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Tin mới" },
  { href: "/reports/new", label: "Đăng tin" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex min-h-[68px] w-full max-w-[1180px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-2 py-2 sm:px-4">
        <Link
          href="/"
          aria-label="UniFound, về trang tin mới"
          className="inline-flex items-center gap-2.5 text-[1.15rem] font-bold whitespace-nowrap text-ink no-underline"
        >
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-xl bg-primary text-[1.15rem] text-white"
          >
            U
          </span>
          <span>UniFound</span>
        </Link>
        <nav aria-label="Điều hướng chính" className="flex items-center gap-1">
          {navItems.map((item) => {
            const current = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={`rounded-xl px-3 py-2.5 font-semibold whitespace-nowrap no-underline max-sm:text-[0.8rem] ${
                  current
                    ? "bg-primary-soft text-primary"
                    : "text-muted hover:bg-surface-soft hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
