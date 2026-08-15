/**
 * 「同じ箱を指す 2 枚の名札」と「見た目が同じ別々の箱」の対比図。
 *
 * === が何を比べているのかは、この絵が頭にあるかどうかで決まる。
 * Part 4 の更新のしかた、Part 8 の memo、Part 9 の Context まで
 * ずっとこの絵の話が続く。
 */
export const TwoLabelsFigure = () => (
  <figure className="not-prose my-6 max-w-2xl">
    <svg
      viewBox="0 0 560 300"
      className="w-full"
      role="img"
      aria-label="同じ箱を指す 2 枚の名札は等しく、見た目が同じでも別々の箱は等しくない"
    >
      <defs>
        <marker
          id="ref-arrow"
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

      {/* 上段: 同じ箱を指す 2 枚の名札 */}
      <text x={16} y={22} className="fill-foreground" fontSize={13}>
        代入で写されるのは「どの箱か」
      </text>

      <rect x={16} y={38} width={104} height={34} rx={6} className="fill-transparent stroke-foreground/40" strokeWidth={1.5} />
      <text x={68} y={60} textAnchor="middle" className="fill-foreground font-mono" fontSize={12}>
        original
      </text>

      <rect x={16} y={86} width={104} height={34} rx={6} className="fill-transparent stroke-foreground/40" strokeWidth={1.5} />
      <text x={68} y={108} textAnchor="middle" className="fill-foreground font-mono" fontSize={12}>
        copy
      </text>

      <path d="M 126 55 L 246 74" className="stroke-foreground/40" strokeWidth={1.5} markerEnd="url(#ref-arrow)" />
      <path d="M 126 103 L 246 84" className="stroke-foreground/40" strokeWidth={1.5} markerEnd="url(#ref-arrow)" />

      <rect x={254} y={58} width={200} height={42} rx={8} className="fill-transparent stroke-foreground/40" strokeWidth={1.5} />
      <text x={354} y={84} textAnchor="middle" className="fill-foreground font-mono" fontSize={12}>
        {`{ name: "さとう" }`}
      </text>

      <text x={470} y={78} className="fill-emerald-600 font-mono" fontSize={12}>
        === true
      </text>
      <text x={16} y={142} className="fill-muted-foreground" fontSize={11}>
        箱は 1 つしかない。どちらから書き換えても、同じ箱が変わる
      </text>

      {/* 区切り */}
      <path d="M 16 164 L 544 164" className="stroke-foreground/15" strokeWidth={1} />

      {/* 下段: 見た目が同じ別々の箱 */}
      <text x={16} y={192} className="fill-foreground" fontSize={13}>
        別々に作れば、中身が同じでも別の箱
      </text>

      <rect x={16} y={208} width={104} height={34} rx={6} className="fill-transparent stroke-foreground/40" strokeWidth={1.5} />
      <text x={68} y={230} textAnchor="middle" className="fill-foreground font-mono" fontSize={12}>
        box1
      </text>

      <rect x={16} y={252} width={104} height={34} rx={6} className="fill-transparent stroke-foreground/40" strokeWidth={1.5} />
      <text x={68} y={274} textAnchor="middle" className="fill-foreground font-mono" fontSize={12}>
        box2
      </text>

      <path d="M 126 225 L 246 225" className="stroke-foreground/40" strokeWidth={1.5} markerEnd="url(#ref-arrow)" />
      <path d="M 126 269 L 246 269" className="stroke-foreground/40" strokeWidth={1.5} markerEnd="url(#ref-arrow)" />

      <rect x={254} y={208} width={200} height={34} rx={8} className="fill-transparent stroke-foreground/40" strokeWidth={1.5} />
      <text x={354} y={230} textAnchor="middle" className="fill-foreground font-mono" fontSize={12}>
        {`{ name: "さとう" }`}
      </text>

      <rect x={254} y={252} width={200} height={34} rx={8} className="fill-transparent stroke-foreground/40" strokeWidth={1.5} />
      <text x={354} y={274} textAnchor="middle" className="fill-foreground font-mono" fontSize={12}>
        {`{ name: "さとう" }`}
      </text>

      <text x={470} y={248} className="fill-destructive font-mono" fontSize={12}>
        === false
      </text>
    </svg>

    <figcaption className="mt-1 text-sm text-muted-foreground">
      === が見ているのは中身ではなく、同じ箱を指しているかどうか
    </figcaption>
  </figure>
);
