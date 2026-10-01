import Link from "next/link";
import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <EmptyState
      icon={SearchX}
      title="Không tìm thấy trang"
      action={
        <Link href="/" className="btn btn-primary">
          Về bảng tin
        </Link>
      }
    >
      Tin có thể đã bị xóa, ẩn hoặc bạn không có quyền xem.
    </EmptyState>
  );
}
