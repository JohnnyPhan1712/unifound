"use client";

import { RotateCcw } from "lucide-react";
import { Notice } from "@/components/ui/notice";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 py-16">
      <Notice tone="error">Đã có lỗi khi tải trang. Dữ liệu của bạn không bị mất; hãy thử lại.</Notice>
      <button type="button" onClick={reset} className="btn btn-secondary self-start">
        <RotateCcw className="size-4" aria-hidden />
        Thử lại
      </button>
    </div>
  );
}
