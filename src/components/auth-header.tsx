import Link from "next/link";
import { getCurrentUserWithProfile, signOut } from "@/lib/auth/actions";

const navLink =
  "rounded-xl px-3 py-2.5 font-semibold whitespace-nowrap text-muted no-underline hover:bg-surface-soft hover:text-ink max-sm:text-[0.8rem]";

export async function AuthHeader() {
  const user = await getCurrentUserWithProfile();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex min-h-[68px] w-full max-w-[1180px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-2 py-2 sm:px-4">
        <Link
          href="/"
          aria-label="UniFound, về trang tin mới"
          className="inline-flex items-center gap-2.5 text-[1.15rem] font-bold whitespace-nowrap text-ink no-underline"
        >
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-xl bg-primary text-[1.15rem] text-white"
          >
            U
          </span>
          <span>UniFound</span>
        </Link>

        <nav aria-label="Điều hướng chính" className="flex items-center gap-1">
          <Link href="/" className={navLink}>
            Tin mới
          </Link>
          <Link href="/reports/new" className={navLink}>
            Đăng tin
          </Link>
        </nav>

        {user ? (
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="grid size-8 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary"
            >
              {(user.fullName || user.email || "U").charAt(0).toUpperCase()}
            </span>
            <span className="max-w-[140px] truncate font-semibold" title={user.email}>
              {user.fullName || user.email?.split("@")[0]}
            </span>
            {user.role === "ADMIN" && (
              <span
                className="rounded-full bg-lost-soft px-2 py-0.5 text-[0.7rem] font-bold text-lost-hover"
                title="Tài khoản Quản trị viên"
              >
                ADMIN
              </span>
            )}
            <form action={signOut}>
              <button type="submit" className="btn btn-secondary btn-small">
                Đăng xuất
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login" className="btn btn-ghost btn-small">
              Đăng nhập
            </Link>
            <Link href="/register" className="btn btn-primary btn-small">
              Đăng ký
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
