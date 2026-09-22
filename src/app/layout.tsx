import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UniFound",
  description: "Lost and found reports for students.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}