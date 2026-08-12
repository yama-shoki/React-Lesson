"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { withAwait, withoutAwait } from "./order";

/** ログを画面に出すだけの入れ物。読者に見せるのは order.ts のほう */
export function Order() {
  const [log, setLog] = useState<string[]>([]);
  const add = (line: string) => setLog((current) => [...current, line]);

  const run = (fn: (add: (line: string) => void) => void) => {
    setLog([]);
    fn(add);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => run(withoutAwait)}>
          await なし
        </Button>
        <Button size="sm" onClick={() => run(withAwait)}>
          await あり
        </Button>
      </div>

      <ol className="flex min-h-24 flex-col gap-1 rounded-md border p-3 text-sm">
        {log.length === 0 ? (
          <li className="text-muted-foreground">押すと、順番が出ます</li>
        ) : (
          log.map((line) => <li key={line}>{line}</li>)
        )}
      </ol>
    </div>
  );
}
