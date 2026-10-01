import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  title,
  children,
  action,
}: {
  icon: LucideIcon;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-[520px] justify-items-center gap-3 px-4 py-16 text-center">
      <span className="mb-2 grid size-[72px] place-items-center rounded-full bg-surface-soft text-ink">
        <Icon className="size-8" strokeWidth={1.5} aria-hidden />
      </span>
      <h2 className="text-[1.25rem]">{title}</h2>
      {children && <div className="text-[0.9375rem] text-muted">{children}</div>}
      {action && <div className="mt-3 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}
