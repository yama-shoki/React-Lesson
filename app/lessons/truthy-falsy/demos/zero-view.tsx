"use client";

import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ZeroView() {
  const [items, setItems] = useState(["りんご", "みかん", "ぶどう"]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => setItems(items.slice(0, -1))}
          disabled={items.length === 0}
        >
          1 つ減らす
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setItems(["りんご", "みかん", "ぶどう"])}
        >
          戻す
        </Button>
      </div>

      <p className="font-mono text-sm text-muted-foreground">
        items.length は {items.length}
      </p>

      <RenderBox title="&& にそのまま渡した（0 が出る）">
        {items.length && <span>{items.length} 件あります</span>}
      </RenderBox>

      <RenderBox title="比べてから渡した（何も出ない）" tone="highlight">
        {items.length > 0 && <span>{items.length} 件あります</span>}
      </RenderBox>
    </div>
  );
}
