"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// 「押されたら何をするか」は決めない。呼ぶだけ
function LikeButton({
  count,
  onLike,
}: {
  count: number;
  // 関数も props で渡せる。「引数なし・戻り値なし」という型
  onLike: () => void;
}) {
  return (
    <Button size="sm" variant="outline" onClick={onLike}>
      いいね {count}
    </Button>
  );
}

export function CallbackProp() {
  useTrackDemoRender();

  const [count, setCount] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-3">
      {/* 何をするかは、使う側がここで決める */}
      <LikeButton
        count={count}
        onLike={() => {
          setCount(count + 1);
          setLog([`${count + 1} 回目`, ...log].slice(0, 3));
        }}
      />

      <p className="text-sm text-muted-foreground">
        {log.length === 0 ? "まだ押されていません" : log.join(" / ")}
      </p>
    </div>
  );
}
