"use client";

import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// 子は値を受け取って表示するだけ。自分では持たない
function Panel({
  label,
  count,
  onIncrease,
}: {
  label: string;
  count: number;
  onIncrease: () => void;
}) {
  return (
    <RenderBox title={label}>
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono font-semibold tabular-nums">{count}</span>
        <Button size="sm" onClick={onIncrease}>
          増やす
        </Button>
      </div>
    </RenderBox>
  );
}

// 共通の親が値を持つ
export function LiftedState() {
  const [count, setCount] = useState(0);
  const increase = () => setCount((current) => current + 1);

  return (
    <div className="flex flex-col gap-2.5">
      <Panel label="上のパネル" count={count} onIncrease={increase} />
      <Panel label="下のパネル" count={count} onIncrease={increase} />
    </div>
  );
}
