import { examples } from "./operators";

/** 結果を画面に出すだけの入れ物。読者に見せるのは operators.ts のほう */
export function Operators() {
  return (
    <ul className="flex flex-col gap-2.5">
      {examples.map((example) => (
        <li
          key={example.code}
          className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border p-3 font-mono"
        >
          <span>{example.code}</span>
          <span className="text-muted-foreground">→</span>
          <span className="font-semibold">
            {typeof example.result === "string"
              ? `"${example.result}"`
              : String(example.result)}
          </span>
        </li>
      ))}
    </ul>
  );
}
