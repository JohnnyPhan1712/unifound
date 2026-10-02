"use client";

import { useActionState } from "react";
import { updatePassword } from "@/lib/auth/actions";
import { idle } from "@/lib/action-state";
import { ActionMessage } from "@/components/ui/notice";
import { SubmitButton } from "@/components/ui/submit-button";
import { PasswordField } from "./auth-form";

export function ResetForm() {
  const [state, action] = useActionState(updatePassword, idle);
  const errors = state.fieldErrors ?? {};
  return (
    <form action={action} className="grid gap-5" noValidate>
      <ActionMessage state={state} />
      <PasswordField label="Mật khẩu mới" name="password" autoComplete="new-password" error={errors.password} hint="Tối thiểu 8 ký tự." />
      <PasswordField label="Nhập lại mật khẩu mới" name="confirmPassword" autoComplete="new-password" error={errors.confirmPassword} />
      <SubmitButton className="btn btn-primary btn-block" pendingText="Đang lưu…">
        Đổi mật khẩu
      </SubmitButton>
    </form>
  );
}
