"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export function FixedCondition() {
  const [items, setItems] = useState<string[]>(["りんご"]);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border p-3">
        {/* 比較して true / false にしてから && に渡す。
            false は画面に出ないので、0 件のときは何も表示されない */}
        {items.length > 0 && <p>{items.length} 件あります</p>}
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
