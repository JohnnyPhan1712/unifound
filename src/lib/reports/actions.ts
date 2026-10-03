"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, reportImages, reports } from "@/db";
import { formValues, invalid, type ActionState } from "@/lib/action-state";
import { requireUser } from "@/lib/auth/session";
import { runMatchingSafely } from "@/lib/matching/run";
import { checkCatalog, checkImages } from "./checks";
import { expiresAtFrom } from "./expiry";
import { createReportSchema } from "./schemas";

export async function createReport(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const values = formValues(formData);
  const parsed = createReportSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  const data = parsed.data;

  const catalogErrors = await checkCatalog(data.categoryId, data.locationId);
  if (catalogErrors) return { fieldErrors: catalogErrors, values };
  const imageError = await checkImages(data.images, user.id);
  if (imageError) return { fieldErrors: { images: [imageError] }, values };

  const now = new Date();
  const id = await db.transaction(async (tx) => {
    const [row] = await tx
      .insert(reports)
      .values({
        userId: user.id,
        type: data.type,
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        locationId: data.locationId,
        eventTime: data.eventTime,
        keepingPlace: data.type === "FOUND" ? data.keepingPlace : null,
        verifyQuestion: data.type === "FOUND" ? data.verifyQuestion : null,
        verifyAnswer: data.type === "FOUND" ? data.verifyAnswer : null,
        status: "OPEN",
        createdAt: now,
        expiresAt: expiresAtFrom(now),
      })
      .returning({ id: reports.id });
    if (data.images.length) await tx.insert(reportImages).values(data.images.map((imageUrl, position) => ({ reportId: row.id, imageUrl, position })));
    return row.id;
  });

  // Matching chạy sau khi tin đã lưu; lỗi ở đây không làm mất tin (FR08)
  await runMatchingSafely(id);

  revalidatePath("/", "layout");
  redirect(`/reports/${id}?created=1`);
}
