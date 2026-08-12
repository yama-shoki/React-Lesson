"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { Todo } from "./types";

/*
  1 件ぶんの表示と、編集の見た目を持つ部品。
  「どのデータを消すか」は決めない。押されたことを伝えるだけ。
*/

type Props = {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, text: string) => void;
};

export function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
  // 「編集中かどうか」は、この 1 件の中だけの話。だからここで持つ
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);

  const save = () => {
    const text = draft.trim();
    if (text) onEdit(todo.id, text);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className="flex items-center gap-2 rounded-md border p-2">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") save();
            if (event.key === "Escape") setIsEditing(false);
          }}
        />
        <Button size="sm" onClick={save}>
          保存
        </Button>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-2 rounded-md border p-2">
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        aria-label={`${todo.text} を完了にする`}
      />

      <span className={todo.done ? "flex-1 text-muted-foreground line-through" : "flex-1"}>
        {todo.text}
      </span>

      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setDraft(todo.text);
          setIsEditing(true);
        }}
      >
        編集
      </Button>
      <Button size="sm" variant="outline" onClick={() => onDelete(todo.id)}>
        削除
      </Button>
    </li>
  );
}
