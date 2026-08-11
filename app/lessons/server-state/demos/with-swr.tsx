"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function WithSwr() {
  useTrackDemoRender();

  // 読み込み中も、失敗も、取り直しも、これ 1 行に含まれている
  const { data, error, isLoading, mutate } = useSWR<{ members: string[] }>(
    "/api/members",
    fetcher,
  );

  return (
    <div className="flex flex-col gap-3">
      {isLoading && <p className="text-muted-foreground">読み込み中…</p>}
      {error && <p className="text-red-600">取得に失敗しました</p>}

      {data && (
        <ul className="flex flex-wrap gap-2">
          {data.members.map((member) => (
            <li key={member} className="rounded-md border px-3 py-1.5">
              {member}
            </li>
          ))}
        </ul>
      )}

      <Button size="sm" variant="outline" onClick={() => mutate()}>
        取り直す
      </Button>
    </div>
  );
}
