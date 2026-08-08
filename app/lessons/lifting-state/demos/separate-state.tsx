"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// それぞれが自分の state を持っている
function Panel({ label }: { label: string }) {
  // このパネルが描き直された回数を数えるための 1 行（教材の仕掛け）
  useTrackDemoRender();

  const [count, setCount] = useState(0);

  return (
    <div className="flex items-center justify-between gap-3 rounded-md border p-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-semibold tabular-nums">{count}</span>
      <Button size="sm" onClick={() => setCount(count + 1)}>
        増やす
      </Button>
    </div>
  );
}

export function SeparateState() {
  return (
    <div className="flex flex-col gap-2.5">
      <Panel label="上のパネル" />
      <Panel label="下のパネル" />
    </div>
  );
}
