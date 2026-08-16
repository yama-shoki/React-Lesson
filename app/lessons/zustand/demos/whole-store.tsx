"use client";

import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { useCounterStore } from "./store";

/** ストア全体を受け取っている。Context にまとめたときと同じことが起きる */
function CountDisplay() {
  const store = useCounterStore();
  return (
    <RenderBox title="count だけを使う部品">count: {store.count}</RenderBox>
  );
}

function NameDisplay() {
  const store = useCounterStore();
  return <RenderBox title="name だけを使う部品">name: {store.name}</RenderBox>;
}

export function WholeStore() {
  const store = useCounterStore();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={store.increase}>
          count を増やす
        </Button>
        <Button size="sm" variant="outline" onClick={store.changeName}>
          name を変える
        </Button>
      </div>

      <CountDisplay />
      <NameDisplay />
    </div>
  );
}
