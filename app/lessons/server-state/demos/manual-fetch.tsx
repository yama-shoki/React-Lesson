"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

/*
  自分で書くとこうなる、という例。
  lint はこの書き方を「描き直しが連鎖する」として止めてくる。
  それも含めて「自前で正しく書くのは大変だ」という話なので、
  このファイルだけ黙らせている。
*/
/* eslint-disable react-hooks/set-state-in-effect */

export function ManualFetch() {
  useTrackDemoRender();

  // 取得したデータのために、state が 3 つも必要になる
  const [members, setMembers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);

    fetch("/api/members")
      .then((res) => res.json())
      .then((data) => setMembers(data.members))
      .catch(() => setError("取得に失敗しました"))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {isLoading && <p className="text-muted-foreground">読み込み中…</p>}
      {error && <p className="text-destructive">{error}</p>}

      {!isLoading && !error && (
        <ul className="flex flex-wrap gap-2">
          {members.map((member) => (
            <li key={member} className="rounded-md border px-3 py-1.5">
              {member}
            </li>
          ))}
        </ul>
      )}

      <Button size="sm" variant="outline" disabled>
        取り直す（自分で書くと、ここも作り込みが要る）
      </Button>
    </div>
  );
}
