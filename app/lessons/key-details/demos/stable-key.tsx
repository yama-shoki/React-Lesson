"use client";

import { MemberRow } from "@/app/lessons/list-and-key/demos/member-row";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const members = [
  { id: 1, name: "さとう" },
  { id: 2, name: "すずき" },
  { id: 3, name: "たかはし" },
];

export function StableKey() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        こちらも、メモ欄に打ってからボタンを押してください。
      </p>

      <div className="flex flex-col gap-2.5">
        {members.map((member) => (
          // 同じデータなら、毎回同じ key
          <MemberRow key={member.id} name={member.name} />
        ))}
      </div>

      <Button size="sm" onClick={() => setCount((c) => c + 1)}>
        ただ描き直す（{count} 回目・中身は変えていない）
      </Button>
    </div>
  );
}
