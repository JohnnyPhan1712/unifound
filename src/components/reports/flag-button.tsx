"use client";

import { useActionState } from "react";
import { Flag } from "lucide-react";
import type { ActionState } from "@/lib/action-state";
import { Textarea } from "@/components/ui/field";
import { ActionMessage } from "@/components/ui/notice";
import { SubmitButton } from "@/components/ui/submit-button";

/** Báo cáo vi phạm: mở bằng <details> để không chiếm chỗ trên trang chi tiết. */
export function FlagButton({ action }: { action: (prev: ActionState, fd: FormData) => Promise<ActionState> }) {
  const [state, formAction] = useActionState(action, {});
  if (state.ok) return <ActionMessage state={state} />;
  return (
    <details className="group rounded-lg border border-line bg-surface open:p-4">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-4 font-semibold text-muted group-open:px-0 group-open:pb-3 [&::-webkit-details-marker]:hidden">
        <Flag className="size-4" aria-hidden />
        Báo cáo vi phạm
      </summary>
      <form action={formAction} className="flex flex-col gap-3" noValidate>
        <ActionMessage state={state} />
        <Textarea
          label="Lý do"
          name="reason"
          placeholder="Ví dụ: tin rao bán, nội dung sai sự thật, spam…"
          defaultValue={state.values?.reason}
          error={state.fieldErrors?.reason}
          maxLength={500}
          required
        />
        <div>
          <SubmitButton className="btn btn-secondary" pendingText="Đang gửi…">
            Gửi báo cáo
          </SubmitButton>
        </div>
      </form>
    </details>
  );
}
