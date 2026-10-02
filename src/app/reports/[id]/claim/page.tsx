import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, reports } from "@/db";
import { TypeBadge } from "@/components/ui/badges";
import { Notice } from "@/components/ui/notice";
import { ClaimForm } from "@/components/claims/claim-form";
import { requireUser } from "@/lib/auth/session";
import { submitClaim } from "@/lib/claims/actions";
import { getMyClaimForReport } from "@/lib/claims/query";
import { claimSubmitError } from "@/lib/claims/rules";

export const metadata: Metadata = { title: "Gửi yêu cầu nhận đồ" };

export default async function ClaimPage({ params }: PageProps<"/reports/[id]/claim">) {
  const { id } = await params;
  const user = await requireUser();
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  // Chỉ lấy câu hỏi, không lấy đáp án
  const [report] = await db
    .select({ id: reports.id, userId: reports.userId, type: reports.type, status: reports.status, expiresAt: reports.expiresAt, title: reports.title, verifyQuestion: reports.verifyQuestion })
    .from(reports)
    .where(eq(reports.id, id));
  if (!report || report.status === "HIDDEN") notFound();

  const existing = await getMyClaimForReport(id, user.id);
  const error = claimSubmitError(report, user.id, Boolean(existing));

  return (
    <div className="mx-auto w-full max-w-[760px] pb-8 pt-10">
      <h1 className="mb-1">Gửi yêu cầu nhận đồ</h1>
      <div className="mb-6 flex flex-wrap items-center gap-2 text-muted">
        <TypeBadge type={report.type} />
        <Link href={`/reports/${id}`} className="font-semibold text-ink">
          {report.title}
        </Link>
      </div>
      {error ? (
        <div className="flex flex-col gap-3">
          <Notice tone={existing ? "info" : "warn"}>{error}</Notice>
          {existing ? (
            <Link href={`/claims/${existing.id}`} className="btn btn-primary self-start">
              Xem yêu cầu của bạn
            </Link>
          ) : (
            <Link href={`/reports/${id}`} className="btn btn-secondary self-start">
              Về tin đăng
            </Link>
          )}
        </div>
      ) : (
        <div className="panel sm:p-8">
          <ClaimForm action={submitClaim.bind(null, id)} question={report.verifyQuestion ?? "Mô tả đặc điểm riêng của món đồ."} userId={user.id} />
        </div>
      )}
    </div>
  );
}
