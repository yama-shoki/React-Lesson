"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function LoginView() {
  // このカードが描き直された回数を数えるための 1 行（教材の仕掛け）
  useTrackDemoRender();

  // 画面が持っている状態は、この 1 つだけ
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between rounded-md border px-3 py-2">
        <span className="text-muted-foreground">ヘッダー</span>
        <span className="font-semibold">
          {isLoggedIn ? "さとうさん" : "ゲスト"}
        </span>
      </div>

      <div className="rounded-md border px-3 py-2">
        {isLoggedIn
          ? "会員向けの内容が表示されています"
          : "ログインすると内容が表示されます"}
      </div>

      <Button size="sm" onClick={() => setIsLoggedIn(!isLoggedIn)}>
        {isLoggedIn ? "ログアウトする" : "ログインする"}
      </Button>
    </div>
  );
}
