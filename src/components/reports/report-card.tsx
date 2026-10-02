import Link from "next/link";
import { Package, Search } from "lucide-react";
import type { ReportStatus, ReportType } from "@/db/schema";
import { StatusBadge, TypeBadge } from "@/components/ui/badges";
import { categoryIcon } from "@/components/ui/category-icon";
import { imageUrl } from "@/lib/reports/images";
import { formatDate } from "@/lib/labels";

/**
 * Ảnh tin, hoặc "category plate" (nền nhạt theo loại tin + icon danh mục + hoa văn chấm) khi chưa có ảnh.
 * `className` đặt kích thước/bo góc (vd. "aspect-[4/3] w-full").
 */
export function ReportVisual({
  type,
  path,
  category,
  className = "",
  iconClassName = "size-14",
  dim,
}: {
  type: ReportType;
  path?: string | null;
  category?: string | null;
  className?: string;
  iconClassName?: string;
  dim?: boolean;
}) {
  const tone = type === "LOST" ? "lost" : "found";
  if (path) {
    return (
      <div className={`plate ${tone} after:hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl(path)} alt="" loading="lazy" className={`absolute inset-0 size-full object-cover ${dim ? "opacity-60" : ""}`} />
      </div>
    );
  }
  const iconProps = { className: `plate-ico ${iconClassName} ${dim ? "opacity-45" : ""}`, strokeWidth: 1.25 };
  return (
    <div className={`plate ${tone} ${className}`} aria-hidden>
      {category ? categoryIcon(category, iconProps) : type === "LOST" ? <Search {...iconProps} /> : <Package {...iconProps} />}
    </div>
  );
}

type CardData = {
  id: string;
  type: ReportType;
  status: ReportStatus;
  title: string;
  categoryName: string;
  locationName: string;
  eventTime: Date;
  cover: string | null;
};

/** Thẻ tin ở bảng tin: không viền, ảnh bo lớn, nhãn loại tin ở góc, thông tin bên dưới. */
export function ReportCard({ r }: { r: CardData }) {
  return (
    <Link href={`/reports/${r.id}`} className="card-link flex w-full flex-col gap-3 rounded-md text-ink no-underline focus-visible:outline-offset-[6px]">
      <div className="relative">
        <ReportVisual type={r.type} path={r.cover} category={r.categoryName} dim={r.status === "RETURNED"} className="aspect-video w-full sm:aspect-[4/3]" />
        <span className="absolute left-3 top-3 z-[1]">
          <TypeBadge type={r.type} onPlate />
        </span>
        {r.status !== "OPEN" && (
          <span className="absolute bottom-3 left-3 z-[1]">
            <StatusBadge status={r.status} />
          </span>
        )}
      </div>
      <div className="grid gap-0.5 text-[0.875rem] leading-[1.43]">
        <span className="line-clamp-1 text-[0.9375rem] font-semibold leading-snug">{r.title}</span>
        <span className="text-muted">
          {r.locationName} · {r.categoryName}
        </span>
        <span className="tabular text-muted">
          {r.type === "LOST" ? "Ngày mất" : "Ngày nhặt"} {formatDate(r.eventTime)}
        </span>
      </div>
    </Link>
  );
}
