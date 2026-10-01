import type { FeedParams } from "./query";

/** URL bảng tin từ tham số hiện tại cộng thay đổi; chỉ ghi tham số có giá trị. */
export function feedHref(p: FeedParams, patch: Partial<FeedParams> = {}): string {
  const n = { ...p, ...patch };
  const qs = new URLSearchParams();
  if (n.type !== "ALL") qs.set("type", n.type);
  if (n.q) qs.set("q", n.q);
  if (n.categoryId) qs.set("category", n.categoryId);
  if (n.schoolId) qs.set("school", n.schoolId);
  if (n.locationId) qs.set("location", n.locationId);
  if (n.from) qs.set("from", n.from);
  if (n.to) qs.set("to", n.to);
  if (n.page > 1) qs.set("page", String(n.page));
  const s = qs.toString();
  return s ? `/?${s}` : "/";
}
