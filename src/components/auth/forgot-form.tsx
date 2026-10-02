"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset } from "@/lib/auth/actions";
import { idle } from "@/lib/action-state";
import { Input } from "@/components/ui/field";
import { ActionMessage } from "@/components/ui/notice";
import { SubmitButton } from "@/components/ui/submit-button";

export function ForgotForm({ domains, loginHref }: { domains: string[]; loginHref: string }) {
  const [state, action] = useActionState(requestPasswordReset, idle);
  return (
    <form action={action} className="grid gap-5" noValidate>
      <ActionMessage state={state} />
      <Input
        label="Email sinh viên"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        placeholder={`mssv@${domains[0] ?? "gm.uit.edu.vn"}`}
        defaultValue={state.values?.email}
        error={state.fieldErrors?.email}
        hint="Dùng email do trường cấp (các trường thuộc ĐHQG-HCM khu vực Thủ Đức)."
        required
      />
      <SubmitButton className="btn btn-primary btn-block" pendingText="Đang gửi…">
        Gửi hướng dẫn đặt lại mật khẩu
      </SubmitButton>
      <p className="text-center text-[0.875rem] text-muted">
        <Link href={loginHref} replace scroll={false} className="font-semibold text-ink">
          Quay lại đăng nhập
        </Link>
      </p>
    </form>
  );
}
