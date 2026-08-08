"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Uncontrolled() {
  // このカードが描き直された回数を数えるための 1 行（教材の仕掛け）
  useTrackDemoRender();

  return (
    <div className="flex flex-col gap-3">
      {/* 値を React に渡していない。入力欄が自分で値を持っている */}
      <Input placeholder="名前を入力" />

      <div className="flex items-center gap-2">
        <Button size="sm" disabled>
          送信（今の値が分からないので何もできない）
        </Button>
      </div>
    </div>
  );
}
