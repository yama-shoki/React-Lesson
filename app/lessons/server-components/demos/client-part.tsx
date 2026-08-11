// この 1 行が境目。ここから下はブラウザにも届く
"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ClientPart({ children }: { children: React.ReactNode }) {
	useTrackDemoRender();

	const [count, setCount] = useState(0);

	return (
		<div className="flex flex-col gap-3">
			<Button size="sm" onClick={() => setCount(count + 1)}>
				押した回数: {count}
			</Button>

			{/* サーバーで作られたものを、そのまま置ける */}
			{children}
		</div>
	);
}
