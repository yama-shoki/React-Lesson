/**
 * map が「ひとつずつ作り変えて、新しい配列を返す」ことを示す図。
 *
 * 元の配列がそのまま残っている、という点まで見せたいので、
 * 上下 2 段にして「元」と「結果」を並べている。
 */

const CELL_WIDTH = 64;
const CELL_HEIGHT = 40;
const START_X = 60;
const GAP = 12;

const cellX = (index: number) => START_X + index * (CELL_WIDTH + GAP);

const Cell = ({
  x,
  y,
  label,
  tone,
}: {
  x: number;
  y: number;
  label: string;
  tone: "plain" | "result";
}) => (
  <g>
    <rect
      x={x}
      y={y}
      width={CELL_WIDTH}
      height={CELL_HEIGHT}
      rx={6}
      className={
        tone === "result"
          ? "fill-[var(--connection)]/10 stroke-[var(--connection)]/60"
          : "fill-transparent stroke-border"
      }
      strokeWidth={1.5}
    />
    <text
      x={x + CELL_WIDTH / 2}
      y={y + 25}
      textAnchor="middle"
      className="fill-foreground font-mono"
      fontSize={14}
    >
      {label}
    </text>
  </g>
);

export const MapFlowFigure = () => (
  <figure className="not-prose my-6 max-w-xl">
    <svg
      viewBox="0 0 340 200"
      className="w-full"
      role="img"
      aria-label="map は元の配列をひとつずつ作り変えて、新しい配列を返す"
    >
      <defs>
        <marker
          id="map-arrow"
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

      <text x={16} y={30} className="fill-muted-foreground" fontSize={11}>
        元
      </text>
      {["1", "2", "3"].map((label, index) => (
        <Cell key={label} x={cellX(index)} y={12} label={label} tone="plain" />
      ))}

      {/* 変換 */}
      {[0, 1, 2].map((index) => (
        <path
          key={index}
          d={`M ${cellX(index) + CELL_WIDTH / 2} 56 L ${cellX(index) + CELL_WIDTH / 2} 84`}
          className="stroke-foreground/35"
          strokeWidth={1.5}
          markerEnd="url(#map-arrow)"
        />
      ))}

      <rect
        x={START_X - 8}
        y={86}
        width={3 * CELL_WIDTH + 2 * GAP + 16}
        height={32}
        rx={6}
        className="fill-muted stroke-border"
        strokeWidth={1.5}
      />
      <text
        x={START_X + (3 * CELL_WIDTH + 2 * GAP) / 2}
        y={107}
        textAnchor="middle"
        className="fill-foreground font-mono"
        fontSize={12}
      >
        {"(n) => n * 2"}
      </text>

      {[0, 1, 2].map((index) => (
        <path
          key={index}
          d={`M ${cellX(index) + CELL_WIDTH / 2} 120 L ${cellX(index) + CELL_WIDTH / 2} 146`}
          className="stroke-foreground/35"
          strokeWidth={1.5}
          markerEnd="url(#map-arrow)"
        />
      ))}

      <text x={16} y={172} className="fill-muted-foreground" fontSize={11}>
        結果
      </text>
      {["2", "4", "6"].map((label, index) => (
        <Cell key={label} x={cellX(index)} y={152} label={label} tone="result" />
      ))}
    </svg>

    <figcaption className="mt-1 text-sm text-muted-foreground">
      元の配列はそのまま。map が返すのは、別に作られた新しい配列
    </figcaption>
  </figure>
);
