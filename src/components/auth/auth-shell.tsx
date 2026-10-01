import Link from "next/link";
import { X } from "lucide-react";

/** Thẻ đăng nhập/đăng ký theo mockup: nền xám nhạt, thẻ có thanh tiêu đề và nút đóng; điện thoại thì tràn màn hình. */
export function AuthShell({ title, heading, lede, children }: { title: string; heading: string; lede: string; children: React.ReactNode }) {
  return (
    <div className="-mx-[var(--gutter)] bg-surface-soft px-4 pb-16 pt-12 max-[744px]:bg-canvas max-[744px]:px-0 max-[744px]:pt-0">
      <div className="mx-auto w-full max-w-[568px] overflow-hidden rounded-md bg-canvas shadow-panel max-[744px]:max-w-none max-[744px]:rounded-none max-[744px]:shadow-none">
        <div className="grid h-16 grid-cols-[40px_1fr_40px] items-center border-b border-line px-4">
          <Link href="/" className="icon-btn flat" aria-label="Đóng, về bảng tin">
            <X className="size-4" aria-hidden />
          </Link>
          <p className="text-center text-[1rem] font-bold">{title}</p>
          <span />
        </div>
        <div className="grid gap-5 p-6">
          <h1 className="text-[1.375rem] font-semibold">{heading}</h1>
          <p className="-mt-3 text-[0.875rem] text-muted">{lede}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
