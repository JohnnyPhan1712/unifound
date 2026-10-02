import type { Metadata } from "next";
import Link from "next/link";
import { Check, ShieldCheck, Sparkles } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { TypeBadge } from "@/components/ui/badges";
import { DismissButton } from "@/components/matching/dismiss-button";
import { ReportVisual } from "@/components/reports/report-card";
import { requireUser } from "@/lib/auth/session";
import { formatDate } from "@/lib/labels";
import { getMyMatches, type MyMatch } from "@/lib/matching/query";
import { MATCH_THRESHOLD, MATCH_WINDOW_DAYS, POINTS } from "@/lib/matching/score";

export const metadata: Metadata = { title: "Gợi ý trùng khớp" };

const MAX_SCORE = POINTS.location + POINTS.within1Day + POINTS.keywordMax;

export default async function MatchesPage({ searchParams }: PageProps<"/matches">) {
  const user = await requireUser();
  const { report: rawReport } = await searchParams;
  const all = await getMyMatches(user.id);

  // Danh sách "tin của bạn" có gợi ý, để lọc theo từng tin
  const mine = [...new Map(all.map((m) => [m.mine.id, m.mine])).values()];
  const report = typeof rawReport === "string" && mine.some((r) => r.id === rawReport) ? rawReport : undefined;
  const items = report ? all.filter((m) => m.mine.id === report) : all;

  return (
    <div className="pb-16">
      <div className="pb-2 pt-8">
        <h1>Gợi ý trùng khớp</h1>
        <p className="mt-2 max-w-[70ch] text-muted">
          Các tin có thể liên quan tới tin của bạn, xếp theo điểm từ cao xuống thấp. Đây là gợi ý để kiểm tra, không phải xác nhận quyền sở hữu.
        </p>
      </div>

      {mine.length > 1 && (
        <div className="flex flex-wrap items-center gap-4 border-b border-line py-6">
          <span className="text-[0.875rem] text-muted">Tin của bạn</span>
          <div className="flex flex-wrap gap-2">
            <Pick href="/matches" on={!report}>
              Tất cả
            </Pick>
            {mine.map((r) => (
              <Pick key={r.id} href={`/matches?report=${r.id}`} on={report === r.id}>
                <TypeBadge type={r.type} />
                <span className="max-w-48 truncate">{r.title}</span>
              </Pick>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-[minmax(0,1fr)_320px] items-start gap-16 pt-8 max-[1128px]:grid-cols-1 max-[1128px]:gap-8">
        {items.length ? (
          <ul className="grid gap-4">
            {items.map((m) => (
              <MatchRow key={m.id} m={m} />
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={Sparkles}
            title="Chưa có gợi ý nào"
            action={
              <Link href="/my" className="btn btn-secondary">
                Xem tin của tôi
              </Link>
            }
          >
            Khi có tin đối ứng đạt từ {MATCH_THRESHOLD} điểm, gợi ý sẽ hiện ở đây và bạn nhận được thông báo.
          </EmptyState>
        )}

        <aside className="sticky top-16 grid gap-4 max-[1128px]:static max-[1128px]:order-first">
          <div className="flex items-start gap-3 rounded-md bg-primary-soft px-4 py-3.5 text-[0.875rem] text-info">
            <ShieldCheck className="mt-px size-5 shrink-0 text-primary-hover" aria-hidden />
            <p>
              <strong>Điểm không phải bằng chứng sở hữu.</strong> Chủ tin Nhặt được vẫn đối chiếu thông tin xác minh trước khi trao đồ.
            </p>
          </div>
          <div className="grid gap-3 max-[1128px]:hidden">
            <h2 className="text-[1.125rem]">Cách tính điểm</h2>
            <table className="w-full text-[0.875rem]">
              <tbody>
                {[
                  ["Cùng địa điểm", `+${POINTS.location}`],
                  ["Cùng trường (khác địa điểm)", `+${POINTS.school}`],
                  ["Thời gian cách ≤ 1 ngày / ≤ 3 ngày", `+${POINTS.within1Day} / +${POINTS.within3Days}`],
                  ["Từ khóa trùng (mỗi từ +5)", `tối đa +${POINTS.keywordMax}`],
                  ["Điểm cao nhất thực tế", String(MAX_SCORE)],
                ].map(([k, v], i, arr) => (
                  <tr key={k} className={i < arr.length - 1 ? "border-b border-line-soft" : "font-bold"}>
                    <td className="py-2.5">{k}</td>
                    <td className="tabular py-2.5 text-right font-semibold">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[0.8125rem] text-muted">
              Chỉ hiện cặp đạt từ {MATCH_THRESHOLD} điểm, cùng danh mục, đăng trong {MATCH_WINDOW_DAYS} ngày. Thông tin xác minh riêng tư không dùng để tính điểm.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Pick({ href, on, children }: { href: string; on: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={on ? "true" : undefined}
      className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-line bg-canvas px-4 text-[0.875rem] font-medium no-underline hover:border-ink aria-[current=true]:border-ink aria-[current=true]:bg-surface-soft aria-[current=true]:shadow-[inset_0_0_0_1px_var(--color-ink)]"
    >
      {children}
    </Link>
  );
}

/** Lý do dạng "Cùng địa điểm: X (+40)" → phần chữ và điểm cộng. */
function splitReason(reason: string) {
  const m = reason.match(/^(.*?)\s*\(\+(\d+)\)\s*$/);
  return m ? { text: m[1], pts: Number(m[2]) } : { text: reason, pts: null };
}

function MatchRow({ m }: { m: MyMatch }) {
  return (
    <li className="grid grid-cols-[120px_minmax(0,1fr)_248px] gap-6 rounded-md border border-line bg-canvas p-5 transition-shadow hover:shadow-panel max-[1280px]:grid-cols-[112px_minmax(0,1fr)] max-[744px]:grid-cols-[72px_minmax(0,1fr)] max-[744px]:gap-4 max-[744px]:p-4">
      <ReportVisual type={m.other.type} path={m.other.cover} category={m.other.categoryName} className="aspect-square w-full" iconClassName="size-11 max-[744px]:size-8" />

      <div className="grid content-start gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <TypeBadge type={m.other.type} />
          <span className="text-[0.8125rem] text-muted">cho tin “{m.mine.title}”</span>
        </div>
        <h3 className="text-[1.0625rem]">
          <Link href={`/reports/${m.other.id}`} className="text-ink no-underline hover:underline">
            {m.other.title}
          </Link>
        </h3>
        <p className="text-[0.875rem] text-muted">
          {m.other.locationName} · {m.other.categoryName} · <span className="tabular">{formatDate(m.other.eventTime)}</span>
        </p>
        {m.other.description && <p className="line-clamp-2 text-[0.875rem] text-body">{m.other.description}</p>}
        <div className="mt-2 flex flex-wrap items-start gap-2">
          <Link href={`/reports/${m.other.id}`} className="btn btn-secondary btn-sm">
            Xem chi tiết
          </Link>
          <DismissButton id={m.id} />
        </div>
      </div>

      <div className="grid content-start gap-3 border-l border-line pl-6 max-[1280px]:col-span-full max-[1280px]:border-l-0 max-[1280px]:border-t max-[1280px]:border-line-soft max-[1280px]:pl-0 max-[1280px]:pt-4">
        <div className="flex items-baseline gap-1">
          <b className="tabular text-[3.5rem] font-bold leading-none tracking-[-0.04em] max-[744px]:text-[2.75rem]">{m.score}</b>
          <span className="text-[0.9375rem] font-medium text-muted">/100</span>
        </div>
        <p className="-mt-1 text-[0.75rem] font-semibold text-muted">Điểm gợi ý · không phải xác nhận sở hữu</p>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-strong" role="presentation">
          <i className="block h-full rounded-full bg-ink" style={{ width: `${Math.min(m.score, 100)}%` }} />
        </div>
        <ul className="grid gap-1.5 text-[0.8125rem]">
          {m.reasons.map((reason) => {
            const r = splitReason(reason);
            return (
              <li key={reason} className="grid grid-cols-[16px_1fr_auto] items-center gap-2">
                <Check className="size-4 text-found" aria-hidden />
                <span>{r.text}</span>
                {r.pts !== null && <span className="tabular font-semibold">+{r.pts}</span>}
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}
