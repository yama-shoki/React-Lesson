"use client";

/**
 * リストの 1 行。
 *
 * メモ欄の入力値は React の state ではなく、ブラウザの input 要素そのものが持っている。
 * この「React が管理していない値」が、key を間違えたときに置き去りになる。
 */
export function MemberRow({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border px-3 py-2">
      <span className="w-16 shrink-0 font-medium">{name}</span>
      <input
        type="text"
        placeholder="メモを書いてみる"
        className="min-w-0 flex-1 rounded border px-2 py-1"
      />
    </div>
  );
}
