"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { memo, useState } from "react";

// さっきと同じように memo で包んである
const Memoized = memo(function Memoized({ user }: { user: { name: string } }) {
  return (
    <RenderBox title="memo あり（オブジェクトを受け取る）" tone="highlight">
      {user.name} さん
    </RenderBox>
  );
});

export function MemoBroken() {
  useTrackDemoRender();

  const [count, setCount] = useState(0);

  // 描き直されるたびに、新しいオブジェクトが作られる
  const user = { name: "さとう" };

  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-md border p-3 font-mono">count: {count}</p>

      <Button size="sm" onClick={() => setCount((c) => c + 1)}>
        count を増やす（user の中身は変わらない）
      </Button>

      <Memoized user={user} />
    </div>
  );
}
