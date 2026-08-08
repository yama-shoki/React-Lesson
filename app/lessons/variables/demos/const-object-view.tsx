import { user } from "./const-object";

/**
 * 結果を画面に出すだけの入れ物。
 * Part 0 ではまだ JSX を扱わないので、このファイルは右のコードには出さない。
 * 読者に見せるのは const-object.ts のほう。
 */
export function ConstObject() {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-muted-foreground">
        const で作ったのに、中身が書き換わっています
      </p>
      <div className="rounded-md border p-3 font-mono">
        {`{ name: "${user.name}", age: ${user.age} }`}
      </div>
    </div>
  );
}
