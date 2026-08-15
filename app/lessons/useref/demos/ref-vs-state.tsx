"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

/*
  「ref を画面に出すとどうなるか」を見せるためのファイル。
  lint は「描き直しの最中に ref を読むな」と正しく止めてくる。
  止めてくれること自体がこの章の教材なので、ここだけ黙らせている。
*/
/* eslint-disable react-hooks/refs */

export function RefVsState() {
  useTrackDemoRender();

  const [stateCount, setStateCount] = useState(0);

  // ref は書き換えても描き直しが起きない
  const refCount = useRef(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Button size="sm" onClick={() => setStateCount((current) => current + 1)}>
          state を増やす
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            refCount.current += 1;
          }}
        >
          ref を増やす
        </Button>
      </div>

      <div className="rounded-md border p-3 font-mono text-sm">
        <p>state: {stateCount}</p>
        {/* ref を変えても描き直されないので、この表示は古いまま */}
        <p>ref: {refCount.current}</p>
      </div>

      <p className="text-sm text-muted-foreground">
        「ref を増やす」を何回押しても、表示は変わりません。
        そのあと「state を増やす」を押すと、まとめて追いつきます
      </p>
    </div>
  );
}
