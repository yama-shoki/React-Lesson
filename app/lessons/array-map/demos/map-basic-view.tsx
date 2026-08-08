import { doubled, numbers } from "./map-basic";

/** 結果を画面に出すだけの入れ物。読者に見せるのは map-basic.ts のほう */
export function MapBasic() {
  return (
    <dl className="flex flex-col gap-3">
      <div className="flex flex-col gap-1 rounded-md border p-3">
        <dt className="font-mono text-muted-foreground">numbers（元の配列）</dt>
        <dd className="font-mono font-semibold">[{numbers.join(", ")}]</dd>
      </div>
      <div className="flex flex-col gap-1 rounded-md border p-3">
        <dt className="font-mono text-muted-foreground">doubled（map の結果）</dt>
        <dd className="font-mono font-semibold">[{doubled.join(", ")}]</dd>
      </div>
    </dl>
  );
}
