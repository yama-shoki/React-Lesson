"use client";

import { useEffect, useMemo, useRef } from "react";
import { useCodePane } from "./code-pane-context";
import { InlineCode } from "./code-pane";

/**
 * 解説文のひとかたまり。
 *
 * このセクションが画面の読みやすい位置に来ると、
 * 右のコードペインが snippet で指定したファイルに切り替わり、
 * lines で指定した行が光る。読者は何も操作しなくていい。
 */
export const LessonSection = ({
  id,
  snippet,
  lines,
  children,
}: {
  /** 見出しへのアンカー用 */
  id?: string;
  /** 右ペインに出したいファイル（lib/code.ts に渡したパスと同じもの） */
  snippet: string;
  /** 光らせたい行。[開始, 終了] で両端を含む */
  lines?: readonly [number, number];
  children: React.ReactNode;
}) => {
  const ref = useRef<HTMLElement>(null);
  const { registerSection } = useCodePane();

  // 配列をそのまま依存配列に入れると毎回別物として扱われるので、数値に開いておく
  const start = lines?.[0];
  const end = lines?.[1];

  const code = useMemo(
    () => ({
      snippetId: snippet,
      lines: start !== undefined && end !== undefined
        ? ([start, end] as const)
        : undefined,
    }),
    [snippet, start, end]
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    return registerSection(element, code);
  }, [registerSection, code]);

  return (
    <section ref={ref} id={id} className="scroll-mt-24">
      {children}
      {/* 画面が狭くて右ペインを置けないときは、解説の直後にコードを差し込む */}
      <InlineCode snippetId={snippet} lines={code.lines} />
    </section>
  );
};
