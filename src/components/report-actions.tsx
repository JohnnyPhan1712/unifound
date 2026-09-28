"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { canUserManageReport } from "@/lib/auth/ownership";
import { deleteReportAction } from "@/lib/auth/actions";

interface ReportActionsProps {
  report: {
    id: string;
    userId: string;
  };
  currentUser: {
    id: string;
    role?: string | null;
  } | null;
}

/**
 * Component ReportActions (CHG-008 - Conditional Ownership UI)
 * Nút Sửa / Xóa chỉ hiển thị khi:
 * 1. currentUser.id === report.userId (Người dùng là chủ sở hữu)
 * 2. currentUser.role === 'ADMIN' (Người dùng là Quản trị viên)
 *
 * Lưu ý: Việc ẩn nút ở đây chỉ là trải nghiệm giao diện (UX).
 * Backend vẫn enforce quyền hạn độc lập qua assertUserOwnsReport.
 */
export function ReportActions({ report, currentUser }: ReportActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const canManage = canUserManageReport(report, currentUser);

  if (!canManage) {
    return null;
  }

  const handleDelete = () => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài đăng này không?")) {
      return;
    }

    startTransition(async () => {
      const res = await deleteReportAction(report.id);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || "Không thể xóa bài đăng.");
      }
    });
  };

  const handleEdit = () => {
    router.push(`/reports/${report.id}/edit`);
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <button
        type="button"
        onClick={handleEdit}
        className="btn btn-secondary btn-small"
        disabled={isPending}
      >
        Sửa bài
      </button>
      <button
        type="button"
        onClick={handleDelete}
        className="btn btn-secondary btn-small text-danger"
        disabled={isPending}
      >
        {isPending ? "Đang xóa..." : "Xóa bài"}
      </button>
    </div>
  );
}
