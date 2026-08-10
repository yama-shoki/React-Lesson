"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// 初期値を作るのに時間がかかる、という想定
function buildInitialCode() {
	let value = 0;
	for (let i = 0; i < 3_000_000; i += 1) value += i % 7;

	return `CODE-${value % 10000}`;
}

export function LazyInit() {
	useTrackDemoRender();

	// ✕ useState(buildInitialCode()) と書くと、描き直すたびに毎回呼ばれる
	// ◯ 関数を渡すと、React は最初の 1 回だけ呼ぶ
	const [code] = useState(buildInitialCode);

	const [count, setCount] = useState(0);

	return (
		<div className="flex flex-col gap-3">
			<p className="font-mono text-sm">初期コード: {code}</p>

			<Button size="sm" onClick={() => setCount(count + 1)}>
				描き直す（{count} 回）
			</Button>

			<p className="text-sm text-muted-foreground">
				何度押しても引っかからない。初期値の計算は最初の 1 回だけ
			</p>
		</div>
	);
}
