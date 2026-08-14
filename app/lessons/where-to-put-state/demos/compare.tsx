"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";
import { useState } from "react";
import useLocalStorageState from "use-local-storage-state";

export function Compare() {
  useTrackDemoRender();

  // 3 つとも同じ形。違うのは置き場所だけ
  const [inMemory, setInMemory] = useState("");
  const [inUrl, setInUrl] = useQueryState("memo", { defaultValue: "" });
  const [inStorage, setInStorage] = useLocalStorageState(
    "react-lesson-compare",
    { defaultValue: "" },
  );

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-muted-foreground">useState（メモリ）</span>
        <Input
          value={inMemory}
          onChange={(event) => setInMemory(event.target.value)}
          placeholder="何か入力"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-muted-foreground">useQueryState（URL）</span>
        <Input
          value={inUrl}
          onChange={(event) => setInUrl(event.target.value)}
          placeholder="何か入力"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-muted-foreground">
          useLocalStorageState（ブラウザ）
        </span>
        <Input
          value={inStorage}
          onChange={(event) => setInStorage(event.target.value)}
          placeholder="何か入力"
        />
      </label>

      <Button
        size="sm"
        variant="outline"
        onClick={() => window.location.reload()}
      >
        3 つとも入力してから、ここを押して再読み込み
      </Button>
    </div>
  );
}
