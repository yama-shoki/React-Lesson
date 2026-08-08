import { labels, names } from "./map-object";

/** 結果を画面に出すだけの入れ物。読者に見せるのは map-object.ts のほう */
export function MapObject() {
  return (
    <dl className="flex flex-col gap-3">
      <div className="flex flex-col gap-1 rounded-md border p-3">
        <dt className="font-mono text-muted-foreground">names</dt>
        <dd className="font-mono font-semibold">
          [{names.map((name) => `"${name}"`).join(", ")}]
        </dd>
      </div>
      <div className="flex flex-col gap-1 rounded-md border p-3">
        <dt className="font-mono text-muted-foreground">labels</dt>
        <dd className="font-mono font-semibold">
          [{labels.map((label) => `"${label}"`).join(", ")}]
        </dd>
      </div>
    </dl>
  );
}
