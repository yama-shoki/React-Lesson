"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

type Status = "loading" | "empty" | "ready";

// 出し分けが増えてきたら、早めに return してしまうほうが読みやすい
function Result({ status }: { status: Status }) {
  if (status === "loading") {
    return <p className="text-muted-foreground">読み込み中…</p>;
  }

  if (status === "empty") {
    return <p className="text-muted-foreground">データがありません</p>;
  }

  return <p className="font-semibold">3 件のデータがあります</p>;
}

export function Patterns() {
  const [status, setStatus] = useState<Status>("loading");

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border p-3">
        <Result status={status} />
      </div>

      <div className="flex flex-wrap gap-2">
        {(["loading", "empty", "ready"] as const).map((value) => (
          <Button
            key={value}
            size="sm"
            variant={status === value ? "default" : "outline"}
            onClick={() => setStatus(value)}
          >
            {value}
          </Button>
        ))}
      </div>
    </div>
  );
}
