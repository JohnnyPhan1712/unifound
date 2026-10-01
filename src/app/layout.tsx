import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UniFound",
  description: "UniFound giúp sinh viên đăng tin và tìm lại đồ thất lạc trong khuôn viên trường.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
