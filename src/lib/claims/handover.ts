import { z } from "zod";
import type { ClaimStatus } from "@/db/schema";
import { parseLocalDateTime } from "@/lib/reports/schemas";

/** Liên hệ hai bên chỉ hiện khi yêu cầu đang ở trạng thái đã chấp nhận (FR11). */
export function canSeeContacts(status: ClaimStatus): boolean {
  return status === "ACCEPTED";
}

export type HandoverRole = "finder" | "owner";

/** finder = chủ tin Nhặt được; owner = người mất đồ (người gửi yêu cầu). */
export function handoverRole(actorId: string, claim: { claimantId: string; finderId: string }): HandoverRole | null {
  if (actorId === claim.finderId) return "finder";
  if (actorId === claim.claimantId) return "owner";
  return null;
}

type Confirmations = { finderConfirmedAt: Date | null; ownerConfirmedAt: Date | null };

/** Ghi xác nhận của một bên; bấm lặp lại giữ mốc cũ. Đủ hai bên → completed. */
export function applyConfirmation(c: Confirmations, role: HandoverRole, now: Date): Confirmations & { completed: boolean } {
  const next = {
    finderConfirmedAt: role === "finder" ? (c.finderConfirmedAt ?? now) : c.finderConfirmedAt,
    ownerConfirmedAt: role === "owner" ? (c.ownerConfirmedAt ?? now) : c.ownerConfirmedAt,
  };
  return { ...next, completed: Boolean(next.finderConfirmedAt && next.ownerConfirmedAt) };
}

export const meetingSchema = z.object({
  id: z.uuid(),
  meetLocationId: z.uuid("Chọn điểm hẹn."),
  meetTime: z
    .string({ error: "Chọn giờ hẹn." })
    .transform((v, ctx) => {
      const d = parseLocalDateTime(v);
      if (!d) {
        ctx.addIssue({ code: "custom", message: "Chọn giờ hẹn." });
        return z.NEVER;
      }
      if (d.getTime() <= Date.now()) {
        ctx.addIssue({ code: "custom", message: "Giờ hẹn phải ở tương lai." });
        return z.NEVER;
      }
      return d;
    }),
});
