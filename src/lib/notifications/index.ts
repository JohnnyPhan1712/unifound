import { and, count, desc, eq } from "drizzle-orm";
import { db, notifications, type NotificationType } from "@/db";

export type NewNotification = { userId: string; type: NotificationType; message: string; link?: string };

type Executor = Pick<typeof db, "insert">;

/** Tạo thông báo trong web (dùng chung cho gợi ý, yêu cầu, lịch hẹn, kiểm duyệt). */
export async function notify(rows: NewNotification[], executor: Executor = db) {
  if (!rows.length) return;
  await executor.insert(notifications).values(rows.map((r) => ({ ...r, link: r.link ?? null })));
}

export async function getUnreadCount(userId: string): Promise<number> {
  const [row] = await db
    .select({ n: count() })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  return row.n;
}

export async function listNotifications(userId: string) {
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(100);
}
