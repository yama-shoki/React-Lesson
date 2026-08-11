/*
  待っている間に置いておく「型」。
  本体と同じ高さ (h-24) にしてあるので、
  差し替わった瞬間に周りがガタッと動かない。
*/

export function ListSkeleton() {
  return (
    <ul className="flex h-24 flex-wrap items-center gap-2" aria-hidden>
      {[3, 4, 3, 4].map((width, index) => (
        <li
          // 見た目だけの飾りなので index を key にしてよい（並び替わらない）
          key={index}
          className="h-8 animate-pulse rounded-md bg-muted"
          style={{ width: `${width}rem` }}
        />
      ))}
    </ul>
  );
}
