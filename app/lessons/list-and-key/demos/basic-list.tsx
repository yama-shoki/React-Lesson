"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";

const members = [
  { id: 1, name: "さとう" },
  { id: 2, name: "すずき" },
  { id: 3, name: "たかはし" },
];

export function BasicList() {
  // このカードが描き直された回数を数えるための 1 行（教材の仕掛け）
  useTrackDemoRender();

  return (
    <ul className="flex flex-col gap-2.5">
      {members.map((member) => (
        <li key={member.id} className="rounded border p-2">
          {member.name}
        </li>
      ))}
    </ul>
  );
}
