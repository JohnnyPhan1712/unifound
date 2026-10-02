"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export const menuItem = "flex w-full items-center gap-3 px-4 py-3 text-left text-[0.875rem] text-ink no-underline hover:bg-surface-soft";

/**
 * Nút + menu thả xuống: đóng khi bấm một mục, bấm ra ngoài hoặc nhấn Esc.
 * Menu luôn nằm trong DOM (chỉ ẩn) để form Đăng xuất vẫn gửi được sau khi menu đóng.
 */
export function PopoverMenu({ label, triggerClass, trigger, children }: { label: string; triggerClass: string; trigger: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)} aria-haspopup="menu" aria-expanded={open} aria-label={label} className={triggerClass}>
        {trigger}
      </button>
      <div role="menu" hidden={!open} onClick={() => setOpen(false)} className="absolute right-0 top-[calc(100%+8px)] z-40 w-60 rounded-md border border-line-soft bg-canvas py-2 shadow-panel">
        {children}
      </div>
    </div>
  );
}
