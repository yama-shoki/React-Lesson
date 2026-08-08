"use client";

const members = [
  { id: 1, name: "さとう" },
  { id: 2, name: "すずき" },
  { id: 3, name: "たかはし" },
];

export function BasicList() {
  return (
    <ul className="flex flex-col gap-1.5">
      {members.map((member) => (
        <li key={member.id} className="rounded border p-2">
          {member.name}
        </li>
      ))}
    </ul>
  );
}
