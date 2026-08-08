"use client";

import type { Snippet } from "@/lib/code";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

/**
 * shiki が作った HTML を描画し、指定された行に色を乗せる。
 *
 * shiki の出力には各行に data-line が入っているので（lib/code.ts の transformer）、
 * それを目印にして DOM 側で属性を付け替えている。
 * 行が変わるたびにサーバーへ問い合わせに行く必要がない。
 */
export const CodeBlock = ({
  snippet,
  lines,
  scrollToHighlight,
  className,
}: {
  snippet: Snippet;
  lines?: readonly [number, number];
  /** 右ペインでは注目行まで自動で送る。本文中に置くときは動かさない */
  scrollToHighlight?: boolean;
  /** 高さの決め方は置かれる場所によって違うので、外から渡す */
  className?: string;
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
      // 線の行き先になるのは右ペインだけ（本文中や拡大表示は対象外）
      data-code-pane={scrollToHighlight ? "" : undefined}
      className={cn(
        "code-scroll relative overflow-auto rounded-lg border bg-[var(--code-bg)]",
        className
      )}
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
