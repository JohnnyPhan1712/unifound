import type { Metadata } from "next";
import { AuthHeader } from "@/components/auth-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "UniFound - Campus Lost & Found",
  description: "Nền tảng hỗ trợ sinh viên đăng tin và tìm lại đồ thất lạc trong khuôn viên trường.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <AuthHeader />
        <div className="main-content-wrapper">{children}</div>
      </body>
    </html>
  );
}