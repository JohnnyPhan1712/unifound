import type { Metadata } from "next";
import { Bell, CheckCheck } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { SubmitButton } from "@/components/ui/submit-button";
import { requireUser } from "@/lib/auth/session";
import { timeAgo } from "@/lib/labels";
import { listNotifications } from "@/lib/notifications";
import { markAllRead, markRead } from "@/lib/notifications/actions";

export const metadata: Metadata = { title: "Thông báo" };

export default async function NotificationsPage() {
  const user = await requireUser();
  const items = await listNotifications(user.id);
  const unread = items.filter((n) => !n.isRead).length;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 pb-8 pt-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1>Thông báo</h1>
          <p className="mt-1 text-muted">{unread ? `${unread} thông báo chưa đọc` : "Bạn đã đọc hết thông báo."}</p>
        </div>
        {unread > 0 && (
          <form action={markAllRead}>
            <SubmitButton className="btn btn-secondary" pendingText="Đang cập nhật…">
              <CheckCheck className="size-4" aria-hidden />
              Đánh dấu tất cả đã đọc
            </SubmitButton>
          </form>
        )}
      </div>

      {items.length ? (
        <ul className="flex flex-col gap-2">
          {items.map((n) => (
            <li
              key={n.id}
              className={`flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center ${
                n.isRead ? "border-line bg-surface" : "border-primary/30 bg-primary-soft/40"
              }`}
            >
              <div className="flex min-w-0 flex-1 gap-3">
                <span
                  className={`mt-1.5 size-2.5 shrink-0 rounded-full ${n.isRead ? "bg-transparent" : "bg-primary"}`}
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className={n.isRead ? "text-muted" : "font-semibold text-ink"}>
                    {!n.isRead && <span className="sr-only">Chưa đọc: </span>}
                    {n.message}
                  </p>
                  <p className="text-[0.8125rem] text-muted">{timeAgo(n.createdAt)}</p>
                </div>
              </div>
              <form action={markRead} className="flex shrink-0 gap-2 pl-5 sm:pl-0">
                <input type="hidden" name="id" value={n.id} />
                {n.link && (
                  <button type="submit" name="go" value="1" className="btn btn-secondary btn-sm">
                    Xem
                  </button>
                )}
                {!n.isRead && (
                  <button type="submit" className="btn btn-ghost btn-sm">
                    Đã đọc
                  </button>
                )}
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState icon={Bell} title="Chưa có thông báo">
          Bạn sẽ nhận thông báo khi có gợi ý phù hợp, yêu cầu nhận đồ, kết quả duyệt hoặc lịch hẹn.
        </EmptyState>
      )}
    </div>
  );
}
