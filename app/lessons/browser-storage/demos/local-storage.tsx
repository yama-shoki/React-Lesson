"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useLocalStorageState from "use-local-storage-state";

export function LocalStorageDemo() {
  // これも形は useState と同じ。置き場所がブラウザの保存領域になっただけ
  const [name, setName] = useLocalStorageState("react-lesson-demo-name", {
    defaultValue: "",
  });

  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="名前を入力してみる"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <div className="rounded-md border p-3">
        {name === "" ? (
          <span className="text-muted-foreground">まだ入力されていません</span>
        ) : (
          <span>こんにちは、{name} さん</span>
        )}
      </div>

      <Button size="sm" variant="outline" onClick={() => setName("")}>
        消す
      </Button>

      <p className="text-muted-foreground">
        入力してからページを再読み込みしてみてください
      </p>
    </div>
  );
}
