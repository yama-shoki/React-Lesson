"use client";

import { cn } from "@/lib/utils";
import type { Snippet } from "@/lib/code";
import { useEffect, useRef } from "react";
import { useCodePane } from "./code-pane-context";

/**
 * shiki が作った HTML を描画し、指定された行だけを光らせる。
 *
 * shiki の出力には各行に data-line が入っているので（lib/code.ts の transformer）、
 * それを目印にして DOM 側で属性を付け替えている。
 * 行が変わるたびにサーバーへ問い合わせに行く必要がない。
 */
const CodeBlock = ({
  snippet,
  lines,
  scrollToHighlight,
}: {
  snippet: Snippet;
  lines?: readonly [number, number];
  /** 右ペインでは光った行まで自動で送る。インライン表示では動かさない */
  scrollToHighlight?: boolean;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const start = lines?.[0];
  const end = lines?.[1];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const pre = container.querySelector("pre");
    // 光らせる行があるときだけ、それ以外の行を薄くする
    pre?.setAttribute("data-dimmed", start !== undefined ? "true" : "false");

    let firstActive: HTMLElement | null = null;

    for (const line of container.querySelectorAll<HTMLElement>("[data-line]")) {
      const lineNumber = Number(line.dataset.line);
      const isActive =
        start !== undefined && end !== undefined
          ? lineNumber >= start && lineNumber <= end
          : false;

      line.dataset.active = String(isActive);
      if (isActive && !firstActive) firstActive = line;
    }

    if (!scrollToHighlight || !firstActive) return;

    // scrollIntoView は祖先のスクロール位置まで動かしてしまい、
    // 読んでいる本文が飛ぶことがある。このコンテナだけを動かす
    const target = firstActive.offsetTop - container.clientHeight / 2;
    container.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
  }, [snippet.id, start, end, scrollToHighlight]);

  return (
    <div
      ref={scrollRef}
      className="code-scroll relative overflow-auto rounded-lg border bg-[var(--code-bg)]"
    >
      {/*
        ここに入るのは、このリポジトリのソースファイルを shiki がハイライトした HTML だけ。
        shiki はコード中の記号をエスケープしたうえで <span> を組み立てるので、
        外部からの入力が混ざる経路はない。
      */}
      <div dangerouslySetInnerHTML={{ __html: snippet.html }} />
    </div>
  );
};

/** 右ペイン本体。解説のスクロールに合わせて中身が入れ替わる */
export const CodePane = () => {
  const { snippets, active, selectSnippet } = useCodePane();
  const current =
    snippets.find((snippet) => snippet.id === active?.snippetId) ?? snippets[0];

  if (!current) return null;

  return (
    <div className="flex h-full flex-col gap-2">
      {snippets.length > 1 && (
        <div className="flex flex-wrap items-center gap-1">
          {snippets.map((snippet) => (
            <button
              key={snippet.id}
              type="button"
              onClick={() => selectSnippet(snippet.id)}
              className={cn(
                "rounded-md px-2.5 py-1 font-mono text-xs transition-colors",
                snippet.id === current.id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              {snippet.label}
            </button>
          ))}
        </div>
      )}

      <CodeBlock
        snippet={current}
        lines={active?.snippetId === current.id ? active.lines : undefined}
        scrollToHighlight
      />
    </div>
  );
};

/**
 * 画面が狭いときに、解説の直後へ差し込むコード。
 * 右ペインと同じデータを使うので、内容がズレることはない。
 */
export const InlineCode = ({
  snippetId,
  lines,
}: {
  snippetId: string;
  lines?: readonly [number, number];
}) => {
  const { snippets } = useCodePane();
  const snippet = snippets.find((item) => item.id === snippetId);

  if (!snippet) return null;

  return (
    <div className="mt-4 lg:hidden">
      <p className="mb-1.5 font-mono text-xs text-muted-foreground">
        {snippet.label}
      </p>
      <CodeBlock snippet={snippet} lines={lines} />
    </div>
  );
};
