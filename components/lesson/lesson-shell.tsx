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
      {/*
        画面が狭いうちは左右を等分する。コード側だけ極端に細くなると折り返しだらけになるため。
        広い画面では本文を 46rem（日本語で 1 行 40 字前後）で止めて、
        余った幅はすべてコード側に回す。本文はこれ以上広げても読みにくくなるだけ。
      */}
      <div className="mx-auto grid w-full max-w-[1680px] gap-x-12 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:pl-14 xl:px-10 2xl:grid-cols-[minmax(0,46rem)_minmax(0,1fr)]">
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
