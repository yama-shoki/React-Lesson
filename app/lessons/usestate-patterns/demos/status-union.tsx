"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// とりうる状態を並べて書く。この 4 つ以外にはなれない
type Status = "idle" | "sending" | "done" | "error";

export function StatusUnion() {
  useTrackDemoRender();

  const [status, setStatus] = useState<Status>("idle");

  const send = (shouldFail: boolean) => {
    setStatus("sending");

    setTimeout(() => {
      setStatus(shouldFail ? "error" : "done");
    }, 800);
  };

  // 表示は 1 か所にまとまる。どの状態でも必ず 1 つだけ選ばれる
  const message = {
    idle: "待機中",
    sending: "送信中…",
    done: "送信しました",
    error: "失敗しました",
  }[status];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => send(false)}
          disabled={status === "sending"}
        >
          送信（成功する）
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => send(true)}
          disabled={status === "sending"}
        >
          送信（失敗する）
        </Button>
      </div>

      <p className="text-sm">{message}</p>
    </div>
  );
}
