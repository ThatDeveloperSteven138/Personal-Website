import type { Metadata } from "next";
import "./globals.css";

const title = "［公開顯示名稱］｜從物理、科技與系統理解世界";
const description = "一個記錄長期好奇心、跨領域思考、學習方法與生活價值的個人數碼花園。";
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title,
  description,
  icons: {
    icon: `${siteUrl}/favicon.svg`,
    shortcut: `${siteUrl}/favicon.svg`,
  },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "zh_HK",
    images: [{ url: `${siteUrl}/og.png`, alt: "［公開顯示名稱］的個人數碼花園" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${siteUrl}/og.png`],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
