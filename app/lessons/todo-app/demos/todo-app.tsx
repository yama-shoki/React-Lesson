"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { TodoItem } from "./todo-item";
import { type Filter, type Todo, filterLabels, filterTodos } from "./types";

/*
  データを持っているのはここだけ。
  子は「押された」と伝えてくるだけで、実際に変えるのは全部この中。
*/

let nextId = 4;

export function TodoApp() {
  useTrackDemoRender();

  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "牛乳を買う", done: false },
    { id: 2, text: "React の教材を読む", done: true },
    { id: 3, text: "歯医者を予約する", done: false },
  ]);
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  // C: 追加する。元の配列は触らず、新しい配列を作る
  const add = () => {
    const text = draft.trim();
    if (!text) return;

    setTodos([...todos, { id: nextId++, text, done: false }]);
    setDraft("");
  };

  // U: 済み / 未済みを切り替える。該当の 1 件だけ差し替える
  const toggle = (id: number) => {
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)),
    );
  };

  // U: 文言を書き換える
  const edit = (id: number, text: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, text } : todo)));
  };

  // D: 消す。残すものだけを集める
  const remove = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // 絞り込んだ結果と残り件数は state にしない。毎回そこから計算する
  const shown = filterTodos(todos, filter);
  const remaining = todos.filter((todo) => !todo.done).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Input
          placeholder="やることを書く"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && add()}
        />
        <Button size="sm" onClick={add} disabled={draft.trim() === ""}>
          追加
        </Button>
      </div>

      <div className="flex gap-2">
        {(Object.keys(filterLabels) as Filter[]).map((value) => (
          <Button
            key={value}
            size="sm"
            variant={filter === value ? "default" : "outline"}
            onClick={() => setFilter(value)}
          >
            {filterLabels[value]}
          </Button>
        ))}
      </div>

      {/* R: 並べる。key は index ではなく id */}
      <ul className="flex flex-col gap-2">
        {shown.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggle}
            onDelete={remove}
            onEdit={edit}
          />
        ))}
      </ul>

      {shown.length === 0 && (
        <p className="text-muted-foreground">この条件に合うものはありません</p>
      )}

      <p className="text-sm text-muted-foreground">残り {remaining} 件</p>
    </div>
  );
}
