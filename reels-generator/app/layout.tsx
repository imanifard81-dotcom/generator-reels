import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ریلز ساز آموزشی",
  description: "ساخت پرامپت تصویر برای ریلزهای آموزشی",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
