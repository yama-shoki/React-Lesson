import { theFunction, theResult } from "./function-value";

/** 結果を画面に出すだけの入れ物。読者に見せるのは function-value.ts のほう */
export function FunctionValue() {
  return (
    <dl className="flex flex-col gap-3">
      <div className="flex flex-col gap-1 rounded-md border p-3">
        <dt className="font-mono text-muted-foreground">greet（括弧なし）</dt>
        <dd className="font-mono font-semibold">{typeof theFunction}</dd>
      </div>
      <div className="flex flex-col gap-1 rounded-md border p-3">
        <dt className="font-mono text-muted-foreground">greet()（括弧あり）</dt>
        <dd className="font-mono font-semibold">&quot;{theResult}&quot;</dd>
      </div>
    </dl>
  );
}
