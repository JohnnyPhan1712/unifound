"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithPassword } from "@/lib/auth/actions";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Vui lòng điền đầy đủ email và mật khẩu.");
      return;
    }

    startTransition(async () => {
      const res = await signInWithPassword({ email, password });
      if (!res.success) {
        setError(res.error);
      } else {
        router.push("/");
        router.refresh();
      }
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <p className="eyebrow">UniFound / Xác thực</p>
          <h1 className="auth-title">Đăng nhập tài khoản</h1>
          <p className="auth-subtitle">
            Truy cập để quản lý bài đăng Lost/Found và các yêu cầu nhận lại đồ.
          </p>
        </div>

        {error && (
          <div className="notice error" role="alert">
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

          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="password" className="field-label">
                Mật khẩu
              </label>
            </div>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                Đang xác thực...
              </span>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Chưa có tài khoản?{" "}
            <Link href="/register" className="auth-link">
              Đăng ký tài khoản mới
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
