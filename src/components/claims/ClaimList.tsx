"use client";

import { useState } from "react";
import { acceptClaim, rejectClaim } from "@/lib/claims/actions";
import { useRouter } from "next/navigation";

export function ClaimList({ claims }: { claims: any[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleAccept(id: string) {
    if (!confirm("Bạn có chắc chắn muốn chấp nhận yêu cầu này và từ chối tất cả các yêu cầu khác?")) return;
    setLoadingId(id);
    await acceptClaim(id);
    setLoadingId(null);
    router.refresh();
  }

  async function handleReject(id: string) {
    if (!confirm("Bạn có chắc chắn muốn từ chối yêu cầu này?")) return;
    setLoadingId(id);
    await rejectClaim(id);
    setLoadingId(null);
    router.refresh();
  }

  if (!claims || claims.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-space-lg bg-surface-container-low rounded-xl gap-space-sm text-center">
        <span className="material-symbols-outlined text-[32px] text-on-surface-variant">inbox</span>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Chưa có ai gửi yêu cầu nhận lại đồ này.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-space-md">
      <h3 className="font-title-md text-title-md flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-[20px]">list_alt</span>
        Danh sách yêu cầu ({claims.length})
      </h3>
      <div className="flex flex-col gap-space-sm">
        {claims.map((claim) => (
          <div key={claim.id} className="p-space-md bg-surface-container-low border border-outline-variant rounded-xl flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-title-md text-title-md">{claim.claimant?.email || "Người dùng ẩn danh"}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {new Date(claim.createdAt).toLocaleString("vi-VN")}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                {claim.status === "pending" && (
                  <span className="px-space-sm py-1 rounded-full font-label-sm text-label-sm bg-surface-container text-primary font-semibold">
                    Đang chờ duyệt
                  </span>
                )}
                {claim.status === "accepted" && (
                  <span className="px-space-sm py-1 rounded-full font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed font-semibold">
                    Đã chấp nhận
                  </span>
                )}
                {claim.status === "rejected" && (
                  <span className="px-space-sm py-1 rounded-full font-label-sm text-label-sm bg-error-container text-on-error-container font-semibold">
                    Đã từ chối
                  </span>
                )}
              </div>
            </div>

            <div className="bg-surface-container-lowest p-space-sm rounded-lg mt-2">
              <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mb-1">
                <span className="material-symbols-outlined text-[14px]">key</span> Ghi chú bảo mật:
              </span>
              <p className="font-body-md text-body-md whitespace-pre-wrap">{claim.proof}</p>
            </div>

            {claim.status === "pending" && (
              <div className="flex justify-end gap-space-sm mt-2">
                <button
                  onClick={() => handleReject(claim.id)}
                  disabled={loadingId !== null}
                  className="px-space-md py-1.5 rounded-lg border border-error text-error hover:bg-error-container transition-colors font-title-md text-title-md text-sm"
                >
                  Từ chối
                </button>
                <button
                  onClick={() => handleAccept(claim.id)}
                  disabled={loadingId !== null}
                  className="px-space-md py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors font-title-md text-title-md text-sm"
                >
                  {loadingId === claim.id ? "Đang xử lý..." : "Chấp nhận"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
