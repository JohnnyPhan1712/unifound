"use client";

import { useActionState } from "react";
import { X } from "lucide-react";
import { dismissMatch } from "@/lib/matching/actions";
import { ActionMessage } from "@/components/ui/notice";
import { SubmitButton } from "@/components/ui/submit-button";

export function DismissButton({ id }: { id: string }) {
  const [state, action] = useActionState(dismissMatch, {});
  if (state.ok) return <ActionMessage state={state} />;
  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={id} />
      <SubmitButton className="btn btn-text" pendingText="Đang bỏ…">
        <X className="size-4" aria-hidden />
        Không phải
      </SubmitButton>
      <ActionMessage state={state} />
    </form>
  );
}
