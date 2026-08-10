"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";

const ALL = ["りんご", "みかん", "ぶどう", "もも", "いちご"];

export function UrlState() {
	useTrackDemoRender();

	// useState とほとんど同じ形。置き場所が URL になっただけ
	const [keyword, setKeyword] = useQueryState("keyword", { defaultValue: "" });

	const found = ALL.filter((item) => item.includes(keyword));

	return (
		<div className="flex flex-col gap-4">
			<Input
				placeholder="果物を絞り込む"
				value={keyword}
				onChange={(event) => setKeyword(event.target.value)}
			/>

			<ul className="flex flex-wrap gap-2">
				{found.map((item) => (
					<li key={item} className="rounded-md border px-3 py-1.5">
						{item}
					</li>
				))}
			</ul>

			<Button size="sm" variant="outline" onClick={() => setKeyword("")}>
				クリア
			</Button>

			<p className="text-muted-foreground">
				打つたびに、ブラウザのアドレス欄が変わります
			</p>
		</div>
	);
}
