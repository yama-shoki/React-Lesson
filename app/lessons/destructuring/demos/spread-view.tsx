import { stillOriginal, updated } from "./spread";

const format = (user: { name: string; age: number }) =>
  `{ name: "${user.name}", age: ${user.age} }`;

/** 結果を画面に出すだけの入れ物。読者に見せるのは spread.ts のほう */
export function Spread() {
  return (
    <dl className="flex flex-col gap-3">
      <div className="flex flex-col gap-1 rounded-md border p-3">
        <dt className="font-mono text-muted-foreground">updated（新しく作ったもの）</dt>
        <dd className="font-mono font-semibold">{format(updated)}</dd>
      </div>
      <div className="flex flex-col gap-1 rounded-md border p-3">
        <dt className="font-mono text-muted-foreground">original（元のまま）</dt>
        <dd className="font-mono font-semibold">{format(stillOriginal)}</dd>
      </div>
    </dl>
  );
}
