import type { Metadata } from "next";
import Link from "next/link";
import { Be_Vietnam_Pro } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

const font = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "UniFound — Đồ thất lạc UIT", template: "%s · UniFound" },
  description: "UniFound giúp sinh viên đăng tin và tìm lại đồ thất lạc trong khuôn viên trường.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={font.variable}>
      <body className="flex min-h-dvh flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-canvas focus:px-4 focus:py-2 focus:shadow-panel"
        >
          Bỏ qua điều hướng
        </a>
        <SiteHeader />
        <main id="main" className="container-page flex-1">
          {children}
        </main>
        <footer className="border-t border-line-soft bg-surface-soft">
          <div className="container-page flex flex-wrap justify-between gap-6 py-6 text-[0.8125rem] text-muted max-[744px]:flex-col">
            <span>© 2026 UniFound · Mini Project. Gợi ý trùng khớp chỉ để tham khảo, không phải xác nhận sở hữu.</span>
            <nav aria-label="Liên kết cuối trang" className="flex flex-wrap gap-4">
              <Link href="/" className="text-ink no-underline hover:underline">
                Bảng tin
              </Link>
              <Link href="/reports/new" className="text-ink no-underline hover:underline">
                Đăng tin
              </Link>
              <Link href="/my" className="text-ink no-underline hover:underline">
                Của tôi
              </Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
