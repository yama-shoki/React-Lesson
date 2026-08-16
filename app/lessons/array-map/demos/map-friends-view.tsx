import { big, doubled, firstBig, original, total } from "./map-friends";

/**
 * 結果を画面に出すだけの入れ物。
 * Part 0 ではまだ JSX を扱わないので、このファイルは右のコードには出さない。
 * 読者に見せるのは map-friends.ts のほう。
 */
const rows = [
  { code: "scores.map((n) => n * 2)", result: doubled, note: "数は変わらない" },
  { code: "scores.filter((n) => n > 2)", result: big, note: "数が減る" },
  { code: "scores.find((n) => n > 2)", result: firstBig, note: "配列ではない" },
  {
    code: "scores.reduce((sum, n) => sum + n, 0)",
    result: total,
    note: "1 つにまとまる",
  },
];

export function MapFriends() {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="font-mono text-sm text-muted-foreground">
        scores = [{original.join(", ")}]
      </p>

      <ul className="flex flex-col gap-2">
        {rows.map((row) => (
          <li
            key={row.code}
            className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-md border p-3"
          >
            <code className="font-mono text-sm">{row.code}</code>
            <span className="font-mono text-sm font-semibold">
              {JSON.stringify(row.result)}
            </span>
            <span className="text-xs text-muted-foreground">{row.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
