"use client";

/*
  よくある誤用の例。本来 lint に止められる書き方なので、
  「なぜ良くないか」を見せるためにこのファイルだけ黙らせている。
*/
/* eslint-disable react-hooks/set-state-in-effect */

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function EffectDerived() {
  // このカードが描き直された回数を数えるための 1 行（教材の仕掛け）
  useTrackDemoRender();

  const [items, setItems] = useState(["りんご"]);
  const [count, setCount] = useState(1);

  // items が変わったら count を合わせる、という発想
  useEffect(() => {
    setCount(items.length);
  }, [items]);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border p-3">
        <p>件数: {count}</p>
        <p className="text-muted-foreground">{items.join(", ")}</p>
      </div>

      <Button size="sm" onClick={() => setItems([...items, "みかん"])}>
        追加する
      </Button>
    </div>
  );
}
