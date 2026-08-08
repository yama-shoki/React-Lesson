"use client";

import { Button } from "@/components/ui/button";

function Counter({ count }: { count: number }) {
  const increase = () => {
    // 受け取った値をここで書き換えている。
    // 変数の中身は増えるが、React は何も知らないので画面は変わらない。
    // （この書き方は lint に止められる。ここでは説明のために黙らせている）
    // eslint-disable-next-line react-hooks/immutability
    count = count + 1;
    console.log("count は", count, "になった。でも画面はそのまま");
  };

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-lg font-semibold tabular-nums">
        {count}
      </span>
      <Button size="sm" onClick={increase}>
        増やす
      </Button>
    </div>
  );
}

export function BrokenProps() {
  return <Counter count={0} />;
}
