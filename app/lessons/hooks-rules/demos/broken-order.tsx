"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

/*
  わざと決まりを破っている例。
  lint は「条件分岐の中でフックを呼ぶな」と止めてくるが、
  破ると何が起きるかを見せたいので、このファイルだけ黙らせている。
*/
/* eslint-disable react-hooks/rules-of-hooks */

export function BrokenOrder() {
  const [showNickname, setShowNickname] = useState(false);

  // ✕ if の中でフックを呼んでいる。呼ばれる回と呼ばれない回ができる
  if (showNickname) {
    const [nickname, setNickname] = useState("");

    return (
      <div className="flex flex-col gap-3">
        <Input
          placeholder="ニックネーム"
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
        ボタンを押すと、入力欄が出てきます
      </p>
      <Button size="sm" onClick={() => setShowNickname(true)}>
        ニックネームを入力する
      </Button>
    </div>
  );
}
