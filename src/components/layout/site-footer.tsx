import Link from "next/link";
import { asc } from "drizzle-orm";
import { db, schools } from "@/db";
import { RECEPTION_POINTS } from "@/lib/help-content";
import { Logo } from "./logo";

const link = "text-ink no-underline hover:underline";
const heading = "mb-3 text-[0.875rem] font-semibold text-ink";

const EXPLORE = [
  { href: "/", label: "Bảng tin" },
  { href: "/?type=LOST", label: "Tin Mất đồ" },
  { href: "/?type=FOUND", label: "Tin Nhặt được" },
  { href: "/reports/new", label: "Đăng tin" },
  { href: "/my", label: "Tin của tôi" },
];

export async function SiteFooter() {
  const campuses = await db.select({ id: schools.id, name: schools.name }).from(schools).orderBy(asc(schools.code));

  return (
    <footer className="border-t border-line-soft bg-surface-soft text-[0.8125rem] text-muted">
      <div className="container-page grid grid-cols-4 gap-8 py-10 max-[1128px]:grid-cols-2 max-[744px]:grid-cols-1">
        <section aria-label="Giới thiệu" className="grid content-start gap-3">
          <div>
            <Logo />
          </div>
          <p>UniFound giúp sinh viên khu vực Thủ Đức đăng tin và tìm lại đồ thất lạc trong khuôn viên trường.</p>
          <p>Gợi ý trùng khớp chỉ để tham khảo, không phải xác nhận sở hữu.</p>
        </section>

        <nav aria-label="Khám phá">
          <h2 className={heading}>Khám phá</h2>
          <ul className="grid gap-2">
            {EXPLORE.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={link}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Khuôn viên liên kết">
          <h2 className={heading}>Khuôn viên liên kết</h2>
          <ul className="grid gap-2">
            {campuses.map((s) => (
              <li key={s.id}>
                <Link href={`/?schoolId=${s.id}`} className={link}>
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <section aria-label="Điểm tiếp nhận trực tiếp">
          <h2 className={heading}>Điểm tiếp nhận trực tiếp</h2>
          <ul className="grid gap-2">
            {RECEPTION_POINTS.map((p) => (
              <li key={p.name}>
                <span className="block text-ink">{p.name}</span>
                {p.note}
              </li>
            ))}
          </ul>
        </section>
      </div>
      <div className="border-t border-line-soft">
        <p className="container-page py-4">© 2026 UniFound · Mini Project</p>
      </div>
    </footer>
  );
}
