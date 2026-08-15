import { updated, user } from "./new-object";

/**
 * 結果を画面に出すだけの入れ物。
 * Part 0 ではまだ JSX を扱わないので、このファイルは右のコードには出さない。
 * 読者に見せるのは new-object.ts のほう。
 */
export function NewObject() {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-muted-foreground">
        元のほうは、書き換えられていません
      </p>
      <div className="rounded-md border p-3 font-mono">
        元: {`{ name: "${user.name}", age: ${user.age} }`}
      </div>
      <div className="rounded-md border p-3 font-mono">
        新しく作ったほう: {`{ name: "${updated.name}", age: ${updated.age} }`}
      </div>
    </div>
  );
}
