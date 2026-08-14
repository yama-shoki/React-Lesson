"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// 値を受け取って、問題があればその内容を返すだけの関数。
// React とは無関係なので、単体で読めるし試せる
const validateEmail = (value: string) => {
  if (value.trim() === "") return "メールアドレスを入力してください";
  if (!value.includes("@")) return "@ が含まれていません";
  return null;
};

export function Validation() {
  // このカードが描き直された回数を数えるための 1 行（教材の仕掛け）
  useTrackDemoRender();

  const [email, setEmail] = useState("");
  // 一度でも触ったかどうか。触る前からエラーを出さないために持つ
  const [touched, setTouched] = useState(false);

  // エラーは state にしない。値から計算できる
  const error = validateEmail(email);
  const showError = touched && error !== null;

  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder="メールアドレス"
        aria-label="メールアドレス"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        // 入力欄から離れた時点で「触った」とみなす
        onBlur={() => setTouched(true)}
        aria-invalid={showError}
      />

      {showError && <p className="text-sm text-red-600">{error}</p>}

      <Button size="sm" disabled={error !== null}>
        送信
      </Button>
    </div>
  );
}
