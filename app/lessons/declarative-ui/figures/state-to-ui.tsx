/**
 * 「状態がひとつ変わると、表示が全部そろって変わる」ことを示す図。
 *
 * 命令的に書くと、この矢印を人間が 1 本ずつ引き直すことになる。
 * React では状態を変えるだけで、矢印の先が自動でそろう。
 */
export const StateToUiFigure = () => (
  <figure className="not-prose my-6 max-w-xl">
    <svg
      viewBox="0 0 500 190"
      className="w-full"
      role="img"
      aria-label="ひとつの状態から、画面の複数の場所が決まる"
    >
      <defs>
        <marker
          id="state-arrow"
          viewBox="0 0 10 10"
          refX={8}
          refY={5}
          markerWidth={5}
          markerHeight={5}
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" className="fill-foreground/35" />
        </marker>
      </defs>

      {/* 状態 */}
      <rect
        x={12}
        y={70}
        width={140}
        height={48}
        rx={8}
        className="fill-[var(--connection)]/10 stroke-[var(--connection)]/60"
        strokeWidth={1.5}
      />
      <text x={82} y={90} textAnchor="middle" className="fill-muted-foreground" fontSize={11}>
        状態
      </text>
      <text x={82} y={107} textAnchor="middle" className="fill-foreground font-mono" fontSize={12}>
        isLoggedIn
      </text>

      {/* 3 本の矢印 */}
      {[38, 94, 150].map((y) => (
        <path
          key={y}
          d={`M 158 94 C 210 94, 210 ${y + 16}, 268 ${y + 16}`}
          fill="none"
          className="stroke-foreground/35"
          strokeWidth={1.5}
          markerEnd="url(#state-arrow)"
        />
      ))}

      {/* 画面の 3 か所 */}
      {[
        { y: 38, label: "ヘッダーの名前" },
        { y: 94, label: "本文の内容" },
        { y: 150, label: "ボタンの文字" },
      ].map((row) => (
        <g key={row.label}>
          <rect
            x={276}
            y={row.y}
            width={212}
            height={32}
            rx={6}
            className="fill-transparent stroke-border"
            strokeWidth={1.5}
          />
          <text
            x={382}
            y={row.y + 21}
            textAnchor="middle"
            className="fill-foreground"
            fontSize={12}
          >
            {row.label}
          </text>
        </g>
      ))}
    </svg>

    <figcaption className="mt-1 text-sm text-muted-foreground">
      状態を 1 つ変えれば、そこから決まる表示はすべてそろって変わる
    </figcaption>
  </figure>
);
