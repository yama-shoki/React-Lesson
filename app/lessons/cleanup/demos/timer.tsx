"use client";

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

  return (
    <p className="rounded-md border p-3 font-mono">
      表示してから {seconds} 秒
    </p>
  );
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
