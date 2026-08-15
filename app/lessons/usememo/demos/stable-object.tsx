"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { memo, useMemo, useState } from "react";

const Card = memo(function Card({
  user,
  title,
}: {
  user: { name: string };
  title: string;
}) {
  return (
    <RenderBox title={title} tone="highlight">
      {user.name} さん
    </RenderBox>
  );
});

export function StableObject() {
  useTrackDemoRender();

  const [count, setCount] = useState(0);
  const [name] = useState("さとう");

  // ✕ 描き直されるたびに、新しいオブジェクト
  const plain = { name };

  // ○ name が変わったときだけ、新しいオブジェクト
  const stable = useMemo(() => ({ name }), [name]);

  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-md border p-3 font-mono">count: {count}</p>

      <Button size="sm" onClick={() => setCount((c) => c + 1)}>
        count を増やす（name は変わらない）
      </Button>

      <Card user={plain} title="そのまま渡す" />
      <Card user={stable} title="useMemo で包んで渡す" />
    </div>
  );
}
