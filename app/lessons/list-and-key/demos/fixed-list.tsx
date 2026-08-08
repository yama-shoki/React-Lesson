"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
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

export function FixedList() {
  // このカードが描き直された回数を数えるための 1 行（教材の仕掛け）
  useTrackDemoRender();

  const [members, setMembers] = useState(initialMembers);

  const addToTop = () => {
    const name = newcomers[members.length - 3];
    if (!name) return;

    setMembers([{ id: members.length + 1, name }, ...members]);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2.5">
        {members.map((member) => (
          // データ自身が持つ id を key にする
          <MemberRow key={member.id} name={member.name} />
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
