import { rows } from "./union-type";

/** 結果を画面に出すだけの入れ物。読者に見せるのは union-type.ts のほう */
export function UnionType() {
  return (
    <ul className="flex flex-col gap-2.5">
      {rows.map((row) => (
        <li
          key={row.title}
          className="flex items-center justify-between gap-3 rounded-md border p-3"
        >
          <span>{row.title}</span>
          <span className="shrink-0 rounded border px-2 py-0.5 text-xs text-muted-foreground">
            {row.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
