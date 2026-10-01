import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, reports } from "@/db";
import { Forbidden } from "@/components/ui/forbidden";
import { Notice } from "@/components/ui/notice";
import { ReportForm } from "@/components/reports/report-form";
import { canManageReport, statusAllows, STATUS_BLOCK_MESSAGE } from "@/lib/auth/permissions";
import { requireUser } from "@/lib/auth/session";
import { getCatalogOptions } from "@/lib/reports/catalog";
import { toLocalDateTime } from "@/lib/reports/schemas";
import { updateReport } from "@/lib/reports/update";

export const metadata: Metadata = { title: "Sửa tin" };

export default async function EditReportPage({ params }: PageProps<"/reports/[id]/edit">) {
  const { id } = await params;
  const user = await requireUser();
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const [report] = await db.select().from(reports).where(eq(reports.id, id));
  if (!report) notFound();
  // Kiểm tra quyền trước khi đưa đáp án xác minh vào form
  if (!canManageReport(user, report)) return <Forbidden>Chỉ chủ tin hoặc quản trị viên được sửa tin này.</Forbidden>;
  if (!statusAllows("edit", report.status)) {
    return (
      <div className="mx-auto max-w-[760px] pt-10">
        <Notice tone="warn">{STATUS_BLOCK_MESSAGE.edit}</Notice>
      </div>
    );
  }

  const { categories, locations } = await getCatalogOptions();
  return (
    <div>
      <div className="mx-auto max-w-[760px]">
        <h1 className="mb-2 mt-10 max-[744px]:mt-6">Sửa tin</h1>
        <p className="mb-8 text-muted">Ảnh và loại tin giữ nguyên. Muốn đổi ảnh, hãy xóa tin và đăng lại.</p>
      </div>
      <div>
        <ReportForm
          action={updateReport.bind(null, id)}
          categories={categories}
          locations={locations}
          maxDateTime={toLocalDateTime(new Date())}
          lockType
          initial={{
            type: report.type,
            title: report.title,
            categoryId: report.categoryId,
            locationId: report.locationId,
            eventTime: toLocalDateTime(report.eventTime),
            description: report.description,
            keepingPlace: report.keepingPlace ?? "",
            verifyQuestion: report.verifyQuestion ?? "",
            verifyAnswer: report.verifyAnswer ?? "",
          }}
          submitLabel="Lưu thay đổi"
          cancelHref={`/reports/${id}`}
        />
      </div>
    </div>
  );
}
