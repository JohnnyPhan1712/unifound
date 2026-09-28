import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { AuthHeader } from "@/components/auth-header";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "UniFound",
  description: "UniFound giúp sinh viên đăng tin và tìm lại đồ thất lạc trong khuôn viên trường.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className="flex flex-col font-sans antialiased">
        <AuthHeader />
        <main className="mx-auto w-full max-w-[1180px] flex-1 px-2 pt-3 pb-12 sm:px-4 sm:pt-6">
          {children}
        </main>
        <footer className="border-t border-line bg-surface py-5 text-muted">
          <div className="mx-auto flex w-full max-w-[1180px] flex-col justify-between gap-2 px-2 text-[0.8rem] sm:flex-row sm:px-4">
            <strong className="text-ink">UniFound</strong>
            <span>Thông tin liên hệ và chi tiết xác minh không được công khai trên trang tin.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
