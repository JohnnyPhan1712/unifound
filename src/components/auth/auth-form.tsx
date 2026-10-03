"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, register } from "@/lib/auth/actions";
import type { AuthMode } from "@/lib/auth/auth-url";
import { idle } from "@/lib/action-state";
import { Input } from "@/components/ui/field";
import { ActionMessage } from "@/components/ui/notice";
import { SubmitButton } from "@/components/ui/submit-button";
import { PasswordField } from "./password-field";

type Props = { mode: "login" | "register"; next: string; domains: string[]; hrefFor: (mode: AuthMode) => string };

export function AuthForm({ mode, next, domains, hrefFor }: Props) {
  const [state, action] = useActionState(mode === "login" ? login : register, idle);
  const errors = state.fieldErrors ?? {};
  const domainHint = "Dùng email do trường cấp (các trường thuộc ĐHQG-HCM khu vực Thủ Đức).";

  return (
    <form action={action} className="grid gap-5" noValidate>
      <ActionMessage state={state} />
      <input type="hidden" name="next" value={next} />
      {mode === "register" && (
        <Input label="Họ và tên" name="fullName" autoComplete="name" maxLength={120} defaultValue={state.values?.fullName} error={errors.fullName} required />
      )}
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
      {mode === "login" && (
        <Link href={hrefFor("forgot")} replace scroll={false} className="-mt-2 justify-self-start text-[0.875rem] font-semibold text-ink">
          Quên mật khẩu?
        </Link>
      )}
      <SubmitButton className="btn btn-primary btn-block" pendingText={mode === "login" ? "Đang đăng nhập…" : "Đang tạo tài khoản…"}>
        {mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
      </SubmitButton>
      <p className="text-center text-[0.875rem] text-muted">
        {mode === "login" ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
        <Link href={hrefFor(mode === "login" ? "register" : "login")} replace scroll={false} className="font-semibold text-ink">
          {mode === "login" ? "Đăng ký" : "Đăng nhập"}
        </Link>
      </p>
    </form>
  );
}
