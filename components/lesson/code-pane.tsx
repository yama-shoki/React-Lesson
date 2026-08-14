"use client";

import type { Snippet } from "@/lib/code";
import { cn } from "@/lib/utils";
import { Maximize2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CodeBlock } from "./code-block";
import { useCodePane } from "./code-pane-context";

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
          "focus-ring rounded-md px-2.5 py-1 font-mono text-xs transition-colors",
          snippet.id === currentId
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        {snippet.label}
      </button>
    ))}
  </div>
);

/** 拡大・閉じるなど、コードペインの隅に置く小さなボタン */
const IconButton = ({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    className="focus-ring shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
  >
    {children}
  </button>
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

  const tabs = (
    <FileTabs
      snippets={snippets}
      currentId={current.id}
      onSelect={selectSnippet}
    />
  );

  return (
    <>
      <div className="flex h-full flex-col gap-2">
        <div className="flex items-start gap-2">
          {tabs}
          <IconButton label="コードを拡大する" onClick={() => setExpanded(true)}>
            <Maximize2 className="size-4" />
          </IconButton>
        </div>

        {/*
          コードの枠は画面の高さいっぱいに広げる。
          中身の高さに合わせて縮めてしまうと、デモカードから伸びる線が
          枠の外を通ってしまい、どこにつながっているのか分からなくなる。
        */}
        <CodeBlock
          snippet={current}
          lines={lines}
          scrollToHighlight
          className="min-h-0 flex-1"
        />
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
            {/* 画面幅いっぱいに広げるとコードが左端に貼り付いて読みにくいので、中央に収める */}
            <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col gap-2">
              <div className="flex items-start gap-2">
                {tabs}
                <IconButton label="閉じる" onClick={() => setExpanded(false)}>
                  <X className="size-4" />
                </IconButton>
              </div>

              <CodeBlock
                snippet={current}
                lines={lines}
                className="min-h-0 flex-1"
              />
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
 * 画面が狭くて右ペインを置けないときに、解説の直後へ差し込むコード。
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
      {/*
        狭い画面では枠が 70dvh で切られる。光っている行が枠の外だと
        「解説と光った行の対応」という仕掛けそのものが効かないので、
        右ペインと同じように該当行まで寄せる
      */}
      <CodeBlock
        snippet={snippet}
        lines={lines}
        scrollToHighlight
        className="max-h-[70dvh]"
      />
    </div>
  );
};
