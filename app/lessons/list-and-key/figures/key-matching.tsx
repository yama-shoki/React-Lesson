/**
 * 「先頭に 1 人追加したとき、React が古い行と新しい行をどう対応づけるか」の図。
 *
 * index を key にした場合と、id を key にした場合で対応関係がまったく変わることを見せる。
 * 色は CSS 変数を使っているので、ダークモードでもそのまま読める。
 */

const ROW_HEIGHT = 34;
const ROW_GAP = 8;
const LEFT_X = 30;
const RIGHT_X = 336;
const BOX_WIDTH = 172;

const rowY = (index: number) => 58 + index * (ROW_HEIGHT + ROW_GAP);

type Row = {
  keyLabel: string;
  name: string;
  /** その行をどう扱ってほしいか。見た目が変わる */
  state?: "new" | "problem";
  /** 箱の右端に小さく添える注記 */
  note?: string;
};

const Box = ({
  x,
  index,
  row,
}: {
  x: number;
  index: number;
  row: Row;
}) => {
  const y = rowY(index);
  const isNew = row.state === "new";
  const isProblem = row.state === "problem";

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={BOX_WIDTH}
        height={ROW_HEIGHT}
        rx={6}
        className={
          isProblem
            ? "fill-amber-500/10 stroke-amber-500"
            : isNew
              ? "fill-emerald-500/10 stroke-emerald-500"
              : "fill-transparent stroke-border"
        }
        strokeWidth={1.5}
      />
      <rect
        x={x + 8}
        y={y + 8}
        width={34}
        height={18}
        rx={4}
        className="fill-foreground/10"
      />
      <text
        x={x + 25}
        y={y + 21}
        textAnchor="middle"
        className="fill-foreground/70 font-mono"
        fontSize={11}
      >
        {row.keyLabel}
      </text>
      <text
        x={x + 52}
        y={y + 22}
        className="fill-foreground"
        fontSize={13}
      >
        {row.name}
      </text>
      {row.note && (
        <text
          x={x + BOX_WIDTH - 10}
          y={y + 22}
          textAnchor="end"
          fontSize={10}
          className={
            isProblem
              ? "fill-amber-600 dark:fill-amber-500"
              : isNew
                ? "fill-emerald-600 dark:fill-emerald-500"
                : "fill-muted-foreground"
          }
        >
          {row.note}
        </text>
      )}
    </g>
  );
};

const Arrow = ({
  from,
  to,
  id,
  emphasis,
}: {
  from: number;
  to: number;
  id: string;
  emphasis?: boolean;
}) => {
  const startX = LEFT_X + BOX_WIDTH;
  const endX = RIGHT_X;
  const startY = rowY(from) + ROW_HEIGHT / 2;
  const endY = rowY(to) + ROW_HEIGHT / 2;
  const midX = (startX + endX) / 2;

  return (
    <path
      d={`M ${startX + 6} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX - 8} ${endY}`}
      fill="none"
      strokeWidth={1.5}
      markerEnd={`url(#${id})`}
      className={emphasis ? "stroke-amber-500" : "stroke-foreground/35"}
    />
  );
};

const Marker = ({ id, emphasis }: { id: string; emphasis?: boolean }) => (
  <marker
    id={id}
    viewBox="0 0 10 10"
    refX={8}
    refY={5}
    markerWidth={5}
    markerHeight={5}
    orient="auto-start-reverse"
  >
    <path
      d="M 0 0 L 10 5 L 0 10 z"
      className={emphasis ? "fill-amber-500" : "fill-foreground/35"}
    />
  </marker>
);

const Frame = ({
  markerPrefix,
  before,
  after,
  arrows,
  caption,
}: {
  markerPrefix: string;
  before: Row[];
  after: Row[];
  arrows: { from: number; to: number; emphasis?: boolean }[];
  caption: string;
}) => (
  <figure className="not-prose my-6">
    <svg
      viewBox="0 0 540 250"
      className="w-full"
      role="img"
      aria-label={caption}
    >
      <defs>
        <Marker id={`${markerPrefix}-arrow`} />
        <Marker id={`${markerPrefix}-arrow-emphasis`} emphasis />
      </defs>

      <text x={LEFT_X} y={34} className="fill-muted-foreground" fontSize={12}>
        追加する前
      </text>
      <text x={RIGHT_X} y={34} className="fill-muted-foreground" fontSize={12}>
        追加したあと
      </text>

      {arrows.map((arrow) => (
        <Arrow
          key={`${arrow.from}-${arrow.to}`}
          from={arrow.from}
          to={arrow.to}
          emphasis={arrow.emphasis}
          id={
            arrow.emphasis
              ? `${markerPrefix}-arrow-emphasis`
              : `${markerPrefix}-arrow`
          }
        />
      ))}

      {before.map((row, index) => (
        <Box key={row.name} x={LEFT_X} index={index} row={row} />
      ))}
      {after.map((row, index) => (
        <Box key={row.name} x={RIGHT_X} index={index} row={row} />
      ))}
    </svg>

    <figcaption className="mt-1 text-center text-sm text-muted-foreground">
      {caption}
    </figcaption>
  </figure>
);

/** key に index を使った場合 */
export const KeyMatchingByIndex = () => (
  <Frame
    markerPrefix="idx"
    caption="key が index だと、React は「0 番の行の名前が さとう から やまだ に変わった」と解釈する"
    before={[
      { keyLabel: "0", name: "さとう" },
      { keyLabel: "1", name: "すずき" },
      { keyLabel: "2", name: "たかはし" },
    ]}
    after={[
      { keyLabel: "0", name: "やまだ", state: "problem", note: "箱を流用" },
      { keyLabel: "1", name: "さとう" },
      { keyLabel: "2", name: "すずき" },
      { keyLabel: "3", name: "たかはし", state: "new", note: "新しく作る" },
    ]}
    arrows={[
      { from: 0, to: 0, emphasis: true },
      { from: 1, to: 1 },
      { from: 2, to: 2 },
    ]}
  />
);

/** key に id を使った場合 */
export const KeyMatchingById = () => (
  <Frame
    markerPrefix="id"
    caption="key が id だと、さとう・すずき・たかはし は「下にずれただけ」と正しく判断される"
    before={[
      { keyLabel: "1", name: "さとう" },
      { keyLabel: "2", name: "すずき" },
      { keyLabel: "3", name: "たかはし" },
    ]}
    after={[
      { keyLabel: "4", name: "やまだ", state: "new", note: "新しく作る" },
      { keyLabel: "1", name: "さとう", note: "移動しただけ" },
      { keyLabel: "2", name: "すずき" },
      { keyLabel: "3", name: "たかはし" },
    ]}
    arrows={[
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
    ]}
  />
);
