"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { ForgotForm } from "@/components/auth/forgot-form";
import { Modal } from "@/components/ui/modal";
import { Notice } from "@/components/ui/notice";
import { isAuthMode, type AuthMode } from "@/lib/auth/auth-url";

// Tham số chỉ để hiển thị popup; bỏ chúng khi tính "trang hiện tại".
const AUTH_PARAMS = ["auth", "next", "error", "reset"];

/** Trả hàm tạo URL mở popup xác thực ngay trên trang hiện tại; không truyền `next` thì sau đăng nhập ở lại trang này. */
export function useAuthHref() {
  const pathname = usePathname();
  const params = useSearchParams();
  return (mode: AuthMode, next?: string) => {
    const qs = new URLSearchParams(params);
    ["error", "reset", "next"].forEach((k) => qs.delete(k));
    qs.set("auth", mode);
    if (next) qs.set("next", next);
    return `${pathname}?${qs}`;
  };
}

const COPY: Record<AuthMode, { title: string; heading: string; lede: string }> = {
  login: { title: "Đăng nhập", heading: "Chào mừng đến UniFound", lede: "Đăng nhập để đăng tin, gửi yêu cầu nhận lại và theo dõi trạng thái." },
  register: { title: "Tạo tài khoản", heading: "Tạo tài khoản", lede: "Chỉ sinh viên có email trường mới đăng ký được, để bảng tin giữ trong cộng đồng UIT. Quyền quản trị do nhóm cấp sẵn." },
  forgot: { title: "Quên mật khẩu", heading: "Đặt lại mật khẩu", lede: "Nhập email trường, chúng tôi sẽ gửi liên kết để bạn đặt mật khẩu mới." },
};

/** Popup đăng nhập / đăng ký / quên mật khẩu, mở bằng `?auth=login|register|forgot` trên bất kỳ trang nào. */
export function AuthModal({ domains }: { domains: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const hrefFor = useAuthHref();
  const raw = params.get("auth");
  if (!isAuthMode(raw)) return null;
  const mode = raw;

  const stripped = new URLSearchParams(params);
  AUTH_PARAMS.forEach((k) => stripped.delete(k));
  const qs = stripped.toString();
  const here = qs ? `${pathname}?${qs}` : pathname;
  const close = () => router.replace(here, { scroll: false });

  // `next` từ URL (proxy, nút Đăng tin) hoặc trang hiện tại; server vẫn kiểm tra lại (safeNext).
  const rawNext = params.get("next");
  const next = rawNext?.startsWith("/") && !rawNext.startsWith("//") ? rawNext : here;
  const switchTo = (m: AuthMode) => hrefFor(m, rawNext ?? undefined);

  const { title, heading, lede } = COPY[mode];
  const error = params.get("error");
  return (
    <Modal title={title} onClose={close}>
      <div className="grid gap-5 p-6">
        <h1 className="text-[1.375rem] font-semibold">{heading}</h1>
        <p className="-mt-3 text-[0.875rem] text-muted">{lede}</p>
        {error === "locked" && <Notice tone="error">Tài khoản đã bị khóa. Liên hệ quản trị viên để được hỗ trợ.</Notice>}
        {error === "expired" && <Notice tone="warn">Liên kết đã hết hạn hoặc đã dùng. Hãy yêu cầu liên kết mới.</Notice>}
        {params.get("reset") === "1" && <Notice tone="success">Đã đổi mật khẩu. Hãy đăng nhập bằng mật khẩu mới.</Notice>}
        {mode === "forgot" ? (
          <ForgotForm domains={domains} loginHref={switchTo("login")} />
        ) : (
          <AuthForm key={mode} mode={mode} next={next} domains={domains} hrefFor={switchTo} />
        )}
      </div>
    </Modal>
  );
}
