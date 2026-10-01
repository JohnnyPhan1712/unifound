import type { Metadata } from "next";
import Link from "next/link";
import { EyeOff, ShieldCheck, UserX, X } from "lucide-react";
import { AdminActionForm } from "@/components/admin/action-form";
import { StatusBadge, TypeBadge } from "@/components/ui/badges";
import { EmptyState } from "@/components/ui/empty-state";
import { dismissFlags, hideReport, setUserStatus } from "@/lib/admin/actions";
import { getAdmin } from "@/lib/admin/guard";
import { getFlagQueue } from "@/lib/admin/queries";
import { timeAgo } from "@/lib/labels";

export const metadata: Metadata = { title: "Kiểm duyệt" };

export default async function ModerationPage() {
  if (!(await getAdmin())) return null; // layout đã hiện 403
  const queue = await getFlagQueue();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1>Kiểm duyệt</h1>
        <p className="mt-1 text-muted">
          Tin lên bảng ngay khi đăng; báo cáo vi phạm của người dùng được xử lý ở đây. {queue.length ? `${queue.length} tin đang chờ xem xét.` : ""}
        </p>
      </div>

      {queue.length ? (
        <ul className="flex flex-col gap-4">
          {queue.map(({ report: r, flags }) => (
            <li key={r.reportId} className="panel flex flex-col gap-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col items-start gap-1.5">
                  <div className="flex gap-1.5">
                    <TypeBadge type={r.reportType} />
                    <StatusBadge status={r.reportStatus} />
                  </div>
                  <Link href={`/reports/${r.reportId}`} className="max-w-full truncate text-[1.05rem] font-bold text-ink">
                    {r.reportTitle}
                  </Link>
                  <span className="text-[0.8125rem] text-muted">
                    Chủ tin: {r.ownerEmail}
                    {r.ownerStatus === "locked" && " · đã khóa"}
                  </span>
                </div>
                <span className="badge bg-danger-soft text-danger">{flags.length} báo cáo</span>
              </div>

              <ul className="flex flex-col gap-2">
                {flags.map((f) => (
                  <li key={f.flagId} className="rounded-md bg-surface-soft px-3 py-2">
                    <p>{f.reason}</p>
                    <p className="text-[0.8125rem] text-muted">
                      {f.reporterEmail} · {timeAgo(f.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-start gap-2 border-t border-line pt-4">
                <AdminActionForm action={hideReport} fields={{ reportId: r.reportId }} className="btn btn-danger btn-sm" confirmText="Ẩn tin này khỏi bảng tin?">
                  <EyeOff className="size-4" aria-hidden />
                  Ẩn tin
                </AdminActionForm>
                <AdminActionForm action={dismissFlags} fields={{ reportId: r.reportId }}>
                  <X className="size-4" aria-hidden />
                  Bỏ qua
                </AdminActionForm>
                {r.ownerRole !== "ADMIN" && r.ownerStatus === "active" && (
                  <AdminActionForm
                    action={setUserStatus}
                    fields={{ userId: r.ownerId, status: "locked" }}
                    className="btn btn-ghost btn-sm"
                    confirmText={`Khóa tài khoản ${r.ownerEmail}?`}
                  >
                    <UserX className="size-4" aria-hidden />
                    Khóa chủ tin
                  </AdminActionForm>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState icon={ShieldCheck} title="Không có báo cáo nào chờ xử lý">
          Khi người dùng báo cáo tin vi phạm, tin sẽ hiện ở đây để bạn ẩn hoặc bỏ qua.
        </EmptyState>
      )}
    </div>
  );
}
