import type { Metadata } from "next";
import Link from "next/link";
import { CircleCheck, Clock, Inbox, Link2, Send } from "lucide-react";
import type { ClaimStatus, ReportType } from "@/db/schema";
import { EmptyState } from "@/components/ui/empty-state";
import { Notice } from "@/components/ui/notice";
import { ClaimBadge, StatusBadge, TypeBadge } from "@/components/ui/badges";
import { ManageActions } from "@/components/reports/manage-actions";
import { ReportVisual } from "@/components/reports/report-card";
import { requireUser } from "@/lib/auth/session";
import { listReceivedClaims, listSentClaims } from "@/lib/claims/query";
import { effectiveClaimStatus } from "@/lib/claims/rules";
import { formatDate, timeAgo } from "@/lib/labels";
import { isExpired } from "@/lib/reports/expiry";
import { getMyReports } from "@/lib/reports/query";

export const metadata: Metadata = { title: "Tin và yêu cầu của tôi" };

const TABS = [
  { key: "reports", label: "Tin của tôi", short: "Tin của tôi" },
  { key: "sent", label: "Yêu cầu đã gửi", short: "Đã gửi" },
  { key: "received", label: "Yêu cầu nhận được", short: "Nhận được" },
] as const;

type MyReport = Awaited<ReturnType<typeof getMyReports>>[number];

/** Bước tiến độ 1–4 và dòng "bước tiếp theo" của một tin. */
function progress(r: MyReport, expired: boolean) {
  const found = r.type === "FOUND";
  if (r.status === "RETURNED") return { step: 4, label: "Hoàn tất", next: "Tin đã hoàn tất. Đồ đã về đúng chủ.", tone: "good" as const, icon: CircleCheck };
  if (r.status === "CLOSED" || r.status === "HIDDEN" || expired) {
    return { step: 1, label: r.status === "HIDDEN" ? "Đã ẩn" : "Đã đóng", next: r.status === "HIDDEN" ? "Tin đã bị quản trị viên ẩn khỏi bảng tin." : expired ? "Tin đã hết hạn 60 ngày và không còn hiện trên bảng tin." : "Tin đã đóng, không còn hiện trên bảng tin.", tone: "plain" as const, icon: Clock };
  }
  if (found && r.status === "IN_PROGRESS") return { step: 3, label: "Đã chấp nhận", next: "Đã chấp nhận một yêu cầu. Đặt điểm hẹn và xác nhận sau khi trao đồ.", tone: "attn" as const, icon: Clock };
  if (found && r.pendingClaims > 0) return { step: 2, label: "Có yêu cầu", next: `${r.pendingClaims} yêu cầu đang chờ bạn đối chiếu.`, tone: "attn" as const, icon: Clock };
  if (!found && r.suggestions > 0) return { step: 2, label: "Có gợi ý", next: `${r.suggestions} tin nhặt được có thể liên quan.`, tone: "good" as const, icon: Link2 };
  return { step: 1, label: "Đang mở", next: found ? "Chưa có yêu cầu nào. Tin đang hiển thị trên bảng tin." : "Chưa có gợi ý nào. Hệ thống sẽ báo khi có tin phù hợp.", tone: "plain" as const, icon: Inbox };
}

export default async function MyPage({ searchParams }: PageProps<"/my">) {
  const user = await requireUser();
  const { deleted, tab: rawTab } = await searchParams;
  const tab = TABS.find((t) => t.key === rawTab)?.key ?? "reports";
  const [items, sent, received] = await Promise.all([getMyReports(user.id), listSentClaims(user.id), listReceivedClaims(user.id)]);
  const pendingReceived = received.filter((c) => effectiveClaimStatus(c) === "PENDING").length;
  const counts = { reports: items.length, sent: sent.length, received: received.length };

  return (
    <div className="pb-16">
      <div className="pb-2 pt-8">
        <h1>Tin và yêu cầu của tôi</h1>
        <p className="mt-2 text-muted">Theo dõi trạng thái và làm bước tiếp theo cho từng tin.</p>
      </div>

      {deleted && (
        <div className="mt-4">
          <Notice tone="success">Đã xóa tin và ảnh của tin.</Notice>
        </div>
      )}

      <nav className="seg-tabs mb-2 mt-6 max-w-full overflow-x-auto" aria-label="Mục trong Tin và yêu cầu của tôi">
        {TABS.map((t) => (
          <Link key={t.key} href={`/my?tab=${t.key}`} aria-current={tab === t.key ? "page" : undefined}>
            <span className="sm:hidden">{t.short}</span>
            <span className="hidden sm:inline">{t.label}</span>
            <span className="count tabular">{counts[t.key]}</span>
            {t.key === "received" && pendingReceived > 0 && <span className="sr-only">, {pendingReceived} chờ duyệt</span>}
          </Link>
        ))}
      </nav>

      {tab === "sent" && (
        <ClaimList
          items={sent}
          empty={<EmptyState icon={Send} title="Bạn chưa gửi yêu cầu nào">Mở một tin Nhặt được và gửi yêu cầu kèm câu trả lời xác minh.</EmptyState>}
        />
      )}
      {tab === "received" && (
        <ClaimList
          items={received}
          empty={<EmptyState icon={Inbox} title="Chưa có ai gửi yêu cầu">Khi có người nhận đồ trong tin Nhặt được của bạn, yêu cầu sẽ hiện ở đây.</EmptyState>}
        />
      )}

      {tab === "reports" &&
        (items.length ? (
          <ul>
            {items.map((r) => {
              const expired = isExpired(r.expiresAt);
              const p = progress(r, expired);
              const Icon = p.icon;
              return (
                <li key={r.id} className="grid grid-cols-[96px_minmax(0,1fr)_auto] items-center gap-5 border-b border-line py-5 max-[744px]:grid-cols-[64px_minmax(0,1fr)] max-[744px]:items-start max-[744px]:gap-4">
                  <ReportVisual type={r.type} path={r.cover} category={r.categoryName} dim={r.status === "RETURNED"} className="aspect-square w-full rounded-sm" iconClassName="size-9 max-[744px]:size-6" />
                  <div className="grid min-w-0 gap-1.5">
                    <div className="flex flex-wrap gap-2">
                      <TypeBadge type={r.type} />
                      <StatusBadge status={r.status} expired={expired} />
                    </div>
                    <h3 className="text-[1rem]">
                      <Link href={`/reports/${r.id}`} className="text-ink no-underline hover:underline">
                        {r.title}
                      </Link>
                    </h3>
                    <p className="text-[0.875rem] text-muted">
                      {r.locationName} · {r.type === "LOST" ? "Ngày mất" : "Ngày nhặt"} <span className="tabular">{formatDate(r.eventTime)}</span>
                    </p>
                    <div className="mt-0.5 flex items-center gap-1" aria-label={`Tiến độ ${p.step} trên 4: ${p.label}`}>
                      {[1, 2, 3, 4].map((n) => (
                        <i key={n} className={`block h-1 w-7 rounded-sm ${n <= p.step ? "bg-ink" : "bg-line"}`} />
                      ))}
                      <span className="ml-1.5 text-[0.75rem] text-muted">{p.label}</span>
                    </div>
                    <p className={`flex items-start gap-2 text-[0.875rem] ${p.tone === "attn" ? "text-warn" : "text-body"}`}>
                      <Icon className={`mt-px size-[18px] shrink-0 ${p.tone === "attn" ? "text-pending" : p.tone === "good" ? "text-found" : "text-muted"}`} aria-hidden />
                      {p.next}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-2 max-[744px]:col-span-full max-[744px]:justify-start">
                    {r.type === "FOUND" && (r.pendingClaims > 0 || r.status === "IN_PROGRESS") && (
                      <Link href={`/reports/${r.id}#claims`} className="btn btn-primary btn-sm">
                        {r.status === "IN_PROGRESS" ? "Mở bàn giao" : "Xem yêu cầu"}
                      </Link>
                    )}
                    {r.type === "LOST" && r.suggestions > 0 && (
                      <Link href={`/matches?report=${r.id}`} className="btn btn-secondary btn-sm">
                        Xem gợi ý
                      </Link>
                    )}
                    <ManageActions id={r.id} status={r.status} />
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState
            icon={Inbox}
            title="Bạn chưa đăng tin nào"
            action={
              <Link href="/reports/new" className="btn btn-primary">
                Đăng tin đầu tiên
              </Link>
            }
          >
            Mất đồ hay nhặt được đồ của ai đó? Đăng tin để hệ thống tìm tin đối ứng giúp bạn.
          </EmptyState>
        ))}
    </div>
  );
}

type ClaimRow = {
  id: string;
  status: ClaimStatus;
  createdAt: Date;
  reportTitle: string;
  reportType: ReportType;
  cover: string | null;
  claimantName?: string | null;
};

function ClaimList({ items, empty }: { items: ClaimRow[]; empty: React.ReactNode }) {
  if (!items.length) return empty;
  return (
    <ul>
      {items.map((c) => (
        <li key={c.id} className="grid grid-cols-[96px_minmax(0,1fr)_auto] items-center gap-5 border-b border-line py-5 max-[744px]:grid-cols-[64px_minmax(0,1fr)] max-[744px]:items-start max-[744px]:gap-4">
          <ReportVisual type={c.reportType} path={c.cover} className="aspect-square w-full rounded-sm" iconClassName="size-9 max-[744px]:size-6" />
          <div className="grid min-w-0 gap-1.5">
            <div className="flex flex-wrap gap-2">
              <ClaimBadge status={effectiveClaimStatus(c)} />
            </div>
            <h3 className="truncate text-[1rem]">{c.reportTitle}</h3>
            <p className="text-[0.875rem] text-muted">
              {c.claimantName !== undefined ? `Từ ${c.claimantName ?? "người dùng"} · ` : ""}
              {timeAgo(c.createdAt)}
            </p>
          </div>
          <div className="max-[744px]:col-span-full">
            <Link href={`/claims/${c.id}`} className="btn btn-secondary btn-sm">
              Xem
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
