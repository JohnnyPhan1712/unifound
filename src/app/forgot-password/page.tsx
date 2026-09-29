"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { resetPasswordForEmailAction } from "@/lib/auth/actions";

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !email.includes("@")) {
      setError("Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }

    startTransition(async () => {
      const res = await resetPasswordForEmailAction(email);
      if (!res.success) {
        setError(res.error);
      } else {
        setSuccess(
          `Hướng dẫn đặt lại mật khẩu đã được gửi đến email ${email}. Vui lòng kiểm tra hộp thư đến.`
        );
      }
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <p className="eyebrow">UniFound / Khôi phục mật khẩu</p>
          <h1 className="auth-title">Quên mật khẩu</h1>
          <p className="auth-subtitle">
            Nhập địa chỉ email đăng ký của bạn. Chúng tôi sẽ gửi liên kết để bạn đặt lại mật khẩu mới.
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

        {success && (
          <div className="alert alert-success bg-green-50 text-green-800 border border-green-200 rounded-lg p-3 text-sm flex items-start gap-2 mb-4" role="status">
            <svg
              className="w-5 h-5 text-green-600 shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="field-label">
              Địa chỉ Email sinh viên
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="student@unifound.demo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                Đang gửi yêu cầu...
              </span>
            ) : (
              "Gửi email khôi phục"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Đã nhớ mật khẩu?{" "}
            <Link href="/login" className="auth-link">
              Quay lại Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
