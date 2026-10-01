"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db, notifications } from "@/db";
import { requireUser } from "@/lib/auth/session";

/** Chỉ đánh dấu thông báo của chính mình (điều kiện user_id trong WHERE). */
export async function markRead(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return;
  const [row] = await db
    .update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.id, id), eq(notifications.userId, user.id)))
    .returning({ link: notifications.link });
  revalidatePath("/", "layout");
  // Nút "Xem": đánh dấu đã đọc rồi mở nội dung liên quan
  if (formData.get("go") && row?.link?.startsWith("/")) redirect(row.link);
}

export async function markAllRead() {
  const user = await requireUser();
  await db
    .update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.userId, user.id), eq(notifications.isRead, false)));
  revalidatePath("/", "layout");
}
