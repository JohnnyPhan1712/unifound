"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { CircleAlert, Eye, EyeOff } from "lucide-react";
import { login, register } from "@/lib/auth/actions";
import { idle } from "@/lib/action-state";
import { Input } from "@/components/ui/field";
import { ActionMessage } from "@/components/ui/notice";
import { SubmitButton } from "@/components/ui/submit-button";

function PasswordField({ label, name, autoComplete, error, hint }: { label: string; name: string; autoComplete: string; error?: string[]; hint?: string }) {
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

export function AuthForm({ mode, next, domains }: { mode: "login" | "register"; next?: string; domains: string[] }) {
  const [state, action] = useActionState(mode === "login" ? login : register, idle);
  const errors = state.fieldErrors ?? {};
  const domainHint = `Dùng email trường: ${domains.map((d) => "@" + d).join(" hoặc ")}`;

  return (
    <form action={action} className="grid gap-5" noValidate>
      <ActionMessage state={state} />
      {next && <input type="hidden" name="next" value={next} />}
      <Input
        label="Email sinh viên"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        placeholder={`mssv@${domains[0] ?? "gm.uit.edu.vn"}`}
        defaultValue={state.values?.email}
        error={errors.email}
        hint={domainHint}
        required
      />
      <PasswordField label="Mật khẩu" name="password" autoComplete={mode === "login" ? "current-password" : "new-password"} error={errors.password} hint={mode === "register" ? "Tối thiểu 8 ký tự." : undefined} />
      {mode === "register" && <PasswordField label="Nhập lại mật khẩu" name="confirmPassword" autoComplete="new-password" error={errors.confirmPassword} />}
      <SubmitButton className="btn btn-primary btn-block" pendingText={mode === "login" ? "Đang đăng nhập…" : "Đang tạo tài khoản…"}>
        {mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
      </SubmitButton>
      <p className="text-center text-[0.875rem] text-muted">
        {mode === "login" ? (
          <>
            Chưa có tài khoản?{" "}
            <Link href="/register" className="font-semibold text-ink">
              Đăng ký
            </Link>
          </>
        ) : (
          <>
            Đã có tài khoản?{" "}
            <Link href="/login" className="font-semibold text-ink">
              Đăng nhập
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
