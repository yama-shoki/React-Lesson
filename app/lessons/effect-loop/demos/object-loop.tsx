"use client";

/*
  この章の題材そのもの。lint は「options を useMemo で包め」と言ってくるが、
  ここでは「包まないと何が起きるか」を見せたいので、わざと従っていない。
  effect の中で setState しているのも同じ理由。
*/
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */

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

    // count は依存配列に入っていない。それでも止まらない
    setCount((current) => (current >= LIMIT ? current : current + 1));
  }, [running, options]);

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
