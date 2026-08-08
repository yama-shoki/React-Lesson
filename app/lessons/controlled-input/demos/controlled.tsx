"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function Controlled() {
  // このカードが描き直された回数を数えるための 1 行（教材の仕掛け）
  useTrackDemoRender();

  const [name, setName] = useState("");

  // 入力が空かどうかは、state から計算できる
  const canSubmit = name.trim() !== "";

  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder="名前を入力"
        // 表示する値は React が持っているものにする
        value={name}
        // 入力があったら、React 側の値を更新する
        onChange={(event) => setName(event.target.value)}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" disabled={!canSubmit}>
          送信
        </Button>
        <Button size="sm" variant="outline" onClick={() => setName("")}>
          クリア
        </Button>
        <span className="text-muted-foreground">{name.length} 文字</span>
      </div>
    </div>
  );
}
