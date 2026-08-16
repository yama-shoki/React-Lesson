"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { categories, filterItems, initialItems, type Category } from "./types";

/** 全部 useState に置いた版。動くが、閉じると全部消える */
export function AllInMemory() {
  useTrackDemoRender();

  const [items, setItems] = useState(initialItems);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<Category | null>(null);

  const shown = filterItems(items, keyword, category);

  const toggle = (id: number) =>
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, bought: !item.bought } : item,
      ),
    );

  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="名前で絞り込む"
        aria-label="名前で絞り込む"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
      />

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={category === null ? "default" : "outline"}
          onClick={() => setCategory(null)}
        >
          すべて
        </Button>
        {categories.map((name) => (
          <Button
            key={name}
            size="sm"
            variant={category === name ? "default" : "outline"}
            onClick={() => setCategory(name)}
          >
            {name}
          </Button>
        ))}
      </div>

      <ul className="flex flex-col gap-2">
        {shown.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="focus-ring flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left"
            >
              <span className={item.bought ? "line-through opacity-50" : ""}>
                {item.name}
              </span>
              <span className="ml-auto text-xs text-muted-foreground">
                {item.category}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <p className="text-sm text-muted-foreground">
        絞り込んでから再読み込みしてみてください
      </p>
    </div>
  );
}
