import { and, eq, sql } from "drizzle-orm";
import { categories, db, locations } from "@/db";
import type { ActionState } from "@/lib/action-state";
import { IMAGE_BUCKET, IMAGE_TYPES, isOwnImagePath, MAX_IMAGE_BYTES } from "./schemas";

/** Kiểm tra lại phía server từng ảnh đã thật sự nằm trong Storage, đúng thư mục, định dạng và dung lượng. */
export async function checkImages(paths: string[], userId: string, bucket = IMAGE_BUCKET): Promise<string | null> {
  if (!paths.length) return null;
  if (new Set(paths).size !== paths.length) return "Ảnh bị trùng.";
  if (!paths.every((p) => isOwnImagePath(p, userId))) return "Ảnh không hợp lệ.";
  const rows = await db.execute<{ name: string; size: string | null; mime: string | null }>(sql`
    select name, metadata->>'size' as size, metadata->>'mimetype' as mime
    from storage.objects
    where bucket_id = ${bucket} and name in (${sql.join(paths.map((p) => sql`${p}`), sql`, `)})`);
  if (rows.length !== paths.length) return "Có ảnh chưa tải lên xong, vui lòng chọn lại.";
  for (const r of rows) {
    if (!r.mime || !IMAGE_TYPES.includes(r.mime)) return "Chỉ nhận ảnh JPG, PNG hoặc WEBP.";
    if (Number(r.size) > MAX_IMAGE_BYTES) return "Mỗi ảnh tối đa 5 MB.";
  }
  return null;
}

/** Danh mục và địa điểm phải tồn tại và đang hoạt động (trả lỗi theo field thay vì lỗi khóa ngoại). */
export async function checkCatalog(categoryId: string, locationId: string): Promise<ActionState["fieldErrors"] | null> {
  const [[category], [location]] = await Promise.all([
    db.select({ id: categories.id }).from(categories).where(and(eq(categories.id, categoryId), eq(categories.isActive, true))),
    db.select({ id: locations.id }).from(locations).where(and(eq(locations.id, locationId), eq(locations.isActive, true))),
  ]);
  if (category && location) return null;
  return {
    ...(category ? {} : { categoryId: ["Danh mục không còn khả dụng."] }),
    ...(location ? {} : { locationId: ["Địa điểm không còn khả dụng."] }),
  };
}
