import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "［公開顯示名稱］｜從物理、科技與系統理解世界";
const description = "一個記錄長期好奇心、跨領域思考、學習方法與生活價值的個人數碼花園。";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    title,
    description,
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "zh_HK",
      images: [{ url: new URL("/og.png", origin).toString(), alt: "［公開顯示名稱］的個人數碼花園" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [new URL("/og.png", origin).toString()],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
