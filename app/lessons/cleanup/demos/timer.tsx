"use client";

import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

function Clock() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);

    // 表示をやめるときにタイマーを止める。
    // これを書かないと、消えたあともタイマーだけが動き続ける
    return () => clearInterval(timer);
  }, []);

  // 毎秒描き直されるのはこの部品。1 秒ごとに光る
  return <RenderBox title="Clock">表示してから {seconds} 秒</RenderBox>;
}

export function Timer() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      {isVisible ? (
        <Clock />
      ) : (
        <p className="rounded-md border p-3 text-muted-foreground">
          非表示（タイマーは止まっている）
        </p>
      )}

      <Button size="sm" onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? "隠す" : "表示する"}
      </Button>
    </div>
  );
}
