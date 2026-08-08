"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export function DuplicatedState() {
  const [items, setItems] = useState(["りんご"]);
  // 件数も state として別に持ってしまっている
  const [count, setCount] = useState(1);

  const add = () => {
    setItems([...items, "りんご"]);
    setCount(count + 1); // 2 か所を手で合わせている
  };

  const clear = () => {
    setItems([]);
    // ここで setCount(0) を書き忘れた。件数だけが残る
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border p-3">
        <p>件数: {count}</p>
        <p className="text-muted-foreground">
          中身: {items.length === 0 ? "（空）" : items.join(", ")}
        </p>
      </div>

      <div className="flex gap-2">
        <Button size="sm" onClick={add}>
          増やす
        </Button>
        <Button size="sm" variant="outline" onClick={clear}>
          空にする
        </Button>
      </div>
    </div>
  );
}
