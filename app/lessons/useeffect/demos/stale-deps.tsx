"use client";

import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

/* eslint-disable react-hooks/exhaustive-deps */

/** 依存配列に count を書き忘れた版。タブ名が最初の値のまま止まる */
function ForgotDep({ count }: { count: number }) {
  useEffect(() => {
    document.title = `記録された数: ${count}`;
    return () => {
      document.title = "React 入門";
    };
  }, []); // count を使っているのに、書いていない

  return <RenderBox title="依存配列が空（書き忘れ）">タブ名を見てください</RenderBox>;
}

/** 使っている値をすべて書いた版 */
function WroteDep({ count }: { count: number }) {
  useEffect(() => {
    document.title = `記録された数: ${count}`;
    return () => {
      document.title = "React 入門";
    };
  }, [count]);

  return (
    <RenderBox title="依存配列に count を書いた" tone="highlight">
      タブ名を見てください
    </RenderBox>
  );
}

export function StaleDeps() {
  const [count, setCount] = useState(0);
  const [forgot, setForgot] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-lg font-semibold tabular-nums">
          {count}
        </span>
        <Button size="sm" onClick={() => setCount((c) => c + 1)}>
          count を増やす
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setForgot(!forgot)}
        >
          {forgot ? "書いた版に切り替える" : "書き忘れた版に切り替える"}
        </Button>
      </div>

      {forgot ? <ForgotDep count={count} /> : <WroteDep count={count} />}
    </div>
  );
}
