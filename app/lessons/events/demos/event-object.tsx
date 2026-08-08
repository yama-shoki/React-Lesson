"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";

export function EventObject() {
  const [text, setText] = useState("");

  // ハンドラは、何が起きたかを説明するオブジェクトを受け取る
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // event.target が入力欄そのもの。その value が今の文字
    setText(event.target.value);
  };

  return (
    <div className="flex flex-col gap-3">
      <Input placeholder="何か入力してみる" onChange={handleChange} />
      <p className="rounded-md border p-3">
        {text === "" ? "まだ入力されていません" : `${text.length} 文字: ${text}`}
      </p>
    </div>
  );
}
