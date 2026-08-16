/**
 * 1 つの画面の中で、値ごとに置き場所が違うことを示す図。
 *
 * Part 9 では置き場所を 1 つずつ別々に見てきた。
 * ここでは、同じ画面の中で 3 つが同時に使われていることを見せる。
 */
const rows = [
  {
    where: "useState",
    what: "入力途中の品名",
    why: "この画面から離れたら消えてよい",
  },
  {
    where: "URL",
    what: "絞り込みの条件",
    why: "人に見せたい・戻るで戻りたい",
  },
  {
    where: "localStorage",
    what: "買うもの本体",
    why: "閉じても残ってほしい",
  },
];

export const StatePlacementFigure = () => (
  <figure className="not-prose my-6 max-w-2xl">
    <svg
      viewBox="0 0 560 260"
      className="w-full"
      role="img"
      aria-label="1 つの画面の中で、値ごとに置き場所が違うことを示す図"
    >
      {/* 画面の枠 */}
      <rect
        x={16}
        y={16}
        width={190}
        height={228}
        rx={10}
        className="fill-transparent stroke-foreground/25"
        strokeWidth={1.5}
      />
      <text x={111} y={38} textAnchor="middle" className="fill-muted-foreground" fontSize={11}>
        買い物リストの画面
      </text>

      <defs>
        <marker
          id="place-arrow"
          viewBox="0 0 10 10"
          refX={8}
          refY={5}
          markerWidth={5}
          markerHeight={5}
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" className="fill-foreground/40" />
        </marker>
      </defs>

      {rows.map((row, index) => {
        const y = 62 + index * 64;
        return (
          <g key={row.where}>
            {/* 画面の中の要素 */}
            <rect
              x={32}
              y={y}
              width={158}
              height={38}
              rx={6}
              className="fill-transparent stroke-foreground/40"
              strokeWidth={1.5}
            />
            <text x={111} y={y + 24} textAnchor="middle" className="fill-foreground" fontSize={12}>
              {row.what}
            </text>

            {/* 置き場所へ */}
            <path
              d={`M 198 ${y + 19} L 306 ${y + 19}`}
              className="stroke-foreground/40"
              strokeWidth={1.5}
              markerEnd="url(#place-arrow)"
            />

            <rect
              x={314}
              y={y}
              width={130}
              height={38}
              rx={6}
              className="fill-transparent stroke-foreground/40"
              strokeWidth={1.5}
            />
            <text x={379} y={y + 24} textAnchor="middle" className="fill-foreground font-mono" fontSize={12}>
              {row.where}
            </text>

            <text x={456} y={y + 17} className="fill-muted-foreground" fontSize={10}>
              {row.why.slice(0, 11)}
            </text>
            <text x={456} y={y + 31} className="fill-muted-foreground" fontSize={10}>
              {row.why.slice(11)}
            </text>
          </g>
        );
      })}
    </svg>

    <figcaption className="mt-1 text-sm text-muted-foreground">
      置き場所は画面ごとではなく、値ごとに決まる
    </figcaption>
  </figure>
);
