import { pokemonIndex } from "@/lib/pokemon-index";
import { NextResponse } from "next/server";

/*
  ブラウザから PokeAPI を直接叩かず、いったんここを通している。

  1. 日本語で探すための対応表が、こちら側にある
  2. 外の API の形を、こちらが決めた形に整えてから返せる
     （向こうの都合で形が変わっても、画面側は直さなくて済む）
  3. 秘密の鍵が要る API なら、鍵をブラウザに出さずに済む
     （PokeAPI に鍵は要らないが、実務ではこれが主な理由になる）
*/

const POKE_API = "https://pokeapi.co/api/v2";

/** 画面に返す形。向こうの巨大な JSON から、要るものだけ抜き出す */
export type Pokemon = {
  id: number;
  name: string;
  imageUrl: string | null;
  types: string[];
  /** cm */
  height: number;
  /** kg */
  weight: number;
};

/** タイプ名の日本語。ここも向こうは英語しか返さない */
const typeNames: Record<string, string> = {
  normal: "ノーマル",
  fire: "ほのお",
  water: "みず",
  electric: "でんき",
  grass: "くさ",
  ice: "こおり",
  fighting: "かくとう",
  poison: "どく",
  ground: "じめん",
  flying: "ひこう",
  psychic: "エスパー",
  bug: "むし",
  rock: "いわ",
  ghost: "ゴースト",
  dragon: "ドラゴン",
  dark: "あく",
  steel: "はがね",
  fairy: "フェアリー",
};

export async function GET(request: Request) {
  const keyword = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  if (!keyword) return NextResponse.json({ results: [] });

  // 日本語名の部分一致で候補を絞る。ここは対応表を見るだけなので速い
  const hits = pokemonIndex
    .filter((entry) => entry.ja.includes(keyword))
    .slice(0, 6);

  if (hits.length === 0) return NextResponse.json({ results: [] });

  // 候補の詳細だけを取りに行く。6 件までなのでまとめて待てる
  const results = await Promise.all(
    hits.map(async (entry) => {
      const response = await fetch(`${POKE_API}/pokemon/${entry.en}`, {
        // 同じ問い合わせを何度も外へ飛ばさないよう、1 時間ためておく
        next: { revalidate: 3600 },
      });

      if (!response.ok) throw new Error(`PokeAPI が ${response.status} を返しました`);

      const data = await response.json();

      return {
        id: entry.id,
        name: entry.ja,
        imageUrl: data.sprites?.other?.["official-artwork"]?.front_default ?? null,
        types: data.types.map(
          (t: { type: { name: string } }) => typeNames[t.type.name] ?? t.type.name,
        ),
        height: data.height * 10,
        weight: data.weight / 10,
      } satisfies Pokemon;
    }),
  );

  return NextResponse.json({ results });
}
