"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useAuthHref } from "./auth-modal";

/** Nút "Đăng tin": khách thì mở popup đăng nhập và sau đó vào thẳng form đăng tin. */
export function PostButton({ signedIn }: { signedIn: boolean }) {
  const authHref = useAuthHref();
  const href = signedIn ? "/reports/new" : authHref("login", "/reports/new");
  const scroll = signedIn ? undefined : false;
  return (
    <>
      <Link href={href} scroll={scroll} className="inline-flex h-[42px] items-center gap-2 rounded-full px-3.5 text-[0.875rem] font-semibold no-underline hover:bg-surface-soft max-[744px]:hidden">
        <Plus className="size-5" aria-hidden />
        Đăng tin
      </Link>
      <Link href={href} scroll={scroll} className="icon-btn hidden max-[744px]:inline-grid" aria-label="Đăng tin">
        <Plus className="size-5" aria-hidden />
      </Link>
    </>
  );
}
