"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

type Props = { title: string; onClose: () => void; children: ReactNode; widthClass?: string; brand?: boolean };

/** Hộp thoại dùng <dialog> gốc: tự có focus trap, Esc và lớp nền; điện thoại thì tràn màn hình. */
export function Modal({ title, onClose, children, widthClass = "max-w-[568px]", brand }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!ref.current?.open) ref.current?.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className={`m-auto max-h-[90dvh] w-full overflow-y-auto rounded-md bg-canvas p-0 text-ink shadow-panel backdrop:bg-black/50 max-[744px]:m-0 max-[744px]:h-dvh max-[744px]:max-h-none max-[744px]:max-w-none max-[744px]:rounded-none ${widthClass}`}
    >
      <div className={`sticky top-0 z-10 grid h-16 grid-cols-[40px_1fr_40px] items-center border-b px-4 ${brand ? "border-primary bg-primary text-white" : "border-line bg-canvas"}`}>
        <button type="button" onClick={onClose} className={`icon-btn flat ${brand ? "bg-white/20 text-white hover:bg-white/30" : ""}`} aria-label="Đóng">
          <X className="size-4" aria-hidden />
        </button>
        <p className="text-center text-[1rem] font-bold">{title}</p>
        <span />
      </div>
      {children}
    </dialog>
  );
}
