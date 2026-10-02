"use client";

import { useState } from "react";
import { CircleAlert, Eye, EyeOff } from "lucide-react";

export function PasswordField({ label, name, autoComplete, error, hint }: { label: string; name: string; autoComplete: string; error?: string[]; hint?: string }) {
  const [shown, setShown] = useState(false);
  const id = `f-${name}`;
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-[0.875rem] font-semibold">
        {label}
        <span className="text-danger" aria-hidden>
          {" "}
          *
        </span>
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={shown ? "text" : "password"}
          autoComplete={autoComplete}
          required
          className="control pr-14"
          aria-invalid={error?.length ? true : undefined}
          aria-describedby={error?.length ? `${id}-error` : hint ? `${id}-hint` : undefined}
        />
        <button
          type="button"
          onClick={() => setShown((s) => !s)}
          aria-label={shown ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          aria-pressed={shown}
          className="absolute right-2 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-surface-soft hover:text-ink"
        >
          {shown ? <EyeOff className="size-5" aria-hidden /> : <Eye className="size-5" aria-hidden />}
        </button>
      </div>
      {hint && !error?.length && (
        <p id={`${id}-hint`} className="text-[0.8125rem] text-muted">
          {hint}
        </p>
      )}
      {error?.length ? (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-[0.8125rem] font-medium text-danger">
          <CircleAlert className="size-4 shrink-0" aria-hidden />
          {error[0]}
        </p>
      ) : null}
    </div>
  );
}
