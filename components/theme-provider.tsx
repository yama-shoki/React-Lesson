"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * OS の外観設定（ライト / ダーク）に合わせて html に .dark を付ける。
 * 画面上に切り替えボタンは置いていないので、読者の環境設定にそのまま従う。
 */
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <NextThemesProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    {children}
  </NextThemesProvider>
);
