"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updatePasswordAction } from "@/lib/auth/actions";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

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
      const res = await updatePasswordAction(password);
      if (!res.success) {
        setError(res.error);
      } else {
        alert("Cập nhật mật khẩu mới thành công! Vui lòng đăng nhập.");
        router.push("/login");
        router.refresh();
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

        {error && (
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
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="password" className="field-label">
              Mật khẩu mới (tối thiểu 6 ký tự)
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="control"
              disabled={isPending}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="field-label">
              Xác nhận lại mật khẩu mới
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="control"
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
        </form>

        <div className="auth-footer">
          <p>
            Quay lại{" "}
            <Link href="/login" className="auth-link">
              Trang Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
