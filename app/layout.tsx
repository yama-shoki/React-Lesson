import { AppSidebar } from "@/components/app-sidebar";
import { PageTitle } from "@/components/page-title";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/**
 * Geist には日本語のグリフが入っていないので、日本語部分は fallback に並べた
 * OS 標準フォントで表示される。本文が日本語主体なのでここは丁寧に指定しておく。
 */
const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  fallback: [
    "Hiragino Sans",
    "Hiragino Kaku Gothic ProN",
    "BIZ UDPGothic",
    "Yu Gothic",
    "Meiryo",
    "sans-serif",
  ],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "React 入門 — 仕組みから理解する",
    template: "%s | React 入門",
  },
  description:
    "JavaScript があやしくても読み進められる React + TypeScript の入門教材。左に解説、右に動くコード。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      // 目次から章へ飛ぶときに滑らかにスクロールさせる（Next.js 16 では明示指定が必要）
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SidebarProvider>
          <AppSidebar />
          <main className="relative min-w-0 flex-1">
            {/*
              いま読んでいる章を常に画面上部に出しておく。
              長い章を読み進めても、自分がどこにいるか見失わないようにするため。
              サイドバーの開閉ボタンもここに置く（Cmd + B でも切り替わる）。
            */}
            <header className="sticky top-0 z-40 flex h-12 items-center gap-2 border-b bg-background/95 px-3 backdrop-blur">
              <SidebarTrigger className="shrink-0 text-muted-foreground" />
              <PageTitle />
            </header>
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
