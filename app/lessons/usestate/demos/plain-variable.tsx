"use client";

/*
  この書き方は React のルール違反なので、本来は lint に止められる。
  「なぜ動かないのか」を実際に動かして見せるために、この 1 ファイルだけ黙らせている。
*/
/* eslint-disable react-hooks/immutability */

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";

export function PlainVariable() {
  // このカードが描き直された回数を数えるための 1 行。
  // 教材の仕掛けであって、React の機能ではない
  useTrackDemoRender();

  // ふつうの変数で数を持ってみる
  let count = 0;

  const increase = () => {
    count = count + 1;
    console.log("count は", count, "になった。でも画面は変わらない");
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
