"use client";

import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { useSelectorStore } from "./store";

/**
 * 欲しいものだけを取り出す。
 * この関数（セレクタ）が返した値が変わったときだけ、描き直される。
 */
function CountDisplay() {
  const count = useSelectorStore((state) => state.count);
  return (
    <RenderBox title="count だけを使う部品" tone="highlight">
      count: {count}
    </RenderBox>
  );
}

function NameDisplay() {
  const name = useSelectorStore((state) => state.name);
  return (
    <RenderBox title="name だけを使う部品" tone="highlight">
      name: {name}
    </RenderBox>
  );
}

/** 更新するだけの部品。値を 1 つも読んでいないので、何が変わっても動かない */
function Controls() {
  const increase = useSelectorStore((state) => state.increase);
  const changeName = useSelectorStore((state) => state.changeName);

  return (
    <RenderBox title="押すだけの部品">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={increase}>
          count を増やす
        </Button>
        <Button size="sm" variant="outline" onClick={changeName}>
          name を変える
        </Button>
      </div>
    </RenderBox>
  );
}

export function Selector() {
  return (
    <div className="flex flex-col gap-3">
      <Controls />
      <CountDisplay />
      <NameDisplay />
    </div>
  );
}
