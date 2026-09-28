import type { Metadata } from "next";
import Link from "next/link";
import { parseReportFilters, todayInVietnam } from "../report-validation";
import { CreateReportForm } from "./create-report-form";
import { getSignedInUserId } from "./current-user";

export const metadata: Metadata = {
  title: "Đăng tin · UniFound",
};

export default async function NewReportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [userId, { type: presetType }] = await Promise.all([
    getSignedInUserId(),
    searchParams.then(parseReportFilters),
  ]);

  return (
    <div className="mx-auto grid w-full max-w-[850px] grid-cols-1 gap-5">
      <header className="grid gap-1.5">
        <span className="eyebrow">Đăng tin mới</span>
        <h1>Cho mọi người biết bạn đang cần gì</h1>
        <p className="text-muted">
          Chỉ mất khoảng một phút. Các trường có dấu <span className="text-danger">*</span> là bắt
          buộc.
        </p>
      </header>

      {userId ? (
        <CreateReportForm maxEventDate={todayInVietnam()} defaultType={presetType ?? "lost"} />
      ) : (
        <section role="status" className="empty-state">
          <span aria-hidden="true" className="text-[2.5rem]">
            🔒
          </span>
          <h2 className="text-[1.35rem]">Bạn cần đăng nhập để đăng tin</h2>
          <p className="text-muted">
            Bạn vẫn có thể xem và tìm kiếm các tin công khai mà không cần đăng nhập.
          </p>
          <Link href="/" className="btn btn-secondary">
            Xem danh sách tin
          </Link>
        </section>
      )}
    </div>
  );
}
