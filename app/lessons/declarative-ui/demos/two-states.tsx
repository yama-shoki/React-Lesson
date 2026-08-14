"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { useState } from "react";

export function TwoStates() {
  useTrackDemoRender();

  // 状態は 2 つだけ
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isLoggedIn}
            onChange={(event) => setIsLoggedIn(event.target.checked)}
          />
          ログイン中
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={hasUnread}
            onChange={(event) => setHasUnread(event.target.checked)}
          />
          未読あり
        </label>
      </div>

      {/* 画面の 3 か所が、上の 2 つから自動的に決まる */}
      <div className="flex flex-col gap-2 rounded-md border p-3 text-sm">
        <p className="font-semibold">
          {isLoggedIn ? "さとうさん" : "ゲスト"}
          {isLoggedIn && hasUnread && (
            <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
              未読
            </span>
          )}
        </p>

        <p className="text-muted-foreground">
          {isLoggedIn
            ? hasUnread
              ? "新しいお知らせがあります"
              : "新しいお知らせはありません"
            : "ログインすると内容が表示されます"}
        </p>

        {/*
          ここは表示だけの飾り。直前の「うまくいかない例」には
          見た目がそっくりで押すと動くボタンがあるので、
          押せないことが見て分かるようにしておく。
        */}
        <button
          type="button"
          disabled
          className="self-start rounded-md border px-3 py-1.5 opacity-50"
        >
          {isLoggedIn ? "ログアウトする" : "ログインする"}
        </button>
      </div>
    </div>
  );
}
