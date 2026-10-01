import { LoaderCircle } from "lucide-react";

/** Trạng thái tải dùng trong loading.tsx của các route. */
export function PageLoading({ label = "Đang tải…" }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-2 py-24 text-muted">
      <LoaderCircle className="size-5 animate-spin" aria-hidden />
      <span>{label}</span>
    </div>
  );
}
