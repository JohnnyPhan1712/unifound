import type { Metadata } from "next";
import { ReportForm } from "@/components/reports/report-form";
import { requireUser } from "@/lib/auth/session";
import { createReport } from "@/lib/reports/actions";
import { getCatalogOptions } from "@/lib/reports/catalog";
import { toLocalDateTime } from "@/lib/reports/schemas";

export const metadata: Metadata = { title: "Đăng tin" };

export default async function NewReportPage({ searchParams }: PageProps<"/reports/new">) {
  const user = await requireUser();
  const { type } = await searchParams;
  const { categories, locations } = await getCatalogOptions();

  return (
    <div>
      <div className="mx-auto max-w-[760px]">
        <h1 className="mb-2 mt-10 max-[744px]:mt-6">Đăng tin mới</h1>
        <p className="mb-8 text-muted">Mất 1 phút. Tin hiện ngay trên bảng tin, tự hết hạn sau 60 ngày; hệ thống tự tìm tin đối ứng để gợi ý cho bạn.</p>
      </div>
      <div>
        <ReportForm
          action={createReport}
          categories={categories}
          locations={locations}
          maxDateTime={toLocalDateTime(new Date())}
          initial={{ type: type === "FOUND" ? "FOUND" : "LOST", eventTime: toLocalDateTime(new Date()) }}
          uploadFor={user.id}
          submitLabel="Đăng tin"
        />
      </div>
    </div>
  );
}
