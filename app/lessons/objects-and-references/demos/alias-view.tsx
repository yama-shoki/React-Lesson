"use client";

import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type User = { name: string };

export function AliasView() {
  const [log, setLog] = useState<string[]>([]);

  const runShared = () => {
    const original: User = { name: "さとう" };
    const copy = original; // 同じ箱を指しているだけ
    copy.name = "すずき";

    setLog([
      `original.name は "${original.name}"`,
      `copy.name は "${copy.name}"`,
      `original === copy は ${original === copy}`,
    ]);
  };

  const runSeparate = () => {
    const original: User = { name: "さとう" };
    const copy: User = { name: original.name }; // 新しい箱を作った
    copy.name = "すずき";

    setLog([
      `original.name は "${original.name}"`,
      `copy.name は "${copy.name}"`,
      `original === copy は ${original === copy}`,
    ]);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={runShared}>
          copy = original で写す
        </Button>
        <Button size="sm" variant="outline" onClick={runSeparate}>
          新しい箱を作って写す
        </Button>
      </div>

      <RenderBox title="どちらの名前も変わった？">
        {log.length === 0 ? (
          <span className="text-muted-foreground">ボタンを押してください</span>
        ) : (
          <ul className="flex flex-col gap-1 font-mono text-sm">
            {log.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}
      </RenderBox>
    </div>
  );
}
