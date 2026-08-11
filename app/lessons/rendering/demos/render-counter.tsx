"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function RenderCounter() {
  const [count, setCount] = useState(0);
  useTrackDemoRender();

  return (
    <div className="flex flex-col gap-4">
      <p>このコンポーネントは {count} 回ボタンを押されました。</p>
      <Button size="sm" onClick={() => setCount((current) => current + 1)}>
        再レンダリングする
      </Button>
    </div>
  );
}
