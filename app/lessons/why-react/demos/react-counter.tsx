"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ReactCounter() {
  // このカードが描き直された回数を数えるための 1 行（教材の仕掛け）
  useTrackDemoRender();

  const [count, setCount] = useState(0);

  return (
    <div className="flex items-center gap-4">
      <p className="font-mono text-lg font-semibold tabular-nums">{count}</p>

      <Button size="sm" onClick={() => setCount(count + 1)}>
        増やす
      </Button>
      <Button size="sm" variant="outline" onClick={() => setCount(0)}>
        リセット
      </Button>
    </div>
  );
}
