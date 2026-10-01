"use client";

import { useActionState } from "react";
import { Check, X } from "lucide-react";
import { decideClaim } from "@/lib/claims/actions";
import { ActionMessage } from "@/components/ui/notice";

export function DecisionButtons({ id }: { id: string }) {
  const [state, action, pending] = useActionState(decideClaim, {});
  return (
    <form
      action={action}
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        const accept = (e.nativeEvent as SubmitEvent).submitter?.getAttribute("value") === "ACCEPTED";
        if (accept && !confirm("Chấp nhận yêu cầu này? Các yêu cầu khác của tin sẽ tự đóng.")) e.preventDefault();
      }}
    >
      <ActionMessage state={state} />
      <input type="hidden" name="id" value={id} />
      <div className="flex flex-wrap gap-2">
        <button type="submit" name="decision" value="ACCEPTED" className="btn btn-primary" disabled={pending}>
          <Check className="size-4" aria-hidden />
          Chấp nhận
        </button>
        <button type="submit" name="decision" value="REJECTED" className="btn btn-secondary" disabled={pending}>
          <X className="size-4" aria-hidden />
          Từ chối
        </button>
      </div>
    </form>
  );
}
