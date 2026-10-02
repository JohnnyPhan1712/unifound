import { asc, eq } from "drizzle-orm";
import { categories, db, locations, schools } from "@/db";

/** Danh mục, địa điểm (nhóm theo trường) và trường cho form đăng tin, bộ lọc, điểm hẹn — chỉ mục đang hoạt động. */
export async function getCatalogOptions() {
  const [cats, locs, schoolRows] = await Promise.all([
    db
      .select({ id: categories.id, name: categories.name })
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(asc(categories.name)),
    db
      .select({ id: locations.id, name: locations.name, group: schools.name, schoolId: locations.schoolId })
      .from(locations)
      .leftJoin(schools, eq(locations.schoolId, schools.id))
      .where(eq(locations.isActive, true))
      .orderBy(asc(schools.name), asc(locations.name)),
    db.select({ id: schools.id, name: schools.name }).from(schools).orderBy(asc(schools.name)),
  ]);
  return {
    categories: cats,
    locations: locs.map((l) => ({ id: l.id, name: l.name, group: l.group ?? "Dùng chung (KTX, nhà văn hóa…)", schoolId: l.schoolId ?? undefined })),
    schools: schoolRows,
  };
}
