"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { Todo } from "./types";

/** 1 行。編集中の文字は、この部品が自分で持っている */
function Row({ todo, onDelete }: { todo: Todo; onDelete: () => void }) {
  const [draft, setDraft] = useState(todo.text);

  return (
    <li className="flex items-center gap-2 rounded-md border px-3 py-2">
      <Input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        aria-label={`${todo.text} を編集`}
        className="h-8"
      />
      <Button size="sm" variant="ghost" onClick={onDelete}>
        消す
      </Button>
    </li>
  );
}

const initial: Todo[] = [
  { id: 1, text: "牛乳を買う", done: false },
  { id: 2, text: "本を返す", done: false },
  { id: 3, text: "部屋を片づける", done: false },
];

export function IndexKeyTodo() {
  const [todos, setTodos] = useState(initial);

  const remove = (id: number) =>
    setTodos((current) => current.filter((todo) => todo.id !== id));

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        一番上の「牛乳を買う」を書き換えてから、その行を消してください。
      </p>

      <ul className="flex flex-col gap-2">
        {todos.map((todo, index) => (
          // key に index を使っている。1 行消すと、番号が繰り上がる
          <Row key={index} todo={todo} onDelete={() => remove(todo.id)} />
        ))}
      </ul>

      <Button
        size="sm"
        variant="outline"
        onClick={() => setTodos(initial)}
        disabled={todos.length === initial.length}
      >
        元に戻す
      </Button>
    </div>
  );
}
