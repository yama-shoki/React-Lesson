import type { Pokemon } from "./types";

/*
  1 匹ぶんの見た目だけを持つ部品。
  通信のことも、検索のことも知らない。
*/

export function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  return (
    <li className="flex items-center gap-3 rounded-md border p-3">
      {pokemon.imageUrl && (
        // 外部の画像なので、next/image ではなく素の img を使っている
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={pokemon.imageUrl}
          alt={pokemon.name}
          width={80}
          height={80}
          className="size-20 shrink-0"
          loading="lazy"
        />
      )}

      <div className="min-w-0">
        <p className="font-semibold">
          {pokemon.name}
          <span className="ml-2 font-mono text-xs text-muted-foreground">
            No.{pokemon.id}
          </span>
        </p>
        <p className="text-sm text-muted-foreground">
          {pokemon.types.join(" / ")}
        </p>
        <p className="text-xs text-muted-foreground">
          {pokemon.height}cm / {pokemon.weight}kg
        </p>
      </div>
    </li>
  );
}
