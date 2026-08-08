"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Snapshot() {
  const [count, setCount] = useState(0);

  const addThree = () => {
    // 3 回呼んでいるが、この関数の中では count はずっと同じ値のまま。
    // 3 回とも「0 + 1」を依頼していることになる
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-lg font-semibold tabular-nums">
        {count}
      </span>
      <Button size="sm" onClick={addThree}>
        3 増やすつもり
      </Button>
      <Button size="sm" variant="outline" onClick={() => setCount(0)}>
        リセット
      </Button>
    </div>
  );
}
