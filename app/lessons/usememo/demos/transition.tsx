"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { useMemo, useState, useTransition } from "react";
import { heavyCalculation } from "./heavy";

export function Transition() {
  useTrackDemoRender();

  const [count, setCount] = useState(0);
  // 重い計算に使う値。count から遅れて追いつく
  const [target, setTarget] = useState(0);
  const [isPending, startTransition] = useTransition();

  const result = useMemo(() => heavyCalculation(target), [target]);

  const increase = () => {
    // 押した手応え（数字の更新）は、すぐ反映する
    setCount((current) => current + 1);

    // 重い計算のほうは「急がなくていい」と伝える
    startTransition(() => {
      setTarget((current) => current + 1);
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <Button size="sm" onClick={increase}>
        count を増やす（連打してみる）
      </Button>

      <RenderBox title="すぐ反応するほう" tone="highlight">
        count: {count}
      </RenderBox>

      <RenderBox title="重い計算のほう">
        <span className={isPending ? "opacity-50" : ""}>
          計算結果: {result}
          {isPending && "（計算中…）"}
        </span>
      </RenderBox>
    </div>
  );
}
