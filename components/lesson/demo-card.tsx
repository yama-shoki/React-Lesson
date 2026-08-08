"use client";

import { cn } from "@/lib/utils";
import { CircleCheck, Code, TriangleAlert } from "lucide-react";
import { useEffect, useRef } from "react";
import { useCodePane } from "./code-pane-context";

type Tone = "neutral" | "bad" | "good";

const toneStyles: Record<Tone, string> = {
  neutral: "border-border",
  bad: "border-amber-500/50 bg-amber-500/[0.03]",
  good: "border-emerald-500/50 bg-emerald-500/[0.03]",
};

const toneLabel: Record<Tone, { text: string; className: string } | null> = {
  neutral: null,
  bad: { text: "うまくいかない例", className: "text-amber-600" },
  good: { text: "直した例", className: "text-emerald-600" },
};

/**
 * 実際に動くデモを載せる箱。
 *
 * sourcePath を渡すと右上にコードボタンが出て、押すと右のコードペインが
 * そのファイルに切り替わる。このときカードとコードがピンクの線でつながるので、
 * 「画面のどの部分が、どのコードなのか」が一目で分かる。
 *
 * showRenderCount を付けると、そのデモが何回描き直されたかが数字で出て、
 * 描き直された瞬間に枠が光る。目に見えない再レンダリングを見せるための仕掛け。
 */
export const DemoCard = ({
  title,
  description,
  tone = "neutral",
  sourcePath,
  showRenderCount = false,
  children,
}: {
  title: string;
  description?: string;
  tone?: Tone;
  /** このデモの実装ファイル。指定するとコードペインと連動する */
  sourcePath?: string;
  showRenderCount?: boolean;
  children: React.ReactNode;
}) => {
  const { active, pinned, selectSnippet } = useCodePane();
  const label = toneLabel[tone];

  /**
   * 読み進めてこのデモの話題に入ったときと、コードボタンを押したときの両方で光らせる。
   * 「いま解説している画面はここ」「そのコードはこれ」を線で結ぶことで、
   * 文章とコードと画面の三つが同じものを指していると分かる。
   */
  const isPinned =
    sourcePath !== undefined &&
    (pinned === sourcePath || active?.snippetId === sourcePath);

  return (
    <div
      className={cn(
        "not-prose relative my-6 rounded-xl border transition-shadow",
        toneStyles[tone],
        isPinned && "border-pink-500 ring-2 ring-pink-500/40"
      )}
    >
      {showRenderCount && <RenderFlash />}

      {/* カードから右のコードペインへ伸びる線。つながりを目で追えるようにする */}
      {isPinned && (
        <span className="pointer-events-none absolute top-1/2 left-full hidden h-px w-12 bg-pink-500 lg:block" />
      )}

      <div className="rounded-t-xl border-b bg-background/40 px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {tone === "bad" && (
            <TriangleAlert className="size-4 shrink-0 text-amber-600" />
          )}
          {tone === "good" && (
            <CircleCheck className="size-4 shrink-0 text-emerald-600" />
          )}

          <span className="text-sm font-semibold">{title}</span>

          {label && (
            <span className={cn("text-xs font-medium", label.className)}>
              {label.text}
            </span>
          )}

          {showRenderCount && <RenderCount />}

          {sourcePath && (
            <button
              type="button"
              onClick={() => selectSnippet(sourcePath)}
              aria-label="このデモのコードを見る"
              title="このデモのコードを見る"
              className={cn(
                "ml-auto shrink-0 rounded-md border p-1 transition-colors",
                isPinned
                  ? "border-pink-500 text-pink-500"
                  : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Code className="size-3.5" />
            </button>
          )}
        </div>

        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {/* デモ側で毎回 text-sm を書かなくて済むように、ここで文字サイズを決めておく。
          教材のコードは主題だけに集中させたい */}
      <div className="p-4 text-sm">{children}</div>
    </div>
  );
};

/**
 * このカードが何回描き直されたか。
 *
 * 数えた回数を state にすると、表示するために再レンダリングが起きて、
 * それがまた回数を増やす、という無限ループになる。
 * なので回数は ref に持ち、画面への反映は effect の中で DOM を直接書き換えて行う。
 * 「React の外側と同期させる」という、useEffect の本来の用途どおりの使い方。
 */
function RenderCount() {
  const labelRef = useRef<HTMLSpanElement>(null);
  const count = useRef(0);

  useEffect(() => {
    count.current++;
    if (labelRef.current) {
      labelRef.current.textContent = `render ${count.current}`;
    }
  });

  return (
    <span
      ref={labelRef}
      className="font-mono text-xs tabular-nums text-muted-foreground"
    />
  );
}

/** 描き直された瞬間だけ枠を光らせる */
function RenderFlash() {
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = flashRef.current;
    if (!element) return;

    element.style.opacity = "1";
    const timer = setTimeout(() => {
      element.style.opacity = "0";
    }, 120);

    return () => clearTimeout(timer);
  });

  return (
    <div
      ref={flashRef}
      style={{ opacity: 0 }}
      className="pointer-events-none absolute inset-0 z-10 rounded-xl border border-sky-500 bg-sky-500/10 transition-opacity duration-700"
    />
  );
}
