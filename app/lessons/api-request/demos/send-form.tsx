"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// Part 4 でやった形。真偽値を並べず、1 つの state にまとめる
type Status = "idle" | "sending" | "done" | "error";

export function SendForm() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const send = async () => {
    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/messages", {
        // 取ってくるときと違い、送るときは書くことが増える
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        // サーバーが返してきた理由をそのまま見せる
        throw new Error(data.message ?? "送信に失敗しました");
      }

      setStatus("done");
      setMessage(`送信しました（id: ${data.id}）`);
      setText("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "送信に失敗しました");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder="ひとこと（「エラー」と入れると失敗します）"
        aria-label="ひとこと（「エラー」と入れると失敗します）"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />

      {/* 送信中は押せなくする。これが二重送信を防ぐ */}
      <Button size="sm" onClick={send} disabled={status === "sending"}>
        {status === "sending" ? "送信中…" : "送信"}
      </Button>

      {message && (
        <p
          className={
            status === "error" ? "text-sm text-destructive" : "text-sm text-emerald-700 dark:text-emerald-400"
          }
        >
          {message}
        </p>
      )}
    </div>
  );
}
