import { Forbidden } from "@/components/ui/forbidden";
import { NavLinks, type NavItem } from "@/components/layout/nav-links";
import { requireUser, isAdmin } from "@/lib/auth/session";

const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Tổng quan" },
  { href: "/admin/moderation", label: "Kiểm duyệt" },
  { href: "/admin/catalog", label: "Danh mục & địa điểm" },
  { href: "/admin/users", label: "Tài khoản" },
];

/** Khu vực /admin: chỉ ADMIN. Mỗi server action quản trị vẫn tự kiểm tra lại quyền. */
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const user = await requireUser();
  if (!isAdmin(user)) return <Forbidden>Khu vực này chỉ dành cho quản trị viên.</Forbidden>;

  return (
    <div className="flex flex-col gap-6 pb-8 pt-6">
      <nav aria-label="Quản trị" className="-mx-1 overflow-x-auto border-b border-line pb-3">
        <NavLinks items={ADMIN_NAV} />
      </nav>
      {children}
    </div>
  );
}
