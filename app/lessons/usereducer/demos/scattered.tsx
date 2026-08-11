"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function Scattered() {
  useTrackDemoRender();

  // 1 つのフォームなのに、state が 3 つに散らばっている
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);

  // リセットするには、3 つとも書く必要がある
  const reset = () => {
    setName("");
    setEmail("");
    setAgreed(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder="名前"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <Input
        placeholder="メールアドレス"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(event) => setAgreed(event.target.checked)}
        />
        規約に同意する
      </label>

      <Button size="sm" variant="outline" onClick={reset}>
        リセット
      </Button>
    </div>
  );
}
