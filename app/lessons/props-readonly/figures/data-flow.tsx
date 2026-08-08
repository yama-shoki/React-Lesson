/**
 * 値は上から下へ、知らせは下から上へ、という流れの図。
 *
 * 子が props を書き換えられないのは制限ではなく、
 * 「値の出どころを 1 か所に保つ」ための設計だと伝えたい。
 */
export const DataFlowFigure = () => (
  <figure className="not-prose my-6 max-w-lg">
    <svg
      viewBox="0 0 420 200"
      className="w-full"
      role="img"
      aria-label="値は親から子へ渡り、知らせは子から親へ戻る"
    >
      <defs>
        <marker
          id="flow-down"
          viewBox="0 0 10 10"
          refX={8}
          refY={5}
          markerWidth={5}
          markerHeight={5}
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" className="fill-[var(--connection)]" />
        </marker>
        <marker
          id="flow-up"
          viewBox="0 0 10 10"
          refX={8}
          refY={5}
          markerWidth={5}
          markerHeight={5}
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" className="fill-foreground/50" />
        </marker>
      </defs>

      {/* 親 */}
      <rect
        x={110}
        y={12}
        width={200}
        height={52}
        rx={8}
        className="fill-transparent stroke-border"
        strokeWidth={1.5}
      />
      <text x={210} y={34} textAnchor="middle" className="fill-foreground" fontSize={13}>
        親
      </text>
      <text x={210} y={52} textAnchor="middle" className="fill-muted-foreground" fontSize={11}>
        値を持っているのはここだけ
      </text>

      {/* 下向き: 値 */}
      <path
        d="M 165 68 L 165 130"
        className="stroke-[var(--connection)]"
        strokeWidth={1.5}
        markerEnd="url(#flow-down)"
      />
      <text x={158} y={104} textAnchor="end" className="fill-[var(--connection)]" fontSize={11}>
        値を渡す
      </text>

      {/* 上向き: 知らせ */}
      <path
        d="M 255 130 L 255 68"
        className="stroke-foreground/50"
        strokeWidth={1.5}
        markerEnd="url(#flow-up)"
      />
      <text x={262} y={104} className="fill-muted-foreground" fontSize={11}>
        押されたと伝える
      </text>

      {/* 子 */}
      <rect
        x={110}
        y={134}
        width={200}
        height={52}
        rx={8}
        className="fill-transparent stroke-border"
        strokeWidth={1.5}
      />
      <text x={210} y={156} textAnchor="middle" className="fill-foreground" fontSize={13}>
        子
      </text>
      <text x={210} y={174} textAnchor="middle" className="fill-muted-foreground" fontSize={11}>
        受け取って表示するだけ
      </text>
    </svg>

    <figcaption className="mt-1 text-sm text-muted-foreground">
      子は値を書き換えない。書き換えるのは、値を持っている親の仕事
    </figcaption>
  </figure>
);
