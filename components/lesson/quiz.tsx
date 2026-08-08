"use client";

import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
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
    <div className="not-prose my-6 rounded-xl border bg-muted/30 p-4">
      <p className="mb-3 text-sm font-semibold">{question}</p>

      <ul className="flex flex-col gap-2">
        {options.map((option, index) => {
          const isSelected = selected === index;
          const revealed = answered;

          return (
            <li key={option.label}>
              <button
                type="button"
                onClick={() => setSelected(index)}
                aria-pressed={isSelected}
                className={cn(
                  "flex w-full items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                  !revealed && "hover:bg-background",
                  revealed && option.correct && "border-emerald-500/60 bg-emerald-500/[0.07]",
                  revealed && !option.correct && isSelected && "border-red-500/60 bg-red-500/[0.07]",
                  revealed && !option.correct && !isSelected && "opacity-55"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full border text-[0.625rem] font-mono",
                    revealed && option.correct && "border-emerald-500 bg-emerald-500 text-white",
                    revealed && !option.correct && isSelected && "border-red-500 bg-red-500 text-white"
                  )}
                >
                  {revealed && option.correct ? (
                    <Check className="size-3" strokeWidth={3} />
                  ) : revealed && isSelected ? (
                    <X className="size-3" strokeWidth={3} />
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block">{option.label}</span>
                  {revealed && (
                    <span className="mt-1 block text-[0.813rem] leading-relaxed text-muted-foreground">
                      {option.explanation}
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {answered && (
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="mt-3 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          選び直す
        </button>
      )}
    </div>
  );
};
