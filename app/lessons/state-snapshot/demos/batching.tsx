"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Batching() {
  // このカードが描き直された回数を数えるための 1 行（教材の仕掛け）
  useTrackDemoRender();

  const [name, setName] = useState("さとう");
  const [age, setAge] = useState(20);
  const [admin, setAdmin] = useState(false);

  // 3 つとも別々の state。それでも描き直しは 1 回にまとめられる
  const updateAll = () => {
    setName((current) => (current === "さとう" ? "すずき" : "さとう"));
    setAge((current) => current + 1);
    setAdmin((current) => !current);
  };

  // 待つ処理をはさんでも、まとめられる
  const updateAfterWait = async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    updateAll();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-md border p-3 font-mono text-sm">
        {`{ name: "${name}", age: ${age}, admin: ${String(admin)} }`}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={updateAll}>
          3 つまとめて更新する
        </Button>
        <Button size="sm" variant="outline" onClick={updateAfterWait}>
          0.3 秒待ってから更新する
        </Button>
      </div>
    </div>
  );
}
