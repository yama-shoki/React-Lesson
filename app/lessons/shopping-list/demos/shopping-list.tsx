"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";
import { useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import { FilterBar } from "./filter-bar";
import {
  filterItems,
  initialItems,
  toCategory,
  type Category,
  type Item,
} from "./types";

export function ShoppingList() {
  useTrackDemoRender();

  // 買うもの本体 … 閉じても残ってほしい → ブラウザに保存する
  const [items, setItems] = useLocalStorageState<Item[]>(
    "react-lesson-shopping-items",
    { defaultValue: initialItems },
  );

  // 絞り込み条件 … 人に見せたい・戻るで戻りたい → URL に置く
  const [keyword, setKeyword] = useQueryState("q", { defaultValue: "" });
  const [category, setCategory] = useQueryState<Category | null>("cat", {
    defaultValue: null,
    // 知らない値が URL に入っていたら、絞り込みなしとして扱う
    parse: toCategory,
    serialize: (value) => value ?? "",
  });

  // 入力途中の新しい品名 … この画面から離れたら消えてよい → useState
  const [draft, setDraft] = useState("");

  const shown = filterItems(items, keyword, category);

  const add = () => {
    const name = draft.trim();
    if (!name) return;

    setItems((current) => [
      ...current,
      {
        id: Math.max(0, ...current.map((item) => item.id)) + 1,
        name,
        category: category ?? "その他",
        bought: false,
      },
    ]);
    setDraft("");
  };

  const toggle = (id: number) =>
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, bought: !item.bought } : item,
      ),
    );

  return (
    <div className="flex flex-col gap-4">
      <FilterBar
        keyword={keyword}
        onKeywordChange={setKeyword}
        category={category}
        onCategoryChange={setCategory}
      />

      <RenderBox title="買うもの（ブラウザに保存されている）" tone="highlight">
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
          {shown.length === 0 && (
            <li className="text-sm text-muted-foreground">
              条件に合うものがありません
            </li>
          )}
        </ul>
      </RenderBox>

      <div className="flex gap-2">
        <Input
          placeholder="買うものを足す"
          aria-label="買うものを足す"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <Button size="sm" onClick={add}>
          足す
        </Button>
      </div>

      <Button
        size="sm"
        variant="outline"
        onClick={() => setItems(initialItems)}
      >
        最初の状態に戻す
      </Button>
    </div>
  );
}
