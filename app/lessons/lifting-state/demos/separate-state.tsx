"use client";

import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// それぞれが自分の state を持っている
function Panel({ label }: { label: string }) {
  const [count, setCount] = useState(0);

  return (
    <RenderBox title={label}>
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono font-semibold tabular-nums">{count}</span>
        <Button size="sm" onClick={() => setCount((current) => current + 1)}>
          増やす
        </Button>
      </div>
    </RenderBox>
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
