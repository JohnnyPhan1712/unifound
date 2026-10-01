"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = { href: string; label: string };

const matches = (pathname: string, href: string) => pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

/** Mục khớp dài nhất được chọn, để "/admin" không sáng cùng "/admin/users". */
function activeHref(pathname: string, items: NavItem[]) {
  return items.filter((i) => matches(pathname, i.href)).sort((a, b) => b.href.length - a.href.length)[0]?.href;
}

export function NavLinks({ items }: { items: NavItem[] }) {
  const current = activeHref(usePathname(), items);
  return (
    <ul className="flex items-center gap-1">
      {items.map((item) => {
        const active = item.href === current;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex h-10 items-center whitespace-nowrap rounded-full px-4 text-[0.875rem] font-semibold no-underline transition-colors ${
                active ? "bg-ink text-white" : "text-muted hover:bg-surface-soft hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
