import Link from "next/link";
import { Suspense } from "react";
import { Bell, Plus } from "lucide-react";
import { getCurrentUser, isAdmin } from "@/lib/auth/session";
import { getUnreadCount } from "@/lib/notifications";
import { AccountMenu } from "./account-menu";
import { Logo } from "./logo";
import { TypeTabs } from "./type-tabs";

export async function SiteHeader() {
  const user = await getCurrentUser();
  const unread = user ? await getUnreadCount(user.id) : 0;
  const name = user?.fullName || user?.email.split("@")[0] || "";
  const bellLabel = unread ? `Thông báo, ${unread} chưa đọc` : "Thông báo";

  return (
    <header className="border-b border-line-soft bg-canvas">
      <div className="container-page grid h-20 grid-cols-[1fr_auto_1fr] items-center gap-6 max-[900px]:grid-cols-[auto_1fr_auto] max-[744px]:h-16 max-[744px]:grid-cols-[1fr_auto]">
        <div className="flex">
          <Logo />
        </div>

        <div className="max-[744px]:hidden">
          <Suspense fallback={<div className="h-20" />}>
            <TypeTabs />
          </Suspense>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Link href="/reports/new" className="inline-flex h-[42px] items-center gap-2 rounded-full px-3.5 text-[0.875rem] font-semibold no-underline hover:bg-surface-soft max-[744px]:hidden">
            <Plus className="size-5" aria-hidden />
            Đăng tin
          </Link>
          <Link href="/reports/new" className="icon-btn hidden max-[744px]:inline-grid" aria-label="Đăng tin">
            <Plus className="size-5" aria-hidden />
          </Link>
          {user ? (
            <Link href="/notifications" className="icon-btn relative" aria-label={bellLabel} title={bellLabel}>
              <Bell className="size-5" aria-hidden />
              {unread > 0 && (
                <span className="tabular absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-[0.75rem] font-bold leading-5 text-white" aria-hidden>
                  {unread > 99 ? "99+" : unread}
                </span>
              )}
            </Link>
          ) : (
            <Link href="/login" className="inline-flex h-[42px] items-center rounded-full px-3.5 text-[0.875rem] font-semibold no-underline hover:bg-surface-soft max-[744px]:hidden">
              Đăng nhập
            </Link>
          )}
          <AccountMenu unread={unread} user={user ? { initial: (name[0] ?? "U").toUpperCase(), name, isAdmin: isAdmin(user) } : null} />
        </div>
      </div>
    </header>
  );
}
