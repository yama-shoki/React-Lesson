"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// 1 秒かかる処理のつもり
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function Order() {
	useTrackDemoRender();

	const [log, setLog] = useState<string[]>([]);
	const add = (line: string) => setLog((current) => [...current, line]);

	// ✕ 待たない書き方
	const withoutAwait = () => {
		setLog([]);
		add("1. お茶を注文した");
		wait(1000).then(() => add("2. お茶が届いた"));
		add("3. 席に座った");
	};

	// ◯ 待つ書き方。await のところで、いったん止まる
	const withAwait = async () => {
		setLog([]);
		add("1. お茶を注文した");
		await wait(1000);
		add("2. お茶が届いた");
		add("3. 席に座った");
	};

	return (
		<div className="flex flex-col gap-3">
			<div className="flex gap-2">
				<Button size="sm" variant="outline" onClick={withoutAwait}>
					await なし
				</Button>
				<Button size="sm" onClick={withAwait}>
					await あり
				</Button>
			</div>

			<ol className="flex min-h-24 flex-col gap-1 rounded-md border p-3 text-sm">
				{log.length === 0 ? (
					<li className="text-muted-foreground">押すと、順番が出ます</li>
				) : (
					log.map((line) => <li key={line}>{line}</li>)
				)}
			</ol>
		</div>
	);
}
