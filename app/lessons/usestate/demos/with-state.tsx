"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export function WithState() {
  // React に「この値を覚えておいて」と預ける
  const [count, setCount] = useState(0);

  const increase = () => {
    // 直接書き換えず、React に「こう変えて」と伝える
    setCount(count + 1);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-lg font-semibold tabular-nums">
        {count}
      </span>
      <Button size="sm" onClick={increase}>
        増やす
      </Button>
      <Button size="sm" variant="outline" onClick={() => setCount(0)}>
        リセット
      </Button>
    </div>
  );
}
