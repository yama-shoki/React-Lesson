"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { type ReactNode, useState } from "react";

// 開閉の状態を持つ入れ物。中身は使う側から渡してもらう
function Panel({ children }: { children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="rounded-lg border p-4">
			<Button size="sm" onClick={() => setIsOpen(!isOpen)}>
				{/* isOpen を知っているのはここだけ。children には渡せない */}
				{isOpen ? "閉じる" : "開く"}
			</Button>

			{isOpen && <div className="mt-3">{children}</div>}
		</div>
	);
}

export function PlainChildren() {
	useTrackDemoRender();

	return (
		<Panel>
			{/* ここから isOpen は見えない。「開いています」と書くことができない */}
			<p className="text-sm text-muted-foreground">
				中身です。ここから開閉の状態は見えません。
			</p>
		</Panel>
	);
}
