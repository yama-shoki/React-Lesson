"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function EventObject() {
  // このカードが描き直された回数を数えるための 1 行（教材の仕掛け）
  useTrackDemoRender();

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
