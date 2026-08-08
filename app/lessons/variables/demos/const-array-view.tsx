import { members } from "./const-array";

/** 結果を画面に出すだけの入れ物。読者に見せるのは const-array.ts のほう */
export function ConstArray() {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-muted-foreground">
        push したぶんだけ要素が増えている
      </p>
      <div className="rounded-md border p-3 font-mono">
        {`[${members.map((name) => `"${name}"`).join(", ")}]`}
      </div>
    </div>
  );
}
