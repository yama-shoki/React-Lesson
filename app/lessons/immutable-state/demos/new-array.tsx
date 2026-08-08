"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

const fruits = ["みかん", "ぶどう", "もも", "いちご"];

export function NewArray() {
  const [items, setItems] = useState(["りんご"]);

  const add = () => {
    // 元の配列は触らず、中身を展開した新しい配列を作って渡す
    setItems((current) => [...current, fruits[current.length % fruits.length]]);
  };

  const removeLast = () => {
    // slice は元を変えずに、切り取った新しい配列を返す
    setItems((current) => current.slice(0, -1));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border p-3">
        {items.length === 0 ? "（空）" : items.join(", ")}
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={add}>
          追加する
        </Button>
        <Button size="sm" variant="outline" onClick={removeLast}>
          最後を消す
        </Button>
      </div>
    </div>
  );
}
