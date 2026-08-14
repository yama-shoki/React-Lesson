"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

/*
  わざと無限ループになる書き方を見せている。
  本来 lint に止められるので、このファイルだけ黙らせている。
*/
/* eslint-disable react-hooks/set-state-in-effect */

// 教材用の安全装置。これがなければ、ブラウザが固まるまで止まらない
const LIMIT = 50;

export function Loop() {
  useTrackDemoRender();

  const [running, setRunning] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!running) return;
    if (count >= LIMIT) return; // ← この 1 行がなければ止まらない

    // 依存配列に入っている count を、その中で更新している
    setCount(count + 1);
  }, [count, running]);

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
