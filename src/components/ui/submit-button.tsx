"use client";

import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";
import type { ButtonHTMLAttributes, ReactNode } from "react";

/** Nút submit tự khóa và hiện vòng xoay khi form đang gửi. */
export function SubmitButton({
  children,
  pendingText,
  className = "btn btn-primary",
  ...rest
}: { children: ReactNode; pendingText?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" {...rest} className={className} disabled={pending || rest.disabled} aria-busy={pending}>
      {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
      {pending ? (pendingText ?? "Đang xử lý…") : children}
    </button>
  );
}
