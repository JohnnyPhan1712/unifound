"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { useAuthHref } from "./auth-modal";

type Props = { user: { initial: string; name: string } | null };

const avatar = "grid size-[42px] place-items-center rounded-full border border-line text-[0.875rem] font-semibold no-underline transition-shadow hover:shadow-panel";

/** Khách: bấm mở popup đăng nhập. Đã đăng nhập: bấm để xem hồ sơ (các mục tài khoản khác nằm ở HammerMenu). */
export function UserAvatarButton({ user }: Props) {
  const authHref = useAuthHref();

  if (!user) {
    return (
      <Link href={authHref("login")} scroll={false} className={`${avatar} bg-surface-strong text-ink`} aria-label="Đăng nhập">
        <User className="size-5" aria-hidden />
      </Link>
    );
  }
  return (
    <Link href="/profile" className={`${avatar} bg-ink text-white`} aria-label={`Hồ sơ của ${user.name}`}>
      {user.initial}
    </Link>
  );
}
