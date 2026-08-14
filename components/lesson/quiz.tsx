"use client";

import { cn } from "@/lib/utils";
import { Check, CircleHelp, X } from "lucide-react";
import { useState } from "react";

export type QuizOption = {
  label: string;
  correct?: boolean;
  /** 選んだあとに出る一言。なぜ正しいのか、なぜ違うのか */
  explanation: string;
};

/**
 * 読む手を止めずに理解度だけ確かめるための小さな問題。
 * 正解しても不正解でも、全部の選択肢の解説が読めるようにしてある。
 */
export const Quiz = ({
  question,
  options,
}: {
  question: string;
  options: QuizOption[];
}) => {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

  return (
    <div className="not-prose my-7 rounded-xl border bg-card p-5 shadow-sm">
      {/* 本文の流れの中に置かれるので、ひと目で「問題だ」と分かる印を付ける */}
      <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground">
        <CircleHelp className="size-3.5" />
        確認クイズ
      </p>

      <p className="mb-4 text-[0.938rem] leading-relaxed font-semibold">
        {question}
      </p>

      {/* 枠のある要素を縦に並べるときは、線どうしが近づいて余白が潰れて見える。
          文字の行間より広めにとる */}
      <ul className="flex flex-col gap-3.5">
        {options.map((option, index) => {
          const isSelected = selected === index;

          return (
            <li key={option.label}>
              <button
                type="button"
                onClick={() => setSelected(index)}
                aria-pressed={isSelected}
                className={cn(
                  "focus-ring flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                  !answered && "hover:border-foreground/30 hover:bg-muted/60",
                  answered &&
                    option.correct &&
                    "border-emerald-500/60 bg-emerald-500/[0.06]",
                  answered &&
                    !option.correct &&
                    isSelected &&
                    "border-red-500/60 bg-red-500/[0.06]",
                  answered &&
                    !option.correct &&
                    !isSelected &&
                    "border-border/60"
                )}
              >
                <span
                  className={cn(
                    "mt-px flex size-5 shrink-0 items-center justify-center rounded-full border font-mono text-[0.625rem]",
                    answered &&
                      option.correct &&
                      "border-emerald-500 bg-emerald-500 text-white",
                    answered &&
                      !option.correct &&
                      isSelected &&
                      "border-red-500 bg-red-500 text-white"
                  )}
                >
                  {answered && option.correct ? (
                    <Check className="size-3" strokeWidth={3} />
                  ) : answered && isSelected ? (
                    <X className="size-3" strokeWidth={3} />
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
                  {/*
                    正誤は枠の色とアイコンだけで示している。
                    アイコンは読み上げの対象外なので、答えたあとは
                    A・B の文字も消えて手がかりがゼロになってしまう。
                    見た目は変えずに、読み上げ用の言葉だけ添えておく。
                  */}
                  {answered && (
                    <span className="sr-only">
                      {option.correct
                        ? "正解の選択肢。"
                        : isSelected
                          ? "あなたが選んだ、不正解の選択肢。"
                          : "不正解の選択肢。"}
                    </span>
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block leading-relaxed",
                      // 選ばなかった誤答は、ラベルだけ控えめにする。
                      // 解説は「なぜ違うのか」を読ませたいので薄くしない
                      answered &&
                        !option.correct &&
                        !isSelected &&
                        "text-muted-foreground",
                    )}
                  >
                    {option.label}
                  </span>
                  {answered && (
                    <span className="mt-1.5 block text-[0.813rem] leading-relaxed text-foreground/75">
                      {option.explanation}
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* 答えた瞬間に、結果をひとこと読み上げる */}
      {answered && (
        <p role="status" className="sr-only">
          {options[selected].correct ? "正解です。" : "不正解です。"}
        </p>
      )}

      {answered && (
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="mt-3.5 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          選び直す
        </button>
      )}
    </div>
  );
};
