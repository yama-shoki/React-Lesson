"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

const stock = ["りんご", "みかん", "もも"];

export function ZeroBug() {
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
        {/* ✕ 左が数値。0 のとき、その 0 がそのまま画面に出る */}
        {items.length && (
          <ul className="flex gap-2">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-muted-foreground">
        全部減らすと、箱の中に <strong>0</strong> が現れます
      </p>
    </div>
  );
}
