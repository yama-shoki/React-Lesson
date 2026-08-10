"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// 重い処理をしている想定の子
function Heavy() {
	return <RenderBox title="重い子">親の中で作られている</RenderBox>;
}

export function Flat() {
	useTrackDemoRender();

	const [count, setCount] = useState(0);

	return (
		<div className="flex flex-col gap-4">
			<Button size="sm" onClick={() => setCount((c) => c + 1)}>
				count: {count}
			</Button>

			{/* この行は Flat の中にある。Flat が描き直されるたびに作り直される */}
			<Heavy />
		</div>
	);
}
