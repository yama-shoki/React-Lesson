"use client";

/*
  よくある書き方を 3 つ、わざと同時に入れてある。

  注意: この 3 つは lint に引っかからない。型も通るしビルドも通る。
  しかも「追加」は動いてしまう（直後の setDraft が描き直しを起こすため）。
  「チェック」だけが動かない。この一貫しなさが、いちばん厄介なところ。
*/

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { Todo } from "./types";

export function BrokenTodo() {
  useTrackDemoRender();

  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "牛乳を買う", done: false },
    { id: 2, text: "歯医者を予約する", done: false },
  ]);
  const [draft, setDraft] = useState("");
  // ✕ 3. 残り件数を state に持ってしまっている（todos から計算できるのに）
  const [remaining, setRemaining] = useState(2);

  const add = () => {
    if (!draft.trim()) return;

    // ✕ 1. 元の配列に push している。React から見ると「同じ箱」のまま
    todos.push({ id: Date.now(), text: draft, done: false });
    setTodos(todos);
    setDraft("");
    setRemaining(remaining + 1);
  };

  const toggle = (id: number) => {
    // ✕ 2. 中身のオブジェクトを直接書き換えている
    const target = todos.find((todo) => todo.id === id);
    if (target) target.done = !target.done;
    setTodos(todos);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Input
          placeholder="やることを書く"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <Button size="sm" onClick={add}>
          追加
        </Button>
      </div>

      <ul className="flex flex-col gap-2">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2 rounded-md border p-2">
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggle(todo.id)}
              aria-label={`${todo.text} を完了にする`}
            />
            <span className={todo.done ? "line-through" : ""}>{todo.text}</span>
          </li>
        ))}
      </ul>

      <p className="text-sm text-muted-foreground">残り {remaining} 件</p>
    </div>
  );
}
