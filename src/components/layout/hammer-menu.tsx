"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Bell, CircleHelp, LayoutList, LogIn, LogOut, Menu, Plus, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { logout } from "@/lib/auth/actions";
import { useAuthHref } from "./auth-modal";
import { menuItem, PopoverMenu } from "./popover-menu";

type Props = { signedIn: boolean; isAdmin: boolean; unread: number };

/** Nút menu ngoài cùng bên phải header: mục tài khoản (đã đăng nhập) hoặc Đăng nhập/Đăng ký (khách), và Trợ giúp. */
export function HammerMenu({ signedIn, isAdmin, unread }: Props) {
  const authHref = useAuthHref();
  const pathname = usePathname();
  const params = useSearchParams();
  const helpQs = new URLSearchParams(params);
  helpQs.set("help", "1");

  return (
    <PopoverMenu label="Mở menu" triggerClass="icon-btn size-[42px]" trigger={<Menu className="size-5" aria-hidden />}>
      {signedIn ? (
        <>
          <Link role="menuitem" href="/my" className={`${menuItem} font-semibold`}>
            <LayoutList className="size-5" aria-hidden />
            Tin và yêu cầu của tôi
          </Link>
          <Link role="menuitem" href="/matches" className={menuItem}>
            <Sparkles className="size-5" aria-hidden />
            Gợi ý trùng khớp
          </Link>
          <Link role="menuitem" href="/notifications" className={menuItem}>
            <Bell className="size-5" aria-hidden />
            Thông báo
            {unread > 0 && <span className="tabular ml-auto rounded-full bg-primary px-2 text-[0.75rem] font-bold leading-5 text-white">{unread > 99 ? "99+" : unread}</span>}
          </Link>
          <hr className="my-2 border-line-soft" />
          <Link role="menuitem" href="/reports/new" className={menuItem}>
            <Plus className="size-5" aria-hidden />
            Đăng tin mới
          </Link>
          {isAdmin && (
            <Link role="menuitem" href="/admin" className={menuItem}>
              <ShieldCheck className="size-5" aria-hidden />
              Quản trị
            </Link>
          )}
        </>
      ) : (
        <>
          <Link role="menuitem" href={authHref("login")} scroll={false} className={`${menuItem} font-semibold`}>
            <LogIn className="size-5" aria-hidden />
            Đăng nhập
          </Link>
          <Link role="menuitem" href={authHref("register")} scroll={false} className={menuItem}>
            <UserRound className="size-5" aria-hidden />
            Đăng ký
          </Link>
        </>
      )}
      <Link role="menuitem" href={`${pathname}?${helpQs}`} scroll={false} className={menuItem}>
        <CircleHelp className="size-5" aria-hidden />
        Trợ giúp
      </Link>
      {signedIn && (
        <>
          <hr className="my-2 border-line-soft" />
          <form action={logout}>
            <button role="menuitem" type="submit" className={menuItem}>
              <LogOut className="size-5" aria-hidden />
              Đăng xuất
            </button>
          </form>
        </>
      )}
    </PopoverMenu>
  );
}
