"use client";

import { useActionState, useState } from "react";
import { Lock, Send } from "lucide-react";
import type { ActionState } from "@/lib/action-state";
import { ImagePicker } from "@/components/reports/image-picker";
import { Textarea } from "@/components/ui/field";
import { ActionMessage } from "@/components/ui/notice";
import { SubmitButton } from "@/components/ui/submit-button";
import { CLAIM_IMAGE_BUCKET, MAX_CLAIM_IMAGES } from "@/lib/reports/schemas";

/** Form gửi yêu cầu nhận lại (S05): hiện câu hỏi xác minh, ô trả lời, ô mô tả thêm, ảnh minh chứng (không bắt buộc). */
export function ClaimForm({ action, question, userId }: { action: (prev: ActionState, fd: FormData) => Promise<ActionState>; question: string; userId: string }) {
  const [state, formAction] = useActionState(action, {});
  const [uploading, setUploading] = useState(false);
  const e = state.fieldErrors ?? {};
  return (
    <form action={formAction} className="grid gap-4" noValidate>
      <ActionMessage state={state} />
      <div className="verify-box">
        <p className="mb-1 text-[0.75rem] font-semibold text-muted">Câu hỏi xác minh của người nhặt</p>
        <p className="font-semibold text-ink">{question}</p>
      </div>
      <Textarea
        label="Câu trả lời của bạn"
        name="answerText"
        defaultValue={state.values?.answerText}
        error={e.answerText}
        hint={
          <span className="inline-flex items-center gap-1.5">
            <Lock className="size-3.5" aria-hidden />
            Chỉ người nhặt đồ thấy. Không hiện trên bảng tin hay gợi ý.
          </span>
        }
        maxLength={500}
        required
      />
      <Textarea
        label="Mô tả thêm (không bắt buộc)"
        name="note"
        defaultValue={state.values?.note}
        error={e.note}
        placeholder="Đặc điểm khác giúp người nhặt nhận ra đồ của bạn…"
        maxLength={1000}
      />
      <ImagePicker
        userId={userId}
        bucket={CLAIM_IMAGE_BUCKET}
        max={MAX_CLAIM_IMAGES}
        label="Ảnh minh chứng (không bắt buộc)"
        required={false}
        hint=" Chỉ người nhặt đồ thấy."
        error={e.images}
        onBusyChange={setUploading}
      />
      <SubmitButton className="btn btn-primary btn-block" disabled={uploading} pendingText="Đang gửi…">
        <Send className="size-5" aria-hidden />
        {uploading ? "Đang tải ảnh lên…" : "Gửi yêu cầu"}
      </SubmitButton>
      <p className="text-[0.875rem] text-muted">Gửi yêu cầu không phải xác nhận quyền sở hữu. Người nhặt sẽ đối chiếu rồi chấp nhận hoặc từ chối.</p>
    </form>
  );
}
