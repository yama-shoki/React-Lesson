"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { mountCounter } from "./vanilla-counter";

/**
 * 素の JavaScript 版を、実際に動かして見せるための入れ物。
 * 読者に見せるのは vanilla-counter.ts のほう。
 *
 * React のデモではないので、レンダー回数は数えない。
 */
export function VanillaCounter() {
  const rootRef = useRef<HTMLDivElement>(null);
  const readCount = useRef<() => number>(() => 0);

  const [forgetRender, setForgetRender] = useState(false);
  const [peeked, setPeeked] = useState<number | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    readCount.current = mountCounter(rootRef.current, forgetRender);
    setPeeked(null);
    // スイッチを切り替えたら、素の JS 側を組み直す
  }, [forgetRender]);

  return (
    <div className="flex flex-col gap-3">
      {/* この中は React が管理していない。素の JS が直接書き換える */}
      <div ref={rootRef} key={String(forgetRender)} className="flex items-center gap-4">
        <p
          id="count"
          className="font-mono text-lg font-semibold tabular-nums"
        />
        <Button id="increment" size="sm">
          増やす
        </Button>
        <Button id="reset" size="sm" variant="outline">
          リセット
        </Button>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={forgetRender}
          onChange={(event) => setForgetRender(event.target.checked)}
        />
        リセットのところで <code>render()</code> を書き忘れる
      </label>

      {forgetRender && (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPeeked(readCount.current())}
          >
            いまの値を確かめる
          </Button>
          {peeked !== null && (
            <span className="text-sm">
              変数の中身は <strong className="font-mono">{peeked}</strong>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
