"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function Child() {
  useTrackDemoRender();

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
      <p className="font-semibold">子コンポーネント</p>
      <p>この子は props を受け取っていません。</p>
    </div>
  );
}

export function ParentRerendersChild() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p>親のカウント: {count}</p>
        <Button size="sm" onClick={() => setCount((current) => current + 1)}>
          親を更新する
        </Button>
      </div>
      <Child />
    </div>
  );
}
