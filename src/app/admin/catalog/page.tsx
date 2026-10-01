import type { Metadata } from "next";
import { asc, count, eq } from "drizzle-orm";
import { Eye, EyeOff } from "lucide-react";
import { categories, db, locations, reports, schools } from "@/db";
import { AdminActionForm } from "@/components/admin/action-form";
import { CategoryForm, LocationForm } from "@/components/admin/catalog-forms";
import { setCatalogActive } from "@/lib/admin/catalog";
import { getAdmin } from "@/lib/admin/guard";

export const metadata: Metadata = { title: "Danh mục & địa điểm" };

export default async function CatalogPage() {
  if (!(await getAdmin())) return null; // layout đã hiện 403

  const catCounts = db.select({ id: reports.categoryId, n: count().as("n") }).from(reports).groupBy(reports.categoryId).as("cc");
  const locCounts = db.select({ id: reports.locationId, n: count().as("n") }).from(reports).groupBy(reports.locationId).as("lc");
  const [cats, locs, schoolList] = await Promise.all([
    db
      .select({ id: categories.id, name: categories.name, isActive: categories.isActive, reports: catCounts.n })
      .from(categories)
      .leftJoin(catCounts, eq(catCounts.id, categories.id))
      .orderBy(asc(categories.name)),
    db
      .select({ id: locations.id, name: locations.name, type: locations.type, schoolId: locations.schoolId, schoolName: schools.name, isActive: locations.isActive, reports: locCounts.n })
      .from(locations)
      .leftJoin(schools, eq(locations.schoolId, schools.id))
      .leftJoin(locCounts, eq(locCounts.id, locations.id))
      .orderBy(asc(schools.name), asc(locations.name)),
    db.select({ id: schools.id, name: schools.name }).from(schools).orderBy(asc(schools.name)),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1>Danh mục & địa điểm</h1>
        <p className="mt-1 max-w-[68ch] text-muted">
          Mục bị ẩn không chọn được khi đăng tin hay lọc, nhưng tin cũ vẫn hiển thị đúng. Không xóa cứng để giữ lịch sử tin.
        </p>
      </div>

      <section className="flex flex-col gap-4" aria-labelledby="cats">
        <h2 id="cats">Danh mục đồ vật</h2>
        <div className="panel">
          <CategoryForm />
        </div>
        <ul className="flex flex-col gap-2">
          {cats.map((c) => (
            <li key={c.id} className={`panel flex flex-col gap-3 p-4 sm:flex-row sm:items-end ${c.isActive ? "" : "bg-surface-soft"}`}>
              <div className="flex-1">
                <CategoryForm id={c.id} name={c.name} />
              </div>
              <Meta active={c.isActive} reports={c.reports ?? 0} />
              <Toggle kind="category" id={c.id} active={c.isActive} />
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="locs">
        <h2 id="locs">Địa điểm</h2>
        <div className="panel">
          <LocationForm schools={schoolList} />
        </div>
        <ul className="flex flex-col gap-2">
          {locs.map((l) => (
            <li key={l.id} className={`panel flex flex-col gap-3 p-4 ${l.isActive ? "" : "bg-surface-soft"}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{l.name}</p>
                  <p className="text-[0.8125rem] text-muted">
                    {l.type} · {l.schoolName ?? "Dùng chung"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Meta active={l.isActive} reports={l.reports ?? 0} />
                  <Toggle kind="location" id={l.id} active={l.isActive} />
                </div>
              </div>
              <details>
                <summary className="cursor-pointer text-[0.85rem] font-semibold text-muted">Sửa</summary>
                <div className="pt-3">
                  <LocationForm id={l.id} schools={schoolList} initial={{ name: l.name, type: l.type, schoolId: l.schoolId ?? "" }} />
                </div>
              </details>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Meta({ active, reports }: { active: boolean; reports: number }) {
  return (
    <span className="flex items-center gap-2 text-[0.8125rem] text-muted">
      <span className={`badge ${active ? "bg-found-soft text-found" : "border border-line bg-surface text-muted"}`}>
        {active ? <Eye className="size-3.5" aria-hidden /> : <EyeOff className="size-3.5" aria-hidden />}
        {active ? "Đang dùng" : "Đã ẩn"}
      </span>
      <span className="tabular">{reports} tin</span>
    </span>
  );
}

function Toggle({ kind, id, active }: { kind: "category" | "location"; id: string; active: boolean }) {
  return (
    <AdminActionForm action={setCatalogActive} fields={{ kind, id, isActive: String(!active) }} className="btn btn-ghost btn-sm">
      {active ? "Ẩn" : "Hiện lại"}
    </AdminActionForm>
  );
}
