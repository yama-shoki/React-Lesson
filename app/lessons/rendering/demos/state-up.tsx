"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

function HeavyList() {
  return (
    <RenderBox title="一覧（入力とは無関係）">
      <ul className="flex gap-2 text-sm">
        <li>さとう</li>
        <li>すずき</li>
        <li>たかはし</li>
      </ul>
    </RenderBox>
  );
}

export function StateUp() {
  useTrackDemoRender();

  // 入力欄でしか使っていない state を、いちばん外側が持っている
  const [keyword, setKeyword] = useState("");

  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder="ここに打つ"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
      />

      <Button size="sm" variant="outline" disabled>
        {keyword ? `「${keyword}」で検索` : "検索"}
      </Button>

      {/* keyword を受け取っていないのに、一緒に描き直される */}
      <HeavyList />
    </div>
  );
}
