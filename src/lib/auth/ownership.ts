import { Report, Claim } from "@/db/schema";
import { getCurrentUser } from "./actions";

/**
 * Custom Error Classes cho Authentication & Authorization
 */
export class AuthError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 401) {
    super(message);
    this.name = "AuthError";
    this.statusCode = statusCode;
  }
}

export class UnauthorizedError extends AuthError {
  constructor(message = "Bạn cần đăng nhập để thực hiện thao tác này.") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AuthError {
  constructor(message = "Bạn không có quyền thực hiện thao tác này.") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

/**
 * Bắt buộc người dùng phải đăng nhập. Trả về thông tin User nếu hợp lệ, ném UnauthorizedError nếu chưa đăng nhập.
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new UnauthorizedError();
  }
  return user;
}

/**
 * Kiểm tra quyền quản trị viên (ADMIN). Ném ForbiddenError nếu không phải ADMIN.
 */
export function assertAdmin(user: { role?: string | null } | null | undefined): void {
  if (!user || user.role !== "ADMIN") {
    throw new ForbiddenError("Thao tác yêu cầu quyền quản trị viên (ADMIN).");
  }
}

/**
 * DEC-001 & CHG-008: Kiểm tra quyền chỉnh sửa hoặc xóa report.
 * - Cho phép nếu người dùng là chủ sở hữu (owner: report.userId === user.id).
 * - Cho phép nếu người dùng có quyền quản trị (ADMIN: user.role === 'ADMIN').
 * - Từ chối (403) nếu không phải chủ sở hữu và không phải ADMIN.
 */
export function assertUserOwnsReport(
  report: Pick<Report, "userId"> | { userId: string },
  userOrId: { id: string; role?: string | null } | string
): void {
  const userId = typeof userOrId === "string" ? userOrId : userOrId.id;
  const userRole = typeof userOrId === "string" ? undefined : userOrId.role;

  if (!userId) {
    throw new ForbiddenError(
      "Bạn không có quyền chỉnh sửa hoặc quản lý bài đăng này."
    );
  }

  // ADMIN có quyền quản lý mọi bài đăng
  if (userRole === "ADMIN") {
    return;
  }

  if (report.userId !== userId) {
    throw new ForbiddenError(
      "Bạn không có quyền chỉnh sửa hoặc quản lý bài đăng này."
    );
  }
}

/**
 * Helper kiểm tra quyền xem người dùng có thể quản lý (sửa/xóa) report hay không.
 * Trả về boolean, thuận tiện dùng trong UI components.
 */
export function canUserManageReport(
  report: Pick<Report, "userId"> | { userId: string },
  user?: { id: string; role?: string | null } | null
): boolean {
  if (!user || !user.id) return false;
  if (user.role === "ADMIN") return true;
  return report.userId === user.id;
}


/**
 * DEC-001, DEC-002, DEC-005: Kiểm tra quyền gửi Claim (yêu cầu nhận lại đồ).
 * - Không được claim bài đăng của chính mình.
 * - Chỉ có thể claim Found Report (báo cáo nhặt được).
 * - Không thể gửi claim cho bài đăng đã hoàn tất (returned) hoặc đã đóng (closed).
 */
export function assertCanClaimReport(
  report: { userId: string; type: string; status: string },
  userId: string
): void {
  if (!userId) {
    throw new UnauthorizedError(
      "Bạn cần đăng nhập để gửi yêu cầu nhận lại đồ (claim)."
    );
  }

  if (report.userId === userId) {
    throw new ForbiddenError(
      "Bạn không thể gửi yêu cầu nhận lại cho bài đăng do chính mình tạo ra."
    );
  }

  if (report.type !== "found") {
    throw new ForbiddenError(
      "Chỉ có thể gửi yêu cầu nhận lại cho bài đăng nhặt được đồ (Found Report)."
    );
  }

  if (report.status === "returned" || report.status === "closed") {
    throw new ForbiddenError(
      "Bài đăng này đã hoàn tất trao trả hoặc đã đóng, không thể gửi thêm yêu cầu nhận lại."
    );
  }
}

/**
 * DEC-001, DEC-005: Chỉ chủ của Found Report (người nhặt) mới có quyền:
 * - Xem danh sách các Claim gửi tới bài đăng.
 * - Duyệt Accept / Reject claim.
 * - Đánh dấu trạng thái 'Returned' sau khi đã trao trả thực tế.
 */
export function assertCanManageClaim(
  report: Pick<Report, "userId"> | { userId: string },
  userId: string
): void {
  if (!userId || report.userId !== userId) {
    throw new ForbiddenError(
      "Chỉ người nhặt được đồ (chủ Found Report) mới có quyền duyệt yêu cầu nhận đồ hoặc xác nhận đã trả lại."
    );
  }
}

/**
 * DEC-005: Bảo vệ quyền riêng tư của thông tin xác minh (proof).
 * Thông tin xác minh CHỈ hiển thị cho:
 * 1. Người gửi claim (claimant).
 * 2. Chủ bài đăng nhặt được (found report owner).
 * Tuyệt đối không để lộ cho người dùng khác hoặc công khai trên feed.
 */
export function assertCanViewProof(
  claim: Pick<Claim, "claimantId"> | { claimantId: string },
  userId: string,
  reportOwnerId?: string
): void {
  if (!userId) {
    throw new UnauthorizedError(
      "Bạn cần đăng nhập để xem thông tin xác minh."
    );
  }

  const isClaimant = claim.claimantId === userId;
  const isReportOwner = reportOwnerId === userId;

  if (!isClaimant && !isReportOwner) {
    throw new ForbiddenError(
      "Thông tin xác minh quyền sở hữu là riêng tư. Bạn không có quyền xem thông tin này."
    );
  }
}
