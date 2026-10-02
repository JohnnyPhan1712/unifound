"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, CircleHelp, MapPin } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { HELP_ARTICLES, HELP_GROUPS, RECEPTION_POINTS } from "@/lib/help-content";

const subscribe = (cb: () => void) => {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
};
const useAtTop = () => useSyncExternalStore(subscribe, () => window.scrollY <= 40, () => true);

function HelpModal({ onClose }: { onClose: () => void }) {
  const [articleId, setArticleId] = useState<string | null>(null);
  const article = HELP_ARTICLES.find((a) => a.id === articleId);

  return (
    <Modal title="Trung tâm trợ giúp UniFound" onClose={onClose} widthClass="max-w-[720px]" brand>
      <div className="grid gap-6 p-6">
        {article ? (
          <article className="grid gap-4">
            <button type="button" onClick={() => setArticleId(null)} className="inline-flex items-center gap-1 justify-self-start text-[0.875rem] font-semibold text-muted hover:text-ink">
              <ChevronLeft className="size-4" aria-hidden />
              Tất cả bài viết
            </button>
            <h2>{article.title}</h2>
            <p className="text-[0.9375rem] text-body">{article.intro}</p>
            <ol className="grid list-decimal gap-3 pl-5 text-[0.9375rem] text-body marker:font-semibold marker:text-ink">
              {article.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </article>
        ) : (
          <>
            <p className="text-[1rem] font-semibold">Chúng tôi có thể giúp gì cho bạn?</p>
            <div className="grid gap-6 min-[744px]:grid-cols-2">
              {(Object.keys(HELP_GROUPS) as (keyof typeof HELP_GROUPS)[]).map((g) => {
                const items = HELP_ARTICLES.filter((a) => a.group === g);
                return (
                  <section key={g} className="grid content-start gap-3 rounded-md border border-line p-4">
                    <h3>{HELP_GROUPS[g].title}</h3>
                    <p className="text-[0.8125rem] text-muted">
                      {HELP_GROUPS[g].lede} ({items.length} bài viết)
                    </p>
                    <ul className="grid">
                      {items.map((a) => (
                        <li key={a.id}>
                          <button type="button" onClick={() => setArticleId(a.id)} className="flex w-full items-center justify-between gap-3 rounded-sm px-2 py-2.5 text-left text-[0.875rem] hover:bg-surface-soft">
                            {a.title}
                            <ChevronRight className="size-4 shrink-0 text-muted" aria-hidden />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
            <section className="grid gap-3">
              <h3>Điểm tiếp nhận đồ trực tiếp</h3>
              <p className="text-[0.8125rem] text-muted">UniFound chưa có đường dây nóng. Hãy đến trực tiếp các điểm sau để gửi hoặc nhận đồ.</p>
              <ul className="grid gap-2 min-[744px]:grid-cols-2">
                {RECEPTION_POINTS.map((p) => (
                  <li key={p.name} className="flex items-start gap-3 rounded-md bg-surface-soft p-3 text-[0.875rem]">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    <span>
                      <span className="block font-semibold">{p.name}</span>
                      <span className="text-muted">{p.note}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
    </Modal>
  );
}

/** Nút Trợ giúp nổi ở góc màn hình (ẩn khi cuộn xuống) và modal trợ giúp mở bằng `?help=1`. */
export function HelpWidget() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const atTop = useAtTop();

  const open = new URLSearchParams(params);
  open.set("help", "1");
  const closed = new URLSearchParams(params);
  closed.delete("help");
  const closedQs = closed.toString();

  return (
    <>
      <Link
        href={`${pathname}?${open}`}
        scroll={false}
        tabIndex={atTop ? undefined : -1}
        aria-hidden={atTop ? undefined : true}
        className={`fixed bottom-6 right-6 z-30 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-5 text-[0.875rem] font-semibold text-white no-underline shadow-panel transition-all duration-200 hover:bg-primary-hover max-[744px]:bottom-20 ${
          atTop ? "" : "pointer-events-none invisible translate-y-4 opacity-0"
        }`}
      >
        <CircleHelp className="size-5" aria-hidden />
        Trợ giúp
      </Link>
      {params.get("help") === "1" && <HelpModal onClose={() => router.replace(closedQs ? `${pathname}?${closedQs}` : pathname, { scroll: false })} />}
    </>
  );
}
