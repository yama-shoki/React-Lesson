"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { PokemonCard } from "./pokemon-card";
import type { Pokemon } from "./types";

/*
  素直に書いた検索。動きはします。
  ですが、通信でよく起きる 3 つの問題がそのまま出ます。

  下の lint 抑制は「取ってきた結果を state に置く」ため。
  外から返ってきた値の置き場所は state しかないので、ここは例外にあたる。
*/
/* eslint-disable react-hooks/set-state-in-effect */

export function NaiveSearch() {
  useTrackDemoRender();

  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<Pokemon[]>([]);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    if (!keyword) {
      setResults([]);
      return;
    }

    setRequestCount((count) => count + 1);

    // ✕ 打つたびに飛ぶ。前の問い合わせも取り消していない
    fetch(`/api/pokemon?q=${encodeURIComponent(keyword)}`)
      .then((res) => res.json())
      .then((data) => setResults(data.results));
  }, [keyword]);

  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder="ポケモンの名前（例: ピ）"
        aria-label="ポケモンの名前（例: ピ）"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
      />

      <p className="text-sm text-muted-foreground">
        問い合わせた回数: <strong>{requestCount}</strong>
      </p>

      {/* 見た目の部品は ✅ 版と同じものを使う。違うのは取ってくる方だけ */}
      <ul className="grid gap-2 sm:grid-cols-2">
        {results.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </ul>
    </div>
  );
}
