"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Updater() {
  // このカードが描き直された回数を数えるための 1 行（教材の仕掛け）
  useTrackDemoRender();

  const [count, setCount] = useState(0);

  const addThree = () => {
    // 値ではなく「いまの値をどう変えるか」を渡す。
    // React が順番に適用するので、3 回ぶんが積み上がる
    setCount((current) => current + 1);
    setCount((current) => current + 1);
    setCount((current) => current + 1);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-lg font-semibold tabular-nums">
        {count}
      </span>
      <Button size="sm" onClick={addThree}>
        3 増やす
      </Button>
      <Button size="sm" variant="outline" onClick={() => setCount(0)}>
        リセット
      </Button>
    </div>
  );
}
