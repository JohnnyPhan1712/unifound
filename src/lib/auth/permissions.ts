import type { ReportStatus, User } from "@/db/schema";

type Actor = Pick<User, "id" | "role" | "status"> | null;

/** Chủ tin hoặc ADMIN (tài khoản không bị khóa). */
export function canManageReport(actor: Actor, report: { userId: string }): boolean {
  if (!actor || actor.status !== "active") return false;
  return actor.id === report.userId || actor.role === "ADMIN";
}

export type ReportAction = "edit" | "close" | "delete";

/**
 * Quy ước trạng thái (CHG-017):
 * - Sửa, đóng: chỉ khi tin đang mở (OPEN).
 * - Xóa: không cho khi đang bàn giao (IN_PROGRESS) hoặc đã trả (RETURNED) để giữ lịch sử yêu cầu nhận đồ.
 */
const ALLOWED: Record<ReportAction, ReportStatus[]> = {
  edit: ["OPEN"],
  close: ["OPEN"],
  delete: ["OPEN", "CLOSED", "HIDDEN"],
};

export function statusAllows(action: ReportAction, status: ReportStatus): boolean {
  return ALLOWED[action].includes(status);
}

export const STATUS_BLOCK_MESSAGE: Record<ReportAction, string> = {
  edit: "Chỉ sửa được tin đang mở.",
  close: "Chỉ đóng được tin đang mở.",
  delete: "Không xóa được tin đang bàn giao hoặc đã trả.",
};
