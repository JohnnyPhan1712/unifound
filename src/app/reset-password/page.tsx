"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { PasswordInput } from "@/components/password-input";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Kiểm tra nếu Supabase trả về lỗi trong URL (link hết hạn, đã dùng...)
    const urlError = searchParams.get("error");
    const errorCode = searchParams.get("error_code");

    if (urlError) {
      if (errorCode === "otp_expired") {
        setError(
          "Link đặt lại mật khẩu đã hết hạn hoặc đã được sử dụng. Vui lòng yêu cầu gửi lại email mới."
        );
      } else {
        setError("Link không hợp lệ. Vui lòng yêu cầu gửi lại email mới.");
      }
      setChecking(false);
      return;
    }

    // Xử lý PKCE code trong URL (Supabase gửi ?code=... khi flow = pkce)
    const code = searchParams.get("code");
    if (code) {
      const supabase = createClient();
      supabase.auth.exchangeCodeForSession(code).then(({ error: exchError }) => {
        if (exchError) {
          setError("Không thể xác thực link. Vui lòng yêu cầu gửi lại email mới.");
        } else {
          setSessionReady(true);
        }
        setChecking(false);
      });
      return;
    }

    // Xử lý hash fragment (#access_token=...&type=recovery) — implicit flow
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSessionReady(true);
      } else {
        setError(
          "Không tìm thấy phiên xác thực. Vui lòng dùng đúng link từ email đặt lại mật khẩu."
        );
      }
      setChecking(false);
    });
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    startTransition(async () => {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message || "Không thể cập nhật mật khẩu mới.");
      } else {
        alert("Cập nhật mật khẩu thành công! Vui lòng đăng nhập lại.");
        router.push("/login");
      }
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <p className="eyebrow">UniFound / Đặt lại mật khẩu</p>
          <h1 className="auth-title">Mật khẩu mới</h1>
          <p className="auth-subtitle">
            Tạo mật khẩu mới cho tài khoản của bạn để tiếp tục sử dụng UniFound.
          </p>
        </div>

        {/* Đang kiểm tra xác thực */}
        {checking && (
          <div className="text-center py-6 text-sm text-on-surface-variant">
            <span className="spinner inline-block mr-2" />
            Đang xác thực liên kết...
          </div>
        )}

        {/* Lỗi xác thực hoặc link hết hạn */}
        {!checking && error && (
          <>
            <div className="alert alert-error" role="alert">
              <svg
                className="alert-icon"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
            <div className="auth-footer">
              <p>
                <Link href="/forgot-password" className="auth-link">
                  → Gửi lại email đặt lại mật khẩu
                </Link>
              </p>
            </div>
          </>
        )}

        {/* Form đặt mật khẩu mới — chỉ hiển thị khi session hợp lệ */}
        {!checking && sessionReady && (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="password" className="field-label">
                Mật khẩu mới (tối thiểu 6 ký tự)
              </label>
              <PasswordInput
                id="password"
                required
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="field-label">
                Xác nhận lại mật khẩu mới
              </label>
              <PasswordInput
                id="confirmPassword"
                required
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isPending}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={isPending}
            >
              {isPending ? (
                <span className="btn-loading">
                  <span className="spinner" />
                  Đang lưu mật khẩu...
                </span>
              ) : (
                "Lưu mật khẩu mới"
              )}
            </button>

            <div className="auth-footer">
              <p>
                Quay lại{" "}
                <Link href="/login" className="auth-link">
                  Trang Đăng nhập
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
