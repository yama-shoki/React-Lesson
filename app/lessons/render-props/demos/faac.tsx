"use client";

import { Button } from "@/components/ui/button";
import { type ReactNode, useState } from "react";

type PanelProps = {
  // children は「要素」でも「要素を返す関数」でもよい
  children: ReactNode | ((state: { isOpen: boolean }) => ReactNode);
};

function Panel({ children }: PanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg border p-4">
      <Button size="sm" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "閉じる" : "開く"}
      </Button>

      <div className="mt-3">
        {/* 関数なら呼ぶ。そうでなければそのまま置く */}
        {typeof children === "function" ? children({ isOpen }) : children}
      </div>
    </div>
  );
}

export function Faac() {
  return (
    <Panel>
      {/* 関数で受け取ると、親の状態が引数で降りてくる */}
      {({ isOpen }) => (
        <p className="text-sm text-muted-foreground">
          いま {isOpen ? "開いています" : "閉じています"}
        </p>
      )}
    </Panel>
  );
}
