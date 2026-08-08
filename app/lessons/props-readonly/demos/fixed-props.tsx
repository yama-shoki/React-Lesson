"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// 子は値を受け取り、押されたことを伝えるだけ。自分では書き換えない
function Counter({
  count,
  onIncrease,
}: {
  count: number;
  onIncrease: () => void;
}) {
  // このカードが描き直された回数を数えるための 1 行（教材の仕掛け）
  useTrackDemoRender();

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-lg font-semibold tabular-nums">
        {count}
      </span>
      <Button size="sm" onClick={onIncrease}>
        増やす
      </Button>
    </div>
  );
}

// 値を持っているのは親のほう
export function FixedProps() {
  const [count, setCount] = useState(0);

  return <Counter count={count} onIncrease={() => setCount(count + 1)} />;
}
