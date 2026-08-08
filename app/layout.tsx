import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
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
      // next-themes がマウント前に class を書き換えるため、差分の警告を抑える
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <ThemeProvider>
          <SidebarProvider>
            <AppSidebar />
            <main className="relative min-w-0 flex-1">
              {/*
                サイドバーは畳める（Cmd + B でも切り替わる）。
                畳むと本文とコードの両方が広がるので、読むことに集中したいときに効く。
                高さ 0 の器に入れて、本文のレイアウトを押し下げないようにしている。
              */}
              <div className="sticky top-0 z-40 flex h-0 items-start">
                <SidebarTrigger className="mt-2.5 ml-2.5 bg-background/70 text-muted-foreground backdrop-blur" />
              </div>
              {children}
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
