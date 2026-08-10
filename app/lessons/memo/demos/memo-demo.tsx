"use client";

import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { memo, useState } from "react";

// メモ化していない子
function Plain({ name }: { name: string }) {
	return <RenderBox title="memo なし">{name} さん</RenderBox>;
}

// 中身はまったく同じ。memo で包んだだけ
const Memoized = memo(function Memoized({ name }: { name: string }) {
	return (
		<RenderBox title="memo あり" tone="highlight">
			{name} さん
		</RenderBox>
	);
});

const names = ["さとう", "すずき", "たかはし"];

export function MemoDemo() {
	const [count, setCount] = useState(0);
	const [name, setName] = useState(names[0]);

	return (
		<div className="flex flex-col gap-4">
			<p className="rounded-md border p-3 font-mono">count: {count}</p>

			<div className="flex flex-wrap gap-2">
				<Button size="sm" onClick={() => setCount((c) => c + 1)}>
					count を増やす（name は変わらない）
				</Button>
				<Button
					size="sm"
					variant="outline"
					onClick={() => setName(names[(names.indexOf(name) + 1) % names.length])}
				>
					name を変える
				</Button>
			</div>

			<div className="flex flex-col gap-2.5">
				<Plain name={name} />
				<Memoized name={name} />
			</div>
		</div>
	);
}
