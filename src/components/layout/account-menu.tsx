"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bell, LayoutList, LogIn, LogOut, Menu, Plus, ShieldCheck, Sparkles, User, UserRound } from "lucide-react";
import { logout } from "@/lib/auth/actions";

type Props = { user: { initial: string; name: string; isAdmin: boolean } | null; unread: number };

/** Menu tài khoản dạng popover: đóng khi chọn mục, bấm ra ngoài hoặc nhấn Esc. */
export function AccountMenu({ user, unread }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const item = "flex w-full items-center gap-3 px-4 py-3 text-left text-[0.875rem] text-ink no-underline hover:bg-surface-soft";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={user ? `Menu tài khoản của ${user.name}` : "Mở menu tài khoản"}
        className="inline-flex h-[42px] items-center gap-2.5 rounded-full border border-line bg-canvas py-0 pl-3 pr-1.5 transition-shadow hover:shadow-panel"
      >
        <Menu className="size-5" aria-hidden />
        <span className={`grid size-[30px] place-items-center rounded-full text-[0.75rem] font-semibold text-white ${user ? "bg-ink" : "bg-muted"}`}>
          {user ? user.initial : <User className="size-4" aria-hidden />}
        </span>
        {unread > 0 && <span className="sr-only">{unread} thông báo chưa đọc</span>}
      </button>

      {open && (
        <div role="menu" className="absolute right-0 top-[calc(100%+8px)] z-40 w-60 rounded-md bg-canvas py-2 shadow-panel">
          {user ? (
            <>
              <Link role="menuitem" href="/my" className={`${item} font-semibold`}>
                <LayoutList className="size-5" aria-hidden />
                Tin và yêu cầu của tôi
              </Link>
              <Link role="menuitem" href="/matches" className={item}>
                <Sparkles className="size-5" aria-hidden />
                Gợi ý trùng khớp
              </Link>
              <Link role="menuitem" href="/notifications" className={item}>
                <Bell className="size-5" aria-hidden />
                Thông báo
                {unread > 0 && <span className="tabular ml-auto rounded-full bg-primary px-2 text-[0.75rem] font-bold leading-5 text-white">{unread > 99 ? "99+" : unread}</span>}
              </Link>
              <hr className="my-2 border-line-soft" />
              <Link role="menuitem" href="/reports/new" className={item}>
                <Plus className="size-5" aria-hidden />
                Đăng tin mới
              </Link>
              <Link role="menuitem" href="/profile" className={item}>
                <UserRound className="size-5" aria-hidden />
                Hồ sơ
              </Link>
              {user.isAdmin && (
                <Link role="menuitem" href="/admin" className={item}>
                  <ShieldCheck className="size-5" aria-hidden />
                  Quản trị
                </Link>
              )}
              <hr className="my-2 border-line-soft" />
              <form action={logout}>
                <button role="menuitem" type="submit" className={item}>
                  <LogOut className="size-5" aria-hidden />
                  Đăng xuất
                </button>
              </form>
            </>
          ) : (
            <>
              <Link role="menuitem" href="/login" className={`${item} font-semibold`}>
                <LogIn className="size-5" aria-hidden />
                Đăng nhập
              </Link>
              <Link role="menuitem" href="/register" className={item}>
                <UserRound className="size-5" aria-hidden />
                Tạo tài khoản
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
