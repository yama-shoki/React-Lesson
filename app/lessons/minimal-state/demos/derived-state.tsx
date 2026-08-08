"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export function DerivedState() {
  // state はこれだけ
  const [items, setItems] = useState(["りんご"]);

  // 件数は state にせず、毎回計算する。ずれようがない
  const count = items.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border p-3">
        <p>件数: {count}</p>
        <p className="text-muted-foreground">
          中身: {items.length === 0 ? "（空）" : items.join(", ")}
        </p>
      </div>

      <div className="flex gap-2">
        <Button size="sm" onClick={() => setItems([...items, "りんご"])}>
          増やす
        </Button>
        <Button size="sm" variant="outline" onClick={() => setItems([])}>
          空にする
        </Button>
      </div>
    </div>
  );
}
