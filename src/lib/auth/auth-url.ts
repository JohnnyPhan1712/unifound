export type AuthMode = "login" | "register" | "forgot";

export const isAuthMode = (v: string | null | undefined): v is AuthMode => v === "login" || v === "register" || v === "forgot";

/** Popup xác thực mở theo URL (`?auth=`), nên server (proxy, action, trang cũ) chỉ cần chuyển hướng tới đây. */
export function authUrl(mode: AuthMode, extra: Record<string, string | undefined> = {}, path = "/") {
  const qs = new URLSearchParams({ auth: mode });
  for (const [k, v] of Object.entries(extra)) if (v) qs.set(k, v);
  return `${path}?${qs}`;
}
