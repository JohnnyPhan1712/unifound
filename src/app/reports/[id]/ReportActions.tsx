"use client";

import { useState } from "react";
import { ClaimModal } from "@/components/claims/ClaimModal";

export function ReportActions({ reportId }: { reportId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-space-sm pt-space-md">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-center gap-space-xs py-space-md rounded-xl bg-primary text-on-primary font-title-lg text-title-lg hover:bg-primary-container shadow-md transition-all"
        >
          <span className="material-symbols-outlined text-[22px]">handshake</span>
          <span>Gửi yêu cầu nhận lại (Claim đồ này)</span>
        </button>
        <button className="w-full flex items-center justify-center gap-space-xs py-space-sm rounded-xl bg-surface-container-high text-primary font-title-md text-title-md hover:bg-surface-container-highest transition-colors">
          <span className="material-symbols-outlined text-[20px]">hub</span>
          <span>Xem đối chiếu trùng khớp (AI Beacon 94%)</span>
        </button>
      </div>
      <ClaimModal
        reportId={reportId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
