"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

let calls = 0;

const shout = () => {
  calls += 1;
};

export function ParenFixed() {
  const [shown, setShown] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {/* ◯ 括弧なし。関数そのものを渡しているので、押すまで実行されない */}
      <Button size="sm" variant="outline" onClick={shout}>
        押すと 1 回ぶん増える
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
