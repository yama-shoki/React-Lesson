"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function FetchDemo() {
	useTrackDemoRender();

	const [result, setResult] = useState("まだ取りに行っていません");

	// async を付けると、その中で await が使えるようになる
	const load = async (path: string) => {
		setResult("読み込み中…");

		try {
			// 1. サーバーに問い合わせて、返事が来るまで待つ
			const response = await fetch(path);

			// 2. 404 や 500 でも fetch は成功扱い。自分で確かめる
			if (!response.ok) {
				throw new Error(`サーバーが ${response.status} を返しました`);
			}

			// 3. 本文を JavaScript の値に変換する。これも待つ
			const data = await response.json();

			setResult(`取得できました: ${data.members.join("、")}`);
		} catch (error) {
			// 通信が切れた場合も、上で投げた場合も、ここに来る
			setResult(
				error instanceof Error ? `失敗: ${error.message}` : "失敗しました",
			);
		}
	};

	return (
		<div className="flex flex-col gap-3">
			<div className="flex gap-2">
				<Button size="sm" onClick={() => load("/api/members")}>
					取ってくる
				</Button>
				<Button
					size="sm"
					variant="outline"
					onClick={() => load("/api/does-not-exist")}
				>
					わざと失敗させる
				</Button>
			</div>

			<p className="rounded-md border p-3 text-sm">{result}</p>
		</div>
	);
}
