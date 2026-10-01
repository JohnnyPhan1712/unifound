import Link from "next/link";
import { ShieldX } from "lucide-react";
import { EmptyState } from "./empty-state";

export function Forbidden({ children = "Bạn không có quyền xem hoặc thao tác trên nội dung này." }: { children?: React.ReactNode }) {
  return (
    <EmptyState
      icon={ShieldX}
      title="Không có quyền truy cập (403)"
      action={
        <Link href="/" className="btn btn-secondary">
          Về bảng tin
        </Link>
      }
    >
      {children}
    </EmptyState>
  );
}
