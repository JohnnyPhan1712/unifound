"use client";

import { useActionState, type ReactNode } from "react";
import type { ActionState } from "@/lib/action-state";
import { ActionMessage } from "@/components/ui/notice";
import { SubmitButton } from "@/components/ui/submit-button";

/** Nút thao tác quản trị một bước (ẩn tin, bỏ qua, khóa…): hidden field + xác nhận + thông báo kết quả. */
export function AdminActionForm({
  action,
  fields,
  children,
  className = "btn btn-secondary btn-sm",
  confirmText,
}: {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  fields: Record<string, string>;
  children: ReactNode;
  className?: string;
  confirmText?: string;
}) {
  const [state, formAction] = useActionState(action, {});
  return (
    <form action={formAction} className="flex flex-col gap-2" onSubmit={(e) => confirmText && !confirm(confirmText) && e.preventDefault()}>
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <SubmitButton className={className} pendingText="Đang xử lý…">
        {children}
      </SubmitButton>
      <ActionMessage state={state} />
    </form>
  );
}
