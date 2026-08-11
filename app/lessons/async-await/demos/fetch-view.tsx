"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { loadMembers } from "./fetch-members";

/** 結果を画面に出すだけの入れ物。読者に見せるのは fetch-members.ts のほう */
export function FetchDemo() {
  useTrackDemoRender();

  const [result, setResult] = useState("まだ取りに行っていません");

  const load = async (path: string) => {
    setResult("読み込み中…");
    setResult(await loadMembers(path));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Button size="sm" onClick={() => load("/api/members")}>
          取ってくる
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => load("/api/does-not-exist")}
        >
          わざと失敗させる
        </Button>
      </div>

      <p className="rounded-md border p-3 text-sm">{result}</p>
    </div>
  );
}
