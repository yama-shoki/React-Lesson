import { firstTwo, picked } from "./destructuring";

/** 結果を画面に出すだけの入れ物。読者に見せるのは destructuring.ts のほう */
export function Destructuring() {
  return (
    <dl className="flex flex-col gap-3">
      <div className="flex flex-col gap-1 rounded-md border p-3">
        <dt className="font-mono text-muted-foreground">オブジェクトから</dt>
        <dd className="font-semibold">{picked}</dd>
      </div>
      <div className="flex flex-col gap-1 rounded-md border p-3">
        <dt className="font-mono text-muted-foreground">配列から</dt>
        <dd className="font-semibold">{firstTwo}</dd>
      </div>
    </dl>
  );
}
