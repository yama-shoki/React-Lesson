"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

const stock = ["りんご", "みかん", "もも"];

export function ZeroFixed() {
  const [items, setItems] = useState(stock);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setItems(items.slice(0, -1))}
          disabled={items.length === 0}
        >
          1 つ減らす
        </Button>
        <Button size="sm" variant="outline" onClick={() => setItems(stock)}>
          戻す
        </Button>
      </div>

      <div className="rounded-md border p-3">
        {/* ◯ 左を真偽値にする。false は画面に出ない */}
        {items.length > 0 && (
          <ul className="flex gap-2">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-muted-foreground">
        全部減らしても、<strong>何も出ません</strong>
      </p>
    </div>
  );
}
