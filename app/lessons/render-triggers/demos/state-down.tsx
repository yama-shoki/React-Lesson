"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

function HeavyList() {
	return (
		<RenderBox title="一覧（入力とは無関係）" tone="highlight">
			<ul className="flex gap-2 text-sm">
				<li>さとう</li>
				<li>すずき</li>
				<li>たかはし</li>
			</ul>
		</RenderBox>
	);
}

// state を、それを使う部品の中まで下ろした
function SearchBox() {
	const [keyword, setKeyword] = useState("");

	return (
		<div className="flex flex-col gap-3">
			<Input
				placeholder="ここに打つ"
				value={keyword}
				onChange={(event) => setKeyword(event.target.value)}
			/>

			<Button size="sm" variant="outline" disabled>
				{keyword ? `「${keyword}」で検索` : "検索"}
			</Button>
		</div>
	);
}

export function StateDown() {
	useTrackDemoRender();

	return (
		<div className="flex flex-col gap-3">
			<SearchBox />

			{/* 外側に state がないので、ここは描き直されない */}
			<HeavyList />
		</div>
	);
}
