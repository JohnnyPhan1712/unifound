/** Danh sách tên miền hợp lệ từ biến ALLOWED_EMAIL_DOMAINS (phân tách bằng dấu phẩy). */
export function parseDomains(csv: string | undefined): string[] {
  return (csv ?? "")
    .split(",")
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
}

export function emailDomain(email: string): string {
  const at = email.trim().lastIndexOf("@");
  return at < 0 ? "" : email.trim().slice(at + 1).toLowerCase();
}

/** Chỉ khớp chính xác tên miền, không nhận tên miền con hay đuôi giả (vd. uit.edu.vn.evil.com). */
export function isAllowedEmail(email: string, domains: string[]): boolean {
  const domain = emailDomain(email);
  return domain !== "" && domains.includes(domain);
}

export function allowedDomains(): string[] {
  return parseDomains(process.env.ALLOWED_EMAIL_DOMAINS);
}
