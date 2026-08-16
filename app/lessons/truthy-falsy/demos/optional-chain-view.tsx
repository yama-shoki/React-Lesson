"use client";

import { DemoErrorBoundary } from "@/components/lesson/demo-error-boundary";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { city3, city4 } from "./optional-chain";

type User = { name: string; address?: { city: string } };

const withoutAddress: User = { name: "すずき" };

function CrashOnPurpose() {
  // ?. を付けずに、無いものの中を見に行く
  const address = withoutAddress.address as { city: string };
  return <span>{address.city}</span>;
}

export function OptionalChainView() {
  const [crashed, setCrashed] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-lg border p-4">
        <p className="mb-2 text-sm font-medium">?. を付けない（address が無い人）</p>
        {crashed ? (
          <DemoErrorBoundary>
            <CrashOnPurpose />
          </DemoErrorBoundary>
        ) : (
          <span className="text-muted-foreground">まだ実行していません</span>
        )}
      </div>

      {/* 中身が変わらないので、光る箱にはしない（Part 0 の読者に再レンダリングの話はまだ早い） */}
      <div className="rounded-lg border p-4">
        <p className="mb-2 text-sm font-medium">?. を付けた</p>
        <div className="flex flex-col gap-1 font-mono text-sm">
          <span>address?.city は {String(city3)}</span>
          <span>address?.city ?? &quot;未登録&quot; は {city4}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => setCrashed(true)}>
          ?. なしで取り出してみる
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setCrashed(false)}>
          戻す
        </Button>
      </div>
    </div>
  );
}
