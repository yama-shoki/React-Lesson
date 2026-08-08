"use client";

import { cn } from "@/lib/utils";
import type { Snippet } from "@/lib/code";
import { Maximize2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useCodePane } from "./code-pane-context";

/**
 * shiki が作った HTML を描画し、指定された行に色を乗せる。
 *
 * shiki の出力には各行に data-line が入っているので（lib/code.ts の transformer）、
 * それを目印にして DOM 側で属性を付け替えている。
 * 行が変わるたびにサーバーへ問い合わせに行く必要がない。
 */
const CodeBlock = ({
  snippet,
  lines,
  scrollToHighlight,
  expanded,
}: {
  snippet: Snippet;
  lines?: readonly [number, number];
  /** 右ペインでは注目行まで自動で送る。インライン表示では動かさない */
  scrollToHighlight?: boolean;
  expanded?: boolean;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const start = lines?.[0];
  const end = lines?.[1];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

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

    if (!scrollToHighlight) return;

    // 注目行がないとき（ファイル全体を見せるとき）は先頭から読ませる。
    // 前に見ていた位置が残っていると、いきなり途中から始まって戸惑う
    if (!firstActive) {
      container.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // scrollIntoView は祖先のスクロール位置まで動かしてしまい、
    // 読んでいる本文が飛ぶことがある。このコンテナだけを動かす
    const target = firstActive.offsetTop - container.clientHeight / 2;
    container.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
  }, [snippet.id, start, end, scrollToHighlight]);

  return (
    <div
      ref={scrollRef}
      data-expanded={expanded ? "true" : undefined}
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

/** ファイル名のタブ */
const FileTabs = ({
  snippets,
  currentId,
  onSelect,
}: {
  snippets: Snippet[];
  currentId: string;
  onSelect: (id: string) => void;
}) => (
  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
    {snippets.map((snippet) => (
      <button
        key={snippet.id}
        type="button"
        onClick={() => onSelect(snippet.id)}
        className={cn(
          "rounded-md px-2.5 py-1 font-mono text-xs transition-colors",
          snippet.id === currentId
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:bg-muted"
        )}
      >
        {snippet.label}
      </button>
    ))}
  </div>
);

/** 右ペイン本体。解説のスクロールに合わせて中身が入れ替わる */
export const CodePane = () => {
  const { snippets, active, selectSnippet } = useCodePane();
  const [expanded, setExpanded] = useState(false);

  const current =
    snippets.find((snippet) => snippet.id === active?.snippetId) ?? snippets[0];

  // 拡大表示は Esc で閉じられるようにしておく
  useEffect(() => {
    if (!expanded) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expanded]);

  if (!current) return null;

  const lines = active?.snippetId === current.id ? active.lines : undefined;

  return (
    <>
      <div className="flex h-full flex-col gap-2">
        <div className="flex items-start gap-2">
          <FileTabs
            snippets={snippets}
            currentId={current.id}
            onSelect={selectSnippet}
          />
          <button
            type="button"
            onClick={() => setExpanded(true)}
            aria-label="コードを拡大する"
            title="コードを拡大する"
            className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Maximize2 className="size-4" />
          </button>
        </div>

        <CodeBlock snippet={current} lines={lines} scrollToHighlight />
      </div>

      {/*
        拡大パネルは body の直下に出す。
        この場所のまま fixed にすると、サイドバーやヘッダーの下に潜り込んでしまう
        （祖先の配置やぼかしが fixed の基準を作ってしまうため）。
      */}
      {expanded &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex flex-col gap-2 bg-background p-4 md:p-8">
            <div className="flex items-start gap-2">
              <FileTabs
                snippets={snippets}
                currentId={current.id}
                onSelect={selectSnippet}
              />
              <button
                type="button"
                onClick={() => setExpanded(false)}
                aria-label="閉じる"
                className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="min-h-0 flex-1">
              <CodeBlock snippet={current} lines={lines} expanded />
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Esc で閉じる
            </p>
          </div>,
          document.body
        )}
    </>
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
