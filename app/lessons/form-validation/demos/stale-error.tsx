"use client";

import { RenderBox } from "@/components/lesson/render-box";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const validateEmail = (value: string) => {
  if (value === "") return "メールアドレスを入力してください";
  if (!value.includes("@")) return "@ が入っていません";
  return null;
};

export function StaleError() {
  const [email, setEmail] = useState("");

  // ✕ エラーを state で二重に持っている
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder="メールアドレス"
        aria-label="メールアドレス"
        value={email}
        // 入力時に setError を呼んでいない。ここが抜けの入口
        onChange={(event) => setEmail(event.target.value)}
      />

      <Button size="sm" onClick={() => setError(validateEmail(email))}>
        確認する
      </Button>

      <RenderBox title="表示されているエラー">
        {error ?? "（なし）"}
      </RenderBox>
    </div>
  );
}
