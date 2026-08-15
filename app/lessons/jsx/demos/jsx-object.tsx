"use client";

import { DemoErrorBoundary } from "@/components/lesson/demo-error-boundary";
import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const user = { name: "さとう", age: 20 };

function ShowObject() {
  // オブジェクトそのものを {} に入れている。React は表示のしかたを知らない
  return <span>{user as unknown as string}</span>;
}

export function JsxObject() {
  const [broken, setBroken] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <RenderBox title="{user} と書いた（オブジェクトのまま）">
        {broken ? (
          <DemoErrorBoundary>
            <ShowObject />
          </DemoErrorBoundary>
        ) : (
          <span className="text-muted-foreground">まだ表示していません</span>
        )}
      </RenderBox>

      <RenderBox title="{user.name} と書いた（文字列）" tone="highlight">
        {user.name}
      </RenderBox>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => setBroken(true)}>
          オブジェクトのまま表示してみる
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setBroken(false)}>
          戻す
        </Button>
      </div>
    </div>
  );
}
