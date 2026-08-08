import { labels } from "./member-type";

/** 結果を画面に出すだけの入れ物。読者に見せるのは member-type.ts のほう */
export function MemberType() {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-muted-foreground">
        あだ名があればそちら、なければ名前
      </p>
      <ul className="flex flex-col gap-2.5">
        {labels.map((label) => (
          <li key={label} className="rounded-md border p-2.5 font-mono">
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
