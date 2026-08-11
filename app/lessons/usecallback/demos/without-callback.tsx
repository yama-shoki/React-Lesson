"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { memo, useState } from "react";

// memo で包んである。props が変わらなければスキップされるはず
const Child = memo(function Child({ onSave }: { onSave: () => void }) {
  return (
    <RenderBox title="memo した子">
      <Button size="sm" variant="outline" onClick={onSave}>
        保存
      </Button>
    </RenderBox>
  );
});

export function WithoutCallback() {
  useTrackDemoRender();

  const [count, setCount] = useState(0);
  const [saved, setSaved] = useState(0);

  // 描き直されるたびに、新しい関数が作られる
  const handleSave = () => setSaved((s) => s + 1);

  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-md border p-3 font-mono">
        count: {count} / 保存した回数: {saved}
      </p>

      <Button size="sm" onClick={() => setCount((c) => c + 1)}>
        count を増やす（子には関係ない）
      </Button>

      <Child onSave={handleSave} />
    </div>
  );
}
