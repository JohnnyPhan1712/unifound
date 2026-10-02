import Link from "next/link";

/** Logo theo mockup CHG-012 (logo_mark.svg): chữ U trong khiên xanh. */
export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect width="40" height="40" rx="11" fill="#2d5bd7" />
      <path d="M12.5 11.5v9a7.5 7.5 0 0 0 15 0v-9" fill="none" stroke="#fff" strokeWidth="4.6" strokeLinecap="round" />
      <circle cx="20" cy="17.2" r="3.1" fill="#fff" />
    </svg>
  );
}

/** `textClass` cho phép ẩn chữ ở chỗ hẹp (header điện thoại nhỏ) mà vẫn giữ biểu tượng. */
export function Logo({ textClass = "" }: { textClass?: string }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2 text-primary no-underline" aria-label="UniFound — về bảng tin">
      <LogoMark />
      <span className={`text-[1.375rem] font-bold leading-none tracking-[-0.02em] ${textClass}`}>UniFound</span>
    </Link>
  );
}
