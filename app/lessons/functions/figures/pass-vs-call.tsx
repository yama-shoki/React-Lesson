/**
 * 「関数を渡す」と「実行結果を渡す」の違いの図。
 *
 * onClick={handleClick} と onClick={handleClick()} の差はここに尽きる。
 * 括弧ひとつで意味が変わることを、渡っているものの形で見せる。
 */
export const PassVsCallFigure = () => (
  <figure className="not-prose my-6 max-w-xl">
    <svg
      viewBox="0 0 520 190"
      className="w-full"
      role="img"
      aria-label="関数を渡す場合と、実行結果を渡す場合の違い"
    >
      <defs>
        <marker
          id="pass-arrow"
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

      {/* 上段: 関数そのものを渡す */}
      <text x={16} y={22} className="fill-emerald-600" fontSize={12}>
        ○ 関数そのものを渡す
      </text>
      <rect
        x={16}
        y={32}
        width={168}
        height={40}
        rx={6}
        className="fill-transparent stroke-emerald-500/60"
        strokeWidth={1.5}
      />
      <text x={100} y={57} textAnchor="middle" className="fill-foreground font-mono" fontSize={12}>
        runTwice(say)
      </text>

      <path
        d="M 190 52 L 268 52"
        className="stroke-foreground/40"
        strokeWidth={1.5}
        markerEnd="url(#pass-arrow)"
      />

      <rect
        x={276}
        y={32}
        width={228}
        height={40}
        rx={6}
        className="fill-transparent stroke-border"
        strokeWidth={1.5}
      />
      <text x={390} y={49} textAnchor="middle" className="fill-foreground" fontSize={11}>
        あとで runTwice が呼んでくれる
      </text>
      <text x={390} y={64} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize={10}>
        say() say()
      </text>

      {/* 下段: 実行結果を渡す */}
      <text x={16} y={112} className="fill-red-600" fontSize={12}>
        ✕ 先に実行して、結果を渡す
      </text>
      <rect
        x={16}
        y={122}
        width={168}
        height={40}
        rx={6}
        className="fill-transparent stroke-red-500/60"
        strokeWidth={1.5}
      />
      <text x={100} y={147} textAnchor="middle" className="fill-foreground font-mono" fontSize={12}>
        runTwice(say())
      </text>

      <path
        d="M 190 142 L 268 142"
        className="stroke-foreground/40"
        strokeWidth={1.5}
        markerEnd="url(#pass-arrow)"
      />

      <rect
        x={276}
        y={122}
        width={228}
        height={40}
        rx={6}
        className="fill-transparent stroke-border"
        strokeWidth={1.5}
      />
      <text x={390} y={139} textAnchor="middle" className="fill-foreground" fontSize={11}>
        渡る前に実行が終わっている
      </text>
      <text x={390} y={154} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize={10}>
        undefined が渡る
      </text>
    </svg>

    <figcaption className="mt-1 text-sm text-muted-foreground">
      括弧をつけた時点で実行される。渡っているのは関数ではなく結果
    </figcaption>
  </figure>
);
