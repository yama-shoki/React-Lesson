// この 1 行が境目。ここから下はブラウザにも届く
"use client";

import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { type ReactNode, useState } from "react";

export function ClientPart({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <RenderBox title="ブラウザ側（Client Component）" tone="highlight">
        <Button size="sm" onClick={() => setCount(count + 1)}>
          押した回数: {count}
        </Button>
      </RenderBox>

      {/* サーバーで作られたものを、そのまま置ける */}
      {children}
    </div>
  );
}
