"use client";

import { Input } from "@/components/ui/input";

/**
 * リストの 1 行。
 *
 * メモ欄に打った値は React の state ではなく、ブラウザの入力欄そのものが持っている。
 * この「React が管理していない値」が、key を間違えたときに置き去りになる。
 */
export function MemberRow({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border px-3 py-2">
      <span className="w-16 shrink-0 font-medium">{name}</span>
      <Input placeholder="メモを書いてみる" className="h-8" />
    </div>
  );
}
