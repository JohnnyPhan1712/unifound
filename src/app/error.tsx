"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function RootError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section role="alert" className="empty-state mx-auto max-w-xl">
      <span aria-hidden="true" className="text-[2.5rem]">
        ⚠
      </span>
      <h1 className="text-[1.35rem]">Không tải được dữ liệu</h1>
      <p className="text-muted">
        Đã có lỗi khi tải tin. Vui lòng thử lại sau ít phút.
        {error.digest && <span className="block text-xs">Mã lỗi: {error.digest}</span>}
      </p>
      <div className="flex flex-wrap justify-center gap-2.5">
        <button type="button" onClick={() => retry()} className="btn btn-primary">
          Thử lại
        </button>
        <Link href="/" className="btn btn-secondary">
          Về trang chủ
        </Link>
      </div>
    </section>
  );
}
