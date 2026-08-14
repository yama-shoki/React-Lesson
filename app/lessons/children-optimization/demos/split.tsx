"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { type ReactNode, useState } from "react";

// さっきと同じ構造の子（文言だけ、見分けがつくように変えてある）
function Heavy() {
  return (
    <RenderBox title="重い子" tone="highlight">
      外で作られて、children として渡されている
    </RenderBox>
  );
}

// state を持つ側。子が何かは知らず、受け取って置くだけ
function Counter({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <Button size="sm" onClick={() => setCount((c) => c + 1)}>
        count: {count}
      </Button>

      {/* Counter が描き直されても、children はすでに作られたものが渡ってくる */}
      {children}
    </div>
  );
}

export function Split() {
  useTrackDemoRender();

  return (
    <Counter>
      <Heavy />
    </Counter>
  );
}
