"use client";

import { useState } from "react";
import { createClaim } from "@/lib/claims/actions";
import { useRouter } from "next/navigation";

export function ClaimModal({ reportId, isOpen, onClose }: { reportId: string; isOpen: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("reportId", reportId);

    const result = await createClaim(formData);
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setLoading(false);
      onClose();
      router.refresh();
      // We could add a toast here
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-surface-container-lowest rounded-3xl p-space-xl shadow-lg w-full max-w-lg flex flex-col gap-space-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="flex flex-col gap-space-2xs">
          <h2 className="font-headline-md text-headline-md text-on-surface">Gửi yêu cầu nhận lại</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Hãy cung cấp các thông tin nhận dạng đặc biệt để chứng minh bạn là chủ sở hữu.
          </p>
        </div>

        {error && (
          <div className="p-space-md rounded-xl bg-error-container text-on-error-container font-body-sm text-body-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
          <div className="flex flex-col gap-space-xs bg-surface-container-low p-space-md rounded-xl">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[18px]">key</span>
              <label htmlFor="proof" className="font-title-md text-title-md text-on-surface">
                Ghi chú bảo mật riêng biệt
              </label>
            </div>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Thông tin này chỉ hiển thị cho người đăng báo cáo. (VD: Mật khẩu màn hình khóa, vết xước bí mật, đồ vật chứa bên trong...)
            </p>
            <textarea
              id="proof"
              name="proof"
              required
              minLength={10}
              maxLength={1000}
              rows={4}
              placeholder="Tôi nhớ màn hình khóa có hình chú mèo, và có vết xước ở góc trái..."
              className="w-full px-space-md py-2 rounded-xl bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:ring-2 focus:ring-primary focus:outline-none mt-2"
            />
          </div>

          <div className="flex justify-end gap-space-sm pt-space-sm">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-space-md py-2 rounded-xl font-title-md text-title-md hover:bg-surface-container transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-space-lg py-2 rounded-xl bg-primary text-on-primary font-title-md text-title-md hover:bg-primary-container transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">send</span>
              )}
              <span>Gửi yêu cầu</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
