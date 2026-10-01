/** Lỗi vi phạm UNIQUE của Postgres (23505); Drizzle bọc lỗi driver trong `cause`. */
export function isUniqueViolation(error: unknown): boolean {
  const e = error as { code?: string; cause?: { code?: string } } | null;
  return e?.code === "23505" || e?.cause?.code === "23505";
}
