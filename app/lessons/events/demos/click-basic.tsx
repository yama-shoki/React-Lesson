"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const members = ["さとう", "すずき", "たかはし"];

export function ClickBasic() {
  // このカードが描き直された回数を数えるための 1 行（教材の仕掛け）
  useTrackDemoRender();

  const [selected, setSelected] = useState("まだ選んでいません");

  // 引数のいらない関数は、そのまま渡す
  const reset = () => setSelected("まだ選んでいません");

  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-md border p-3">{selected}</p>

      <div className="flex flex-wrap gap-2">
        {members.map((name) => (
          <Button
            key={name}
            size="sm"
            variant="outline"
            // 引数を渡したいときは、それを呼ぶ関数で包む
            onClick={() => setSelected(`${name} を選びました`)}
          >
            {name}
          </Button>
        ))}

        <Button size="sm" onClick={reset}>
          リセット
        </Button>
      </div>
    </div>
  );
}
