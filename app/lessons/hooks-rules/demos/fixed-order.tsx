"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function FixedOrder() {
  // ◯ フックは、いつも関数のいちばん上に並べる。条件を付けない
  const [showNickname, setShowNickname] = useState(false);
  const [nickname, setNickname] = useState("");

  // 出し分けるのは「呼ぶかどうか」ではなく「表示するかどうか」
  if (showNickname) {
    return (
      <div className="flex flex-col gap-3">
        <Input
          placeholder="ニックネーム"
          aria-label="ニックネーム"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
        />
        <Button size="sm" onClick={() => setShowNickname(false)}>
          閉じる
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        {nickname
          ? `入力ずみ: ${nickname}（閉じても覚えています）`
          : "ボタンを押すと、入力欄が出てきます"}
      </p>
      <Button size="sm" onClick={() => setShowNickname(true)}>
        ニックネームを入力する
      </Button>
    </div>
  );
}
