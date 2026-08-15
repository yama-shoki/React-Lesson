"use client";

import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

/* eslint-disable react-hooks/set-state-in-effect */

type Profile = { id: string; name: string; role: string };

/** 後片付けなし。古い返事が、新しい返事を上書きする */
function WithoutCleanup({ id }: { id: string | null }) {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!id) return;
    setProfile(null);

    fetch(`/api/profile?id=${id}`)
      .then((response) => response.json())
      .then((data) => setProfile(data));
  }, [id]);

  return (
    <RenderBox title="後片付けなし">
      表示中: {profile ? `${profile.name}（${profile.role}）` : "…"}
    </RenderBox>
  );
}

/** 後片付けあり。古い返事は捨てる */
function WithCleanup({ id }: { id: string | null }) {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!id) return;
    setProfile(null);

    // この effect が「まだ有効か」の目印
    let ignore = false;

    fetch(`/api/profile?id=${id}`)
      .then((response) => response.json())
      .then((data) => {
        // 古くなっていたら、返ってきた結果を捨てる
        if (!ignore) setProfile(data);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  return (
    <RenderBox title="後片付けあり" tone="highlight">
      表示中: {profile ? `${profile.name}（${profile.role}）` : "…"}
    </RenderBox>
  );
}

export function Race() {
  const [id, setId] = useState<string | null>(null);

  // 1 番を選んだ直後に 2 番へ切り替える。
  // 手で押しても同じだが、確実に再現するようにしてある
  const switchQuickly = () => {
    setId("1");
    setTimeout(() => setId("2"), 200);
  };

  return (
    <div className="flex flex-col gap-4">
      <Button size="sm" onClick={switchQuickly}>
        1 番 → 2 番と続けて切り替える
      </Button>

      <p className="text-sm text-muted-foreground">
        いま選んでいるのは {id ? `${id} 番` : "まだ何も選んでいません"}
      </p>

      <WithoutCleanup id={id} />
      <WithCleanup id={id} />
    </div>
  );
}
