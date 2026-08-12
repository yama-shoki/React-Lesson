"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

// 呼ばれた回数を数えておくだけの変数
let calls = 0;

const shout = () => {
  calls += 1;
};

export function ParenBug() {
  const [shown, setShown] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {/* ✕ 括弧を付けた。この行を通った時点で、もう実行されている。
          TypeScript は「関数を渡すところに、関数でないものが来た」と
          気づいて赤線を出す。ここでは動かして見せたいので黙らせている */}
      {/* @ts-expect-error 括弧を付ける間違いを、あえて動かしている */}
      <Button size="sm" variant="outline" onClick={shout()}>
        まだ押していない
      </Button>

      <div className="flex items-center gap-2">
        <Button size="sm" onClick={() => setShown(calls)}>
          呼ばれた回数を確かめる
        </Button>
        {shown !== null && (
          <span>
            <strong>{shown}</strong> 回
          </span>
        )}
      </div>
    </div>
  );
}
