"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { PokemonCard } from "./pokemon-card";
import type { Pokemon } from "./types";

/*
  この lint は「effect の中で setState するな」と言う。ふだんは正しい
  （Part 6「その useEffect は要らない」でやったとおり）。
  ただし外の世界から返ってきた値を受け取る場面は例外で、
  取ってきた結果をどこかに置く手段が state しかない。
  この章は、その例外をあえて手で書いてみる章。
*/
/* eslint-disable react-hooks/set-state-in-effect */

/** とりうる状態を並べる。真偽値を増やさない */
type Status = "idle" | "loading" | "done" | "error";

export function PokemonSearch() {
  useTrackDemoRender();

  const [keyword, setKeyword] = useState("");

  // 打ち終わってから 400ms で、こちらが追いつく
  const [query] = useDebounce(keyword.trim(), 400);

  const [status, setStatus] = useState<Status>("idle");
  const [results, setResults] = useState<Pokemon[]>([]);
  const [message, setMessage] = useState("");

  // ❌ の版と見比べるための回数。実装の本筋ではない
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    if (!query) {
      setStatus("idle");
      setResults([]);
      return;
    }

    // この問い合わせを、あとから取り消すためのリモコン
    const controller = new AbortController();

    const search = async () => {
      setStatus("loading");
      setRequestCount((count) => count + 1);

      try {
        const response = await fetch(
          `/api/pokemon?q=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(`サーバーが ${response.status} を返しました`);
        }

        const data = await response.json();
        setResults(data.results);
        setStatus("done");
      } catch (error) {
        // 自分で取り消したときは、失敗として扱わない
        if (error instanceof DOMException && error.name === "AbortError") return;

        setMessage(error instanceof Error ? error.message : "失敗しました");
        setStatus("error");
      }
    };

    search();

    // 次の入力が来たら、走っている問い合わせを取り消す
    return () => controller.abort();
  }, [query]);

  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder="ポケモンの名前（例: ピ、リザ、ミュウ）"
        aria-label="ポケモンの名前（例: ピ、リザ、ミュウ）"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
      />

      <p className="text-sm text-muted-foreground">
        問い合わせた回数: <strong>{requestCount}</strong>
      </p>

      {status === "loading" && (
        <p className="text-sm text-muted-foreground">探しています…</p>
      )}

      {status === "error" && <p className="text-sm text-destructive">{message}</p>}

      {status === "done" && results.length === 0 && (
        <p className="text-sm text-muted-foreground">
          「{query}」に当てはまる名前は見つかりませんでした
        </p>
      )}

      <ul className="grid gap-2 sm:grid-cols-2">
        {results.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </ul>
    </div>
  );
}
