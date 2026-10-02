import Link from "next/link";
import { Suspense } from "react";
import { Bell } from "lucide-react";
import { allowedDomains } from "@/lib/auth/email";
import { getCurrentUser, isAdmin } from "@/lib/auth/session";
import { getUnreadCount } from "@/lib/notifications";
import { AuthModal } from "./auth-modal";
import { HammerMenu } from "./hammer-menu";
import { Logo } from "./logo";
import { PostButton } from "./post-button";
import { TypeTabs } from "./type-tabs";
import { UserAvatarButton } from "./user-avatar-button";

export async function SiteHeader() {
  const user = await getCurrentUser();
  const unread = user ? await getUnreadCount(user.id) : 0;
  const name = user?.fullName || user?.email.split("@")[0] || "";
  const bellLabel = unread ? `Thông báo, ${unread} chưa đọc` : "Thông báo";

  return (
    <>
    <header className="border-b border-line-soft bg-canvas">
      <div className="container-page grid h-20 grid-cols-[1fr_auto_1fr] items-center gap-6 max-[900px]:grid-cols-[auto_1fr_auto] max-[744px]:h-16 max-[744px]:grid-cols-[1fr_auto]">
        <div className="flex">
          <Logo textClass="max-[380px]:hidden" />
        </div>

        <div className="max-[744px]:hidden">
          <Suspense fallback={<div className="h-20" />}>
            <TypeTabs />
          </Suspense>
        </div>

        <div className="flex items-center justify-end gap-2 max-[380px]:gap-1.5">
          <PostButton signedIn={Boolean(user)} />
          {user && (
            <Link href="/notifications" className="icon-btn relative" aria-label={bellLabel} title={bellLabel}>
              <Bell className="size-5" aria-hidden />
              {unread > 0 && (
                <span className="tabular absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-[0.75rem] font-bold leading-5 text-white" aria-hidden>
                  {unread > 99 ? "99+" : unread}
                </span>
              )}
            </Link>
          )}
          <UserAvatarButton user={user ? { initial: (name[0] ?? "U").toUpperCase(), name } : null} />
          <HammerMenu signedIn={Boolean(user)} isAdmin={isAdmin(user)} unread={unread} />
        </div>
      </div>
    </header>
    {!user && (
      <Suspense>
        <AuthModal domains={allowedDomains()} />
      </Suspense>
    )}
    </>
  );
}
