import type { Metadata } from "next";
import { Suspense } from "react";
import { Be_Vietnam_Pro } from "next/font/google";
import { HelpWidget } from "@/components/layout/help-widget";
import { SiteFooter } from "@/components/layout/site-footer";
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
    // suppressHydrationWarning: extension trình duyệt có thể đổi thuộc tính của <html>/<body> trước khi hydrate
    <html lang="vi" className={font.variable} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col font-sans" suppressHydrationWarning>
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
        <SiteFooter />
        <Suspense>
          <HelpWidget />
        </Suspense>
      </body>
    </html>
  );
}
