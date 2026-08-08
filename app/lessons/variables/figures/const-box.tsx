/**
 * const が守っているのは「名札」であって「箱の中身」ではない、という図。
 *
 * const = 値を変えられない、と覚えてしまうと、
 * オブジェクトの中身が書き換わったときに理由が分からなくなる。
 */
export const ConstBoxFigure = () => (
  <figure className="not-prose my-6 max-w-xl">
    <svg viewBox="0 0 520 210" className="w-full" role="img" aria-label="const は名札を固定するもので、箱の中身は変えられる">
      {/* 名札 */}
      <rect
        x={16}
        y={24}
        width={132}
        height={44}
        rx={6}
        className="fill-transparent stroke-foreground/40"
        strokeWidth={1.5}
      />
      <text x={82} y={44} textAnchor="middle" className="fill-foreground font-mono" fontSize={13}>
        const user
      </text>
      <text x={82} y={60} textAnchor="middle" className="fill-muted-foreground" fontSize={10}>
        名札
      </text>

      {/* 名札から箱への線 */}
      <path
        d="M 152 46 L 236 46"
        className="stroke-foreground/40"
        strokeWidth={1.5}
        markerEnd="url(#const-arrow)"
      />
      <defs>
        <marker id="const-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" className="fill-foreground/40" />
        </marker>
      </defs>

      {/* 箱 */}
      <rect
        x={244}
        y={20}
        width={252}
        height={52}
        rx={8}
        className="fill-transparent stroke-foreground/40"
        strokeWidth={1.5}
      />
      <text x={370} y={51} textAnchor="middle" className="fill-foreground font-mono" fontSize={13}>
        {`{ name: "さとう" }`}
      </text>

      {/* できないこと */}
      <g>
        <text x={16} y={116} className="fill-red-600" fontSize={13}>
          ✕
        </text>
        <text x={38} y={116} className="fill-foreground" fontSize={13}>
          名札を別の箱に付け替える
        </text>
        <text x={38} y={136} className="fill-muted-foreground font-mono" fontSize={11}>
          user = {`{ name: "すずき" }`}
        </text>
      </g>

      {/* できてしまうこと */}
      <g>
        <text x={16} y={172} className="fill-emerald-600" fontSize={13}>
          ○
        </text>
        <text x={38} y={172} className="fill-foreground" fontSize={13}>
          箱の中の値を書き換える
        </text>
        <text x={38} y={192} className="fill-muted-foreground font-mono" fontSize={11}>
          user.name = &quot;すずき&quot;
        </text>
      </g>
    </svg>

    <figcaption className="mt-1 text-sm text-muted-foreground">
      const が固定するのは名札の付け先だけ。箱の中身には関与しない
    </figcaption>
  </figure>
);
