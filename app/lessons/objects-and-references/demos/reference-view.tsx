"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

/**
 * 「同じものか」を実際に押して確かめる箱。
 * Part 0 ではまだ JSX を扱わないので、右のコードには reference.ts のほうを出す。
 */
// 呼ぶたびに新しい箱を作って返す。
// リテラルどうしを直接並べると、TypeScript のほうが先に
// 「それは必ず false になります」と教えてくれてしまう
const makeUser = () => ({ name: "さとう" });
const makeList = () => [1, 2];

const cases = [
  {
    code: `10 === 10`,
    run: () => 10 === 10,
    note: "数値は値そのものを比べる",
  },
  {
    code: `"さとう" === "さとう"`,
    run: () => "さとう" === "さとう",
    note: "文字列も値そのもの",
  },
  {
    code: `{ name: "さとう" } === { name: "さとう" }`,
    run: () => makeUser() === makeUser(),
    note: "見た目が同じでも、別々に作った箱",
  },
  {
    code: `[1, 2] === [1, 2]`,
    run: () => makeList() === makeList(),
    note: "配列も同じ",
  },
];

export function ReferenceView() {
  const [results, setResults] = useState<(boolean | null)[]>(
    cases.map(() => null),
  );

  const runAll = () =>
    setResults(cases.map((item) => item.run()));

  return (
    <div className="flex flex-col gap-3">
      <Button size="sm" onClick={runAll}>
        比べてみる
      </Button>

      <ul className="flex flex-col gap-2">
        {cases.map((item, index) => (
          <li
            key={item.code}
            className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-md border p-3"
          >
            <code className="font-mono text-sm">{item.code}</code>
            <span className="font-mono text-sm font-semibold">
              {results[index] === null ? "?" : String(results[index])}
            </span>
            <span className="text-xs text-muted-foreground">{item.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
