"use client";

import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { createContext, type ReactNode, use, useState } from "react";

type Store = {
  count: number;
  setCount: (value: number) => void;
  name: string;
  setName: (value: string) => void;
};

// count も name も、ひとつの置き場所にまとめている
const LargeContext = createContext<Store>({} as Store);

function LargeProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("さとう");

  return (
    <LargeContext value={{ count, setCount, name, setName }}>
      {children}
    </LargeContext>
  );
}

// count しか使っていない
function CountDisplay() {
  const { count } = use(LargeContext);
  return <RenderBox title="count だけを使う部品">count: {count}</RenderBox>;
}

// name しか使っていない
function NameDisplay() {
  const { name } = use(LargeContext);
  return <RenderBox title="name だけを使う部品">name: {name}</RenderBox>;
}

function Controls() {
  const { count, setCount, name, setName } = use(LargeContext);

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" onClick={() => setCount(count + 1)}>
        count を増やす
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setName(name === "さとう" ? "すずき" : "さとう")}
      >
        name を変える
      </Button>
    </div>
  );
}

export function LargeContextDemo() {
  return (
    <LargeProvider>
      <div className="flex flex-col gap-4">
        <Controls />
        <CountDisplay />
        <NameDisplay />
      </div>
    </LargeProvider>
  );
}
