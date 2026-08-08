"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MemberRow } from "./member-row";

type Member = { id: number; name: string };

const initialMembers: Member[] = [
  { id: 1, name: "さとう" },
  { id: 2, name: "すずき" },
  { id: 3, name: "たかはし" },
];

const newcomers = ["やまだ", "いとう", "わたなべ", "こばやし"];

export function BrokenList() {
  const [members, setMembers] = useState(initialMembers);

  const addToTop = () => {
    const name = newcomers[members.length - 3];
    if (!name) return;

    // 先頭に追加する。既存のメンバーは 1 つずつ後ろにずれる
    setMembers([{ id: members.length + 1, name }, ...members]);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        {members.map((member, index) => (
          // key に index を使っている。ここが問題
          <MemberRow key={index} name={member.name} />
        ))}
      </div>

      <div className="flex gap-2">
        <Button size="sm" onClick={addToTop}>
          先頭にメンバーを追加
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setMembers(initialMembers)}
        >
          最初から
        </Button>
      </div>
    </div>
  );
}
