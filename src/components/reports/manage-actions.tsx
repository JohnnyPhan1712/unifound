"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Archive, Pencil, Trash2 } from "lucide-react";
import type { ReportStatus } from "@/db/schema";
import { statusAllows } from "@/lib/auth/permissions";
import { closeReport, deleteReport } from "@/lib/reports/update";
import { ActionMessage } from "@/components/ui/notice";
import { SubmitButton } from "@/components/ui/submit-button";

/** Sửa / Đóng / Xóa dạng nút chữ gạch chân (như mockup). Ẩn/hiện chỉ để tiện; server mới là nơi quyết định quyền. */
export function ManageActions({ id, status }: { id: string; status: ReportStatus }) {
  const [closeState, closeAction] = useActionState(closeReport, {});
  const [deleteState, deleteAction] = useActionState(deleteReport, {});

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1">
        {statusAllows("edit", status) && (
          <Link href={`/reports/${id}/edit`} className="btn btn-text">
            <Pencil className="size-4" aria-hidden />
            Sửa
          </Link>
        )}
        {statusAllows("close", status) && (
          <form action={closeAction} onSubmit={(e) => !confirm("Đóng tin này? Tin sẽ không còn hiện trên bảng tin.") && e.preventDefault()}>
            <input type="hidden" name="id" value={id} />
            <SubmitButton className="btn btn-text" pendingText="Đang đóng…">
              <Archive className="size-4" aria-hidden />
              Đóng tin
            </SubmitButton>
          </form>
        )}
        {statusAllows("delete", status) && (
          <form action={deleteAction} onSubmit={(e) => !confirm("Xóa vĩnh viễn tin này và ảnh của nó?") && e.preventDefault()}>
            <input type="hidden" name="id" value={id} />
            <SubmitButton className="btn btn-text danger" pendingText="Đang xóa…">
              <Trash2 className="size-4" aria-hidden />
              Xóa
            </SubmitButton>
          </form>
        )}
      </div>
      <ActionMessage state={closeState.message ? closeState : deleteState} />
    </div>
  );
}
