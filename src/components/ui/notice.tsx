import { CircleCheck, Info, OctagonAlert, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

const tones = {
  info: { cls: "bg-primary-soft text-info", icon: "text-primary-hover", Icon: Info },
  warn: { cls: "bg-warn-soft text-warn", icon: "text-pending", Icon: TriangleAlert },
  error: { cls: "bg-danger-soft text-[#7a2210]", icon: "text-danger", Icon: OctagonAlert },
  success: { cls: "bg-found-soft text-[#0b4f37]", icon: "text-found", Icon: CircleCheck },
};

export function Notice({ tone = "info", children }: { tone?: keyof typeof tones; children: ReactNode }) {
  const { cls, icon, Icon } = tones[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`flex items-start gap-3 rounded-md px-4 py-3.5 text-[0.875rem] leading-[1.45] ${cls}`}>
      <Icon className={`mt-px size-5 shrink-0 ${icon}`} aria-hidden />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/** Thông báo chung của server action (lỗi hoặc thành công). */
export function ActionMessage({ state }: { state: { ok?: boolean; message?: string } }) {
  if (!state.message) return null;
  return <Notice tone={state.ok ? "success" : "error"}>{state.message}</Notice>;
}
