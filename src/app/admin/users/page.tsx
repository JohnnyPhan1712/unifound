import type { Metadata } from "next";
import { Lock, LockOpen } from "lucide-react";
import { AdminActionForm } from "@/components/admin/action-form";
import { setUserStatus } from "@/lib/admin/actions";
import { canChangeUserStatus, getAdmin } from "@/lib/admin/guard";
import { listUsers } from "@/lib/admin/queries";
import { formatDate } from "@/lib/labels";

export const metadata: Metadata = { title: "Tài khoản" };

export default async function UsersPage() {
  const admin = await getAdmin();
  if (!admin) return null; // layout đã hiện 403
  const rows = await listUsers();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1>Tài khoản</h1>
        <p className="mt-1 text-muted">Tài khoản bị khóa không đăng nhập hoặc thao tác được cho tới khi được mở khóa.</p>
      </div>
      <div className="overflow-x-auto rounded-md border border-line bg-surface">
        <table className="w-full min-w-[640px] text-left text-[0.88rem]">
          <thead className="border-b border-line bg-surface-soft text-[0.8125rem] text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Tài khoản</th>
              <th className="px-4 py-3 font-semibold">Vai trò</th>
              <th className="px-4 py-3 font-semibold">Số tin</th>
              <th className="px-4 py-3 font-semibold">Tham gia</th>
              <th className="px-4 py-3 font-semibold">Trạng thái</th>
              <th className="px-4 py-3 font-semibold">
                <span className="sr-only">Thao tác</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <p className="font-semibold">{u.fullName ?? "Chưa đặt tên"}</p>
                  <p className="text-[0.8125rem] text-muted">{u.email}</p>
                </td>
                <td className="px-4 py-3">{u.role === "ADMIN" ? "Quản trị" : "Sinh viên"}</td>
                <td className="tabular px-4 py-3">{u.reports ?? 0}</td>
                <td className="px-4 py-3">{formatDate(u.createdAt)}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${u.status === "locked" ? "bg-danger-soft text-danger" : "bg-found-soft text-found"}`}>
                    {u.status === "locked" ? <Lock className="size-3.5" aria-hidden /> : <LockOpen className="size-3.5" aria-hidden />}
                    {u.status === "locked" ? "Đã khóa" : "Hoạt động"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {canChangeUserStatus(admin, u) && (
                    <AdminActionForm
                      action={setUserStatus}
                      fields={{ userId: u.id, status: u.status === "locked" ? "active" : "locked" }}
                      className={`btn btn-sm ${u.status === "locked" ? "btn-secondary" : "btn-danger"}`}
                      confirmText={u.status === "locked" ? undefined : `Khóa tài khoản ${u.email}?`}
                    >
                      {u.status === "locked" ? "Mở khóa" : "Khóa"}
                    </AdminActionForm>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
