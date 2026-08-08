/**
 * state を変えてから画面が変わるまでの流れ。
 *
 * 「setCount が画面を書き換えている」と誤解されやすいので、
 * 実際にはもう一度関数が実行されている、という点を見せる。
 */
export const StateCycleFigure = () => (
  <figure className="not-prose my-6 max-w-xl">
    <svg
      viewBox="0 0 500 120"
      className="w-full"
      role="img"
      aria-label="setCount を呼ぶと、コンポーネントがもう一度実行され、新しい画面になる"
    >
      <defs>
        <marker
          id="cycle-arrow"
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

      {[
        { x: 6, label: "setCount(1)", note: "こう変えてと伝える" },
        { x: 176, label: "もう一度実行", note: "関数が呼び直される" },
        { x: 346, label: "新しい画面", note: "count は 1 になっている" },
      ].map((step, index) => (
        <g key={step.label}>
          <rect
            x={step.x}
            y={30}
            width={148}
            height={54}
            rx={8}
            className={
              index === 2
                ? "fill-[var(--connection)]/10 stroke-[var(--connection)]/60"
                : "fill-transparent stroke-border"
            }
            strokeWidth={1.5}
          />
          <text
            x={step.x + 74}
            y={52}
            textAnchor="middle"
            className="fill-foreground font-mono"
            fontSize={12}
          >
            {step.label}
          </text>
          <text
            x={step.x + 74}
            y={70}
            textAnchor="middle"
            className="fill-muted-foreground"
            fontSize={10}
          >
            {step.note}
          </text>
        </g>
      ))}

      {[160, 330].map((x) => (
        <path
          key={x}
          d={`M ${x} 57 L ${x + 12} 57`}
          className="stroke-foreground/40"
          strokeWidth={1.5}
          markerEnd="url(#cycle-arrow)"
        />
      ))}
    </svg>

    <figcaption className="mt-1 text-sm text-muted-foreground">
      画面を書き換えているのではなく、関数がもう一度実行されている
    </figcaption>
  </figure>
);
