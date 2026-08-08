"use client";

import type { Snippet } from "@/lib/code";
import { CodePane } from "./code-pane";
import { CodePaneProvider } from "./code-pane-context";

/**
 * レッスンページの外枠。左に読み物、右に追従するコード。
 *
 * children はサーバー側で組み立てた解説がそのまま入ってくる。
 * このコンポーネント自体はクライアントだが、children を「受け取って置くだけ」なので
 * 解説の中身はサーバーコンポーネントのままでいられる。
 * （Part 2「合成」で扱うテクニックを、この教材自身が使っている）
 */
export const LessonShell = ({
  snippets,
  children,
}: {
  snippets: Snippet[];
  children: React.ReactNode;
}) => {
  return (
    <CodePaneProvider snippets={snippets}>
      <div className="mx-auto grid w-full max-w-[1680px] gap-x-12 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] xl:px-10">
        <article className="lesson-prose min-w-0 py-12 lg:py-16">
          {children}
        </article>

        <aside className="sticky top-0 hidden h-dvh py-6 lg:block">
          <CodePane />
        </aside>
      </div>
    </CodePaneProvider>
  );
};
