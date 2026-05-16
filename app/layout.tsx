import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
// 💡 先ほど作ったヘッダーを読み込む
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "無駄を楽しむジェネレーター",
  description: "日常に無駄で彩りを",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ja">
        <body className={inter.className}>
          {/* 💡 全ページの共通パーツとしてヘッダーを配置 */}
          <Header />
          {/* 💡 各ページの中身はここに表示される */}
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}



