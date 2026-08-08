"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

const fruits = ["みかん", "ぶどう", "もも", "いちご"];

export function MutateArray() {
  const [items, setItems] = useState(["りんご"]);

  const add = () => {
    // 配列そのものに足している。中身は増えるが、配列は同じもののまま
    items.push(fruits[items.length % fruits.length]);

    // 同じ配列を渡しても、React は「変わっていない」と判断する
    setItems(items);

    console.log("中身は", items, "になっている。でも画面は変わらない");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border p-3">{items.join(", ")}</div>
      <Button size="sm" onClick={add}>
        追加する
      </Button>
    </div>
  );
}
