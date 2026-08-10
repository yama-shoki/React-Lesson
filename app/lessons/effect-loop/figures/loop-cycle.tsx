/**
 * 無限ループがどう回るかの図。
 *
 * 4 つの段階が輪になっていて、どこにも出口がないことを見せたい。
 * 「effect が動く」から始めて、一周して同じ場所に戻る。
 */

const STEPS = [
  { label: "effect が動く", note: "依存が変わったので実行" },
  { label: "state を変える", note: "setCount を呼ぶ" },
  { label: "描き直される", note: "コンポーネントが再実行" },
  { label: "依存が変わった", note: "count が新しい値に" },
];

const BOX_WIDTH = 150;
const BOX_HEIGHT = 54;
const positions = [
  { x: 20, y: 16 },
  { x: 250, y: 16 },
  { x: 250, y: 130 },
  { x: 20, y: 130 },
];

export const LoopCycleFigure = () => (
  <figure className="not-prose my-6 max-w-lg">
    <svg
      viewBox="0 0 420 200"
      className="w-full"
      role="img"
      aria-label="effect が動く、state を変える、描き直される、依存が変わる、の 4 つが輪になっている"
    >
      <defs>
        <marker
          id="loop-arrow"
          viewBox="0 0 10 10"
          refX={8}
          refY={5}
          markerWidth={5}
          markerHeight={5}
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" className="fill-amber-600" />
        </marker>
      </defs>

      {/* 輪をつくる 4 本の矢印 */}
      <path
        d={`M ${20 + BOX_WIDTH + 6} 43 L 244 43`}
        fill="none"
        className="stroke-amber-500"
        strokeWidth={1.5}
        markerEnd="url(#loop-arrow)"
      />
      <path
        d={`M ${250 + BOX_WIDTH / 2} ${16 + BOX_HEIGHT + 6} L ${250 + BOX_WIDTH / 2} 124`}
        fill="none"
        className="stroke-amber-500"
        strokeWidth={1.5}
        markerEnd="url(#loop-arrow)"
      />
      <path
        d={`M 244 157 L ${20 + BOX_WIDTH + 6} 157`}
        fill="none"
        className="stroke-amber-500"
        strokeWidth={1.5}
        markerEnd="url(#loop-arrow)"
      />
      <path
        d={`M ${20 + BOX_WIDTH / 2} 124 L ${20 + BOX_WIDTH / 2} ${16 + BOX_HEIGHT + 6}`}
        fill="none"
        className="stroke-amber-500"
        strokeWidth={1.5}
        markerEnd="url(#loop-arrow)"
      />

      {STEPS.map((step, index) => {
        const { x, y } = positions[index];
        return (
          <g key={step.label}>
            <rect
              x={x}
              y={y}
              width={BOX_WIDTH}
              height={BOX_HEIGHT}
              rx={8}
              className="fill-amber-500/[0.07] stroke-amber-500/60"
              strokeWidth={1.5}
            />
            <text
              x={x + BOX_WIDTH / 2}
              y={y + 24}
              textAnchor="middle"
              className="fill-foreground"
              fontSize={13}
            >
              {step.label}
            </text>
            <text
              x={x + BOX_WIDTH / 2}
              y={y + 41}
              textAnchor="middle"
              className="fill-muted-foreground"
              fontSize={10}
            >
              {step.note}
            </text>
          </g>
        );
      })}
    </svg>

    <figcaption className="mt-1 text-sm text-muted-foreground">
      どこにも出口がない。止めるには、この輪のどこかを切る必要がある
    </figcaption>
  </figure>
);
