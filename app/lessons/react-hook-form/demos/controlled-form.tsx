"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function ControlledForm() {
  useTrackDemoRender();

  // 1 文字打つたびに state が変わる = このフォーム全体が描き直される
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");

  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder="名前"
        aria-label="名前"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <Input
        placeholder="メールアドレス"
        aria-label="メールアドレス"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Input
        placeholder="年齢"
        aria-label="年齢"
        value={age}
        onChange={(event) => setAge(event.target.value)}
      />

      <Button size="sm" disabled>
        送信
      </Button>
    </div>
  );
}
