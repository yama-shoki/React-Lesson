import { logs } from "./pass-function";

/** 結果を画面に出すだけの入れ物。読者に見せるのは pass-function.ts のほう */
export function PassFunction() {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-muted-foreground">記録された内容</p>
      <ul className="flex flex-col gap-2">
        {logs.map((log, index) => (
          <li key={index} className="rounded-md border p-2.5 font-mono">
            {index + 1}. {log}
          </li>
        ))}
      </ul>
    </div>
  );
}
