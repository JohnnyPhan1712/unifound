"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db, matches, reports } from "@/db";
import { forbidden, type ActionState } from "@/lib/action-state";
import { requireUser } from "@/lib/auth/session";

const lost = alias(reports, "lost");
const found = alias(reports, "found");

/** "Không phải": một trong hai chủ tin bỏ gợi ý; cặp này không được gợi ý lại. */
export async function dismissMatch(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const [row] = /^[0-9a-f-]{36}$/i.test(id)
    ? await db
        .select({ lostOwner: lost.userId, foundOwner: found.userId })
        .from(matches)
        .innerJoin(lost, eq(matches.lostReportId, lost.id))
        .innerJoin(found, eq(matches.foundReportId, found.id))
        .where(eq(matches.id, id))
    : [];
  if (!row) return { message: "Gợi ý không còn tồn tại." };
  if (row.lostOwner !== user.id && row.foundOwner !== user.id) return forbidden;

  await db.update(matches).set({ status: "DISMISSED" }).where(eq(matches.id, id));
  revalidatePath("/matches");
  return { ok: true, message: "Đã bỏ gợi ý này. Hệ thống sẽ không gợi ý lại cặp tin này." };
}
