"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const LIMIT = 50;

export function ObjectLoop() {
  useTrackDemoRender();

  const [running, setRunning] = useState(false);
  const [count, setCount] = useState(0);

  // 描き直されるたびに新しく作られるオブジェクト。
  // 中身は毎回同じでも、React から見ると「別のもの」
  const options = { unit: "回" };

  useEffect(() => {
    if (!running) return;
    if (count >= LIMIT) return;

    // count は依存配列に入っていないのに、それでも止まらない
    setCount((current) => current + 1);
  }, [running, options, count]);

  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-md border p-3 font-mono">
        count: {count} {options.unit}
      </p>

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
