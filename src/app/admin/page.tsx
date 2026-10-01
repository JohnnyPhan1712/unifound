import type { Metadata } from "next";
import { getAdmin } from "@/lib/admin/guard";
import { getStats, STATS_WEEKS } from "@/lib/admin/stats";

export const metadata: Metadata = { title: "Tổng quan quản trị" };

const shortWeek = (week: string) => {
  const [, m, d] = week.split("-");
  return `${d}/${m}`;
};

export default async function AdminOverviewPage() {
  if (!(await getAdmin())) return null; // layout đã hiện 403
  const s = await getStats();
  const maxWeek = Math.max(1, ...s.weekly.map((w) => w.n));
  const maxCat = Math.max(1, ...s.topCategories.map((c) => c.n));
  const peak = s.weekly.reduce((a, b) => (b.n > a.n ? b : a), s.weekly[0]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1>Tổng quan</h1>
        <p className="mt-1 text-muted">Số liệu tính trên mọi tin trừ tin bị ẩn.</p>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Tile label="Tổng số tin" value={s.total} note={`${s.lost} mất đồ · ${s.found} nhặt được`} />
        <Tile label="Tỉ lệ đã trả" value={`${s.returnedRate}%`} note={`${s.returned}/${s.found} tin nhặt được đã về đúng chủ`} />
        <Tile label="Tin tuần này" value={s.weekly.at(-1)?.n ?? 0} note={`Tuần bắt đầu ${shortWeek(s.weekly.at(-1)!.week)}`} />
        <Tile label="Danh mục nhiều nhất" value={s.topCategories[0]?.name ?? "—"} note={s.topCategories[0] ? `${s.topCategories[0].n} tin` : "Chưa có dữ liệu"} />
      </dl>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="panel flex flex-col gap-4" aria-labelledby="weekly">
          <div>
            <h2 id="weekly" className="text-[1.05rem]">
              Số tin mới theo tuần
            </h2>
            <p className="text-[0.8125rem] text-muted">{STATS_WEEKS} tuần gần nhất, tuần tính từ thứ Hai</p>
          </div>
          {/* Cột dày tối đa 24px, bo 4px ở đầu dữ liệu, mọi cột chung một đường đáy */}
          <div className="relative h-48 border-b border-line" role="img" aria-label={`Biểu đồ số tin theo tuần, cao nhất ${peak.n} tin tuần ${shortWeek(peak.week)}`}>
            <div className="absolute inset-x-0 top-0 border-t border-line" aria-hidden />
            <span className="tabular absolute -top-2.5 right-0 bg-surface pl-1 text-[0.75rem] text-muted" aria-hidden>
              {maxWeek}
            </span>
            <ol className="absolute inset-0 flex items-end justify-around gap-1">
              {s.weekly.map((w) => (
                <li key={w.week} className="group relative flex h-full flex-1 items-end justify-center" title={`Tuần ${shortWeek(w.week)}: ${w.n} tin`}>
                  <span
                    className="block w-full max-w-6 rounded-t bg-primary transition-colors group-hover:bg-primary-hover"
                    style={{ height: `${(w.n / maxWeek) * 100}%`, minHeight: w.n ? 2 : 0 }}
                  />
                  <span className="tabular pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[0.75rem] font-semibold text-white group-hover:block">
                    {w.n} tin
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <ol className="-mt-2 flex justify-around gap-1 text-[0.75rem] text-muted" aria-hidden>
            {s.weekly.map((w) => (
              <li key={w.week} className="tabular flex-1 text-center">
                {shortWeek(w.week)}
              </li>
            ))}
          </ol>
          <details className="text-[0.85rem]">
            <summary className="cursor-pointer font-semibold text-muted">Xem dạng bảng</summary>
            <table className="mt-2 w-full text-left">
              <thead className="text-muted">
                <tr>
                  <th className="py-1 font-semibold">Tuần bắt đầu</th>
                  <th className="py-1 text-right font-semibold">Số tin</th>
                </tr>
              </thead>
              <tbody>
                {s.weekly.map((w) => (
                  <tr key={w.week} className="border-t border-line">
                    <td className="py-1">{shortWeek(w.week)}</td>
                    <td className="tabular py-1 text-right">{w.n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </section>

        <section className="panel flex flex-col gap-4" aria-labelledby="top-cats">
          <div>
            <h2 id="top-cats" className="text-[1.05rem]">
              Danh mục phổ biến
            </h2>
            <p className="text-[0.8125rem] text-muted">Top 5 theo số tin</p>
          </div>
          {s.topCategories.length ? (
            <ol className="flex flex-col gap-3">
              {s.topCategories.map((c) => (
                <li key={c.name} className="flex flex-col gap-1">
                  <div className="flex justify-between gap-2 text-[0.88rem]">
                    <span className="truncate">{c.name}</span>
                    <span className="tabular font-semibold">{c.n}</span>
                  </div>
                  <span className="block h-2 rounded-r bg-surface-soft" aria-hidden>
                    <span className="block h-2 rounded-r bg-primary" style={{ width: `${(c.n / maxCat) * 100}%` }} />
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-muted">Chưa có tin nào.</p>
          )}
        </section>
      </div>
    </div>
  );
}

function Tile({ label, value, note }: { label: string; value: string | number; note: string }) {
  return (
    <div className="panel flex flex-col gap-1 p-4">
      <dt className="text-[0.8125rem] font-semibold text-muted">{label}</dt>
      <dd className="tabular truncate text-[clamp(1.35rem,3vw,1.75rem)] font-bold leading-tight">{value}</dd>
      <dd className="text-[0.8125rem] text-muted">{note}</dd>
    </div>
  );
}
