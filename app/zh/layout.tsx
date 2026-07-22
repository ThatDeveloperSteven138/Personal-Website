import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "That Developer Steven｜從物理、科技與系統理解世界",
  description: "一個記錄長期好奇心、跨領域思考、學習方法與生活價值的個人數碼花園。",
  openGraph: {
    locale: "zh_HK",
  },
};

export default function ChineseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
