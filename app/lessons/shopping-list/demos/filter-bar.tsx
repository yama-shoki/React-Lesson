"use client";

import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories, type Category } from "./types";

/**
 * 絞り込みの操作だけを持つ部品。
 * 値がどこに保管されているか（URL）は、この部品は知らない。
 * 受け取っているのは、ただの値と、ただの関数。
 */
export function FilterBar({
  keyword,
  onKeywordChange,
  category,
  onCategoryChange,
}: {
  keyword: string;
  onKeywordChange: (value: string) => void;
  category: Category | null;
  onCategoryChange: (value: Category | null) => void;
}) {
  return (
    <RenderBox title="絞り込みバー">
      <div className="flex flex-col gap-3">
        <Input
          placeholder="名前で絞り込む"
          aria-label="名前で絞り込む"
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
        />

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={category === null ? "default" : "outline"}
            onClick={() => onCategoryChange(null)}
          >
            すべて
          </Button>
          {categories.map((name) => (
            <Button
              key={name}
              size="sm"
              variant={category === name ? "default" : "outline"}
              onClick={() => onCategoryChange(name)}
            >
              {name}
            </Button>
          ))}
        </div>
      </div>
    </RenderBox>
  );
}
