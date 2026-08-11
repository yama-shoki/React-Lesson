"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function DoubleSend() {
  useTrackDemoRender();

  const [sent, setSent] = useState<number[]>([]);

  // 送信中かどうかを持っていない。だから何度でも押せてしまう
  const send = async () => {
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "注文" }),
    });
    const data = await response.json();

    setSent((current) => [...current, data.id]);
  };

  return (
    <div className="flex flex-col gap-3">
      <Button size="sm" variant="outline" onClick={send}>
        注文する（連打してみる）
      </Button>

      <p className="text-sm">
        送られた回数: <strong>{sent.length}</strong>
      </p>
    </div>
  );
}
