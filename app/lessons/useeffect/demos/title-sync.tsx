"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function TitleSync() {
  // このカードが描き直された回数を数えるための 1 行（教材の仕掛け）
  useTrackDemoRender();

  const [count, setCount] = useState(0);

  useEffect(() => {
    // ブラウザのタブ名は React の管理外。ここで直接書き換える
    document.title = `${count} 回押されました`;

    // このページを離れるときは元に戻す（次の章で詳しく扱う）
    return () => {
      document.title = "React 入門";
    };
  }, [count]); // count が変わったときだけ実行される

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-lg font-semibold tabular-nums">
        {count}
      </span>
      <Button size="sm" onClick={() => setCount((c) => c + 1)}>
        押す（タブ名を見て）
      </Button>
    </div>
  );
}
