"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export function JustCalculate() {
  const [items, setItems] = useState(["りんご"]);

  // useEffect も state も要らない。ただ計算するだけ
  const count = items.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border p-3">
        <p>件数: {count}</p>
        <p className="text-muted-foreground">{items.join(", ")}</p>
      </div>

      <Button size="sm" onClick={() => setItems([...items, "みかん"])}>
        追加する
      </Button>
    </div>
  );
}
