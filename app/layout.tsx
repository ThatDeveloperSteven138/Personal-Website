import type { Metadata } from "next";
import "./globals.css";

const title = "That Developer Steven | Understanding the world through physics, technology, and systems";
const description = "A personal digital garden about long-term curiosity, cross-disciplinary thinking, learning, and life values.";
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title,
  description,
  icons: {
    icon: [{ url: `${siteUrl}/brand-avatar.png`, type: "image/png", sizes: "576x576" }],
    shortcut: `${siteUrl}/brand-avatar.png`,
    apple: [{ url: `${siteUrl}/brand-avatar.png`, type: "image/png", sizes: "576x576" }],
  },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_HK",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
