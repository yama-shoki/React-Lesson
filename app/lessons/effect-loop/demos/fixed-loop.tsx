"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function FixedLoop() {
  useTrackDemoRender();

  const [running, setRunning] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!running) return;

    // 一度だけタイマーを仕掛けて、あとは任せる。
    // 関数を渡す形なので、count を依存配列に入れる必要がない
    const timer = setInterval(() => {
      setCount((current) => current + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [running]); // running が変わったときだけ動く

  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-md border p-3 font-mono">count: {count}</p>

      <div className="flex gap-2">
        <Button size="sm" onClick={() => setRunning(!running)}>
          {running ? "止める" : "動かしてみる"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setRunning(false);
            setCount(0);
          }}
        >
          最初から
        </Button>
      </div>
    </div>
  );
}
