"use client";

import { MemberRow } from "@/app/lessons/list-and-key/demos/member-row";
import { Button } from "@/components/ui/button";
import { useState } from "react";

/*
  lint は「描画のたびに違う結果になる関数を呼ぶな」と止めてくる。
  そのとおりで、ふだんは正しい警告。
  この章はその禁じ手を実際に踏んで、何が起きるかを見るためのもの。
*/
/* eslint-disable react-hooks/purity */

const members = [
  { id: 1, name: "さとう" },
  { id: 2, name: "すずき" },
  { id: 3, name: "たかはし" },
];

export function RandomKey() {
  // リストの中身は一度も変えない。ボタンは描き直しを起こすだけ
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        まず各行のメモ欄に何か打ってから、ボタンを押してください。
      </p>

      <div className="flex flex-col gap-2.5">
        {members.map((member) => (
          // 描き直されるたびに違う key になる。React は毎回「知らない行」と判断する
          <MemberRow key={Math.random()} name={member.name} />
        ))}
      </div>

      <Button size="sm" onClick={() => setCount((c) => c + 1)}>
        ただ描き直す（{count} 回目・中身は変えていない）
      </Button>
    </div>
  );
}
