import type { User } from "@/db/schema";
import { getCurrentUser, isAdmin } from "@/lib/auth/session";

/** Dùng trong mọi server action quản trị: trả ADMIN đang hoạt động hoặc null (→ 403). */
export async function getAdmin(): Promise<User | null> {
  const user = await getCurrentUser();
  return isAdmin(user) ? user : null;
}

/** Khóa/mở khóa: không tự khóa mình, không khóa ADMIN khác. */
export function canChangeUserStatus(actor: Pick<User, "id">, target: Pick<User, "id" | "role">): boolean {
  return actor.id !== target.id && target.role !== "ADMIN";
}
