/**
 * children として渡した要素が、どこで作られているかの図。
 *
 * 「誰が作ったか」で描き直しの範囲が決まる、という一点を見せたい。
 */

const Panel = ({
	x,
	title,
	ownerLabel,
	inner,
	innerRedrawn,
}: {
	x: number;
	title: string;
	ownerLabel: string;
	inner: string;
	innerRedrawn: boolean;
}) => (
	<g>
		<text x={x + 110} y={16} textAnchor="middle" className="fill-foreground" fontSize={13}>
			{title}
		</text>

		{/* 外側の枠 = 描き直される範囲 */}
		<rect
			x={x}
			y={28}
			width={220}
			height={108}
			rx={8}
			className="fill-amber-500/[0.06] stroke-amber-500/60"
			strokeWidth={1.5}
			strokeDasharray="4 3"
		/>
		<text x={x + 12} y={48} className="fill-amber-600" fontSize={11}>
			{ownerLabel}
		</text>

		{/* 内側の子 */}
		<rect
			x={x + 24}
			y={62}
			width={172}
			height={56}
			rx={6}
			className={
				innerRedrawn
					? "fill-amber-500/15 stroke-amber-500"
					: "fill-[var(--connection)]/10 stroke-[var(--connection)]/70"
			}
			strokeWidth={1.5}
		/>
		<text
			x={x + 110}
			y={86}
			textAnchor="middle"
			className="fill-foreground"
			fontSize={12}
		>
			重い子
		</text>
		<text
			x={x + 110}
			y={104}
			textAnchor="middle"
			className={innerRedrawn ? "fill-amber-600" : "fill-[var(--connection)]"}
			fontSize={10}
		>
			{inner}
		</text>
	</g>
);

export const ChildrenBoundaryFigure = () => (
	<figure className="not-prose my-6">
		<svg
			viewBox="0 0 500 150"
			className="w-full max-w-2xl"
			role="img"
			aria-label="子を親の中で作る場合と、外で作って渡す場合の違い"
		>
			<Panel
				x={10}
				title="親の中で作る"
				ownerLabel="描き直される範囲"
				inner="一緒に作り直される"
				innerRedrawn
			/>
			<Panel
				x={270}
				title="外で作って渡す"
				ownerLabel="描き直される範囲"
				inner="作り直されない"
				innerRedrawn={false}
			/>
		</svg>

		<figcaption className="mt-1 text-sm text-muted-foreground">
			点線が描き直される範囲。右は子がその外側で作られているので巻き込まれない
		</figcaption>
	</figure>
);
