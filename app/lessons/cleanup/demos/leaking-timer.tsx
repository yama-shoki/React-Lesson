"use client";

import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

// 秒を数えている「誰か」の人数。片付け忘れが目に見えるようにするための計器で、
// React の機能ではない
let running = 0;

function LeakingClock() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    running++;

    // 止める手段（返り値）を受け取ってすらいない。
    // ここに後片付けを書いていないので、隠しても動き続ける
    setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);
  }, []);

  return (
    <RenderBox title="Clock（後片付けなし）">
      表示してから {seconds} 秒
    </RenderBox>
  );
}

export function LeakingTimer() {
  const [isVisible, setIsVisible] = useState(true);
  const [reported, setReported] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {isVisible ? (
        <LeakingClock />
      ) : (
        <p className="rounded-md border p-3 text-muted-foreground">
          非表示（でも、タイマーは動いたまま）
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? "隠す" : "表示する"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setReported(running)}
        >
          動いているタイマーを数える
        </Button>
      </div>

      <p className="rounded-md border p-3 font-mono text-sm">
        動いているタイマー: {reported} 本
      </p>
    </div>
  );
}
