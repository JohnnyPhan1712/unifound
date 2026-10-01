"use server";

import { revalidatePath } from "next/cache";
import { and, eq, ne, sql } from "drizzle-orm";
import { categories, db, locations, schools } from "@/db";
import { forbidden, formValues, invalid, type ActionState } from "@/lib/action-state";
import { isUniqueViolation } from "@/lib/db-errors";
import { categorySchema, locationSchema } from "./catalog-schemas";
import { getAdmin } from "./guard";

const DUPLICATE = { fieldErrors: { name: ["Tên này đã tồn tại."] } };

function revalidateCatalog() {
  revalidatePath("/admin/catalog");
  revalidatePath("/", "layout");
}

/** Trùng tên không phân biệt hoa/thường (UNIQUE của DB chỉ chặn trùng chính xác). */
async function nameTaken(table: typeof categories | typeof locations, name: string, exceptId?: string) {
  const [row] = await db
    .select({ id: table.id })
    .from(table)
    .where(and(sql`lower(${table.name}) = lower(${name})`, exceptId ? ne(table.id, exceptId) : undefined));
  return Boolean(row);
}

export async function saveCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await getAdmin())) return forbidden;
  const values = formValues(formData);
  const parsed = categorySchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  const { id, name } = parsed.data;
  if (await nameTaken(categories, name, id)) return { ...DUPLICATE, values };
  try {
    if (id) await db.update(categories).set({ name }).where(eq(categories.id, id));
    else await db.insert(categories).values({ name });
  } catch (e) {
    if (isUniqueViolation(e)) return { ...DUPLICATE, values };
    throw e;
  }
  revalidateCatalog();
  return { ok: true, message: id ? "Đã đổi tên danh mục." : `Đã thêm danh mục “${name}”.` };
}

export async function saveLocation(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await getAdmin())) return forbidden;
  const values = formValues(formData);
  const parsed = locationSchema.safeParse(values);
  if (!parsed.success) return invalid(parsed.error, values);
  const { id, name, type, schoolId } = parsed.data;
  if (await nameTaken(locations, name, id)) return { ...DUPLICATE, values };
  if (schoolId) {
    const [school] = await db.select({ id: schools.id }).from(schools).where(eq(schools.id, schoolId));
    if (!school) return { fieldErrors: { schoolId: ["Trường không tồn tại."] }, values };
  }
  try {
    if (id) await db.update(locations).set({ name, type, schoolId }).where(eq(locations.id, id));
    else await db.insert(locations).values({ name, type, schoolId });
  } catch (e) {
    if (isUniqueViolation(e)) return { ...DUPLICATE, values };
    throw e;
  }
  revalidateCatalog();
  return { ok: true, message: id ? "Đã cập nhật địa điểm." : `Đã thêm địa điểm “${name}”.` };
}

/** Ẩn/hiện thay vì xóa cứng: tin cũ vẫn tham chiếu được mục đã ẩn. */
export async function setCatalogActive(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await getAdmin())) return forbidden;
  const id = String(formData.get("id") ?? "");
  const kind = formData.get("kind");
  const isActive = formData.get("isActive") === "true";
  if (!/^[0-9a-f-]{36}$/i.test(id) || (kind !== "category" && kind !== "location")) return { message: "Yêu cầu không hợp lệ." };
  const table = kind === "category" ? categories : locations;
  const [row] = await db.update(table).set({ isActive }).where(eq(table.id, id)).returning({ name: table.name });
  if (!row) return { message: "Mục không tồn tại." };
  revalidateCatalog();
  return { ok: true, message: `${isActive ? "Đã hiện" : "Đã ẩn"} “${row.name}”.` };
}
