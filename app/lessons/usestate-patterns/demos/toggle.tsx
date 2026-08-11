"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Toggle() {
  useTrackDemoRender();

  // いちばんよく使う形。true / false の 2 択
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      {/* いまの反対を入れる = 切り替え */}
      <Button size="sm" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "閉じる" : "開く"}
      </Button>

      {isOpen && (
        <p className="rounded-md border p-3 text-sm text-muted-foreground">
          開いたときだけ出てくる中身です。
        </p>
      )}
    </div>
  );
}
