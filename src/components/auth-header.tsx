import Link from "next/link";
import { getCurrentUserWithProfile, signOut } from "@/lib/auth/actions";

export async function AuthHeader() {
  const user = await getCurrentUserWithProfile();

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="brand-group">
          <Link href="/" className="brand-logo">
            <span className="logo-badge">Uni</span>
            <span className="logo-title">Found</span>
          </Link>
          <span className="brand-tag">Campus Lost & Found</span>
        </div>

        <nav className="nav-links">
          <Link href="/" className="nav-link">
            Bảng tin (Feed)
          </Link>
          <Link href="/reports/create" className="nav-link">
            + Đăng tin
          </Link>
          <Link href="/matches" className="nav-link">
            Gợi ý trùng khớp
          </Link>
          {user && (
            <Link href="/my-reports" className="nav-link">
              Tin của tôi
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <Link href="/admin" className="nav-link font-semibold text-amber-600 dark:text-amber-400">
              Quản trị (Admin)
            </Link>
          )}
        </nav>

        <div className="auth-group">
          {user ? (
            <div className="user-menu">
              <div className="user-info">
                <span className="user-avatar" aria-hidden="true">
                  {(user.fullName || user.email || "U")
                    .charAt(0)
                    .toUpperCase()}
                </span>
                <span className="user-name" title={user.email}>
                  {user.fullName || user.email?.split("@")[0]}
                </span>
                {user.role === "ADMIN" && (
                  <span
                    className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                    title="Tài khoản Quản trị viên"
                  >
                    ADMIN
                  </span>
                )}
              </div>
              <form action={signOut}>
                <button type="submit" className="btn btn-outline btn-sm">
                  Đăng xuất
                </button>
              </form>
            </div>
          ) : (
            <div className="guest-actions">
              <Link href="/login" className="btn btn-ghost btn-sm">
                Đăng nhập
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
