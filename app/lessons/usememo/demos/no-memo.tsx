"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { heavyCalculation } from "./heavy";

export function NoMemo() {
  useTrackDemoRender();

  const [count, setCount] = useState(0);
  const [keyword, setKeyword] = useState("");

  // 描き直されるたびに、毎回この計算が走る
  const total = heavyCalculation(count);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border p-3">
        <p className="font-mono">count: {count}</p>
        <p className="font-mono text-muted-foreground">計算結果: {total}</p>
      </div>

      <Button size="sm" onClick={() => setCount((c) => c + 1)}>
        count を増やす
      </Button>

      <Input
        placeholder="ここに文字を打ってみる（計算とは無関係）"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
      />
    </div>
  );
}
