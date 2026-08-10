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

			{/* 中身はいつも出す。違いは「値を渡せるかどうか」だけ */}
			<div className="mt-3">{children}</div>
		</div>
	);
}

export function PlainChildren() {
	useTrackDemoRender();

	return (
		<Panel>
			{/* ここから isOpen は見えない。「開いています」と書くことができない */}
			<p className="text-sm text-muted-foreground">
				いま……（開いているのか閉じているのか、ここからは分かりません）
			</p>
		</Panel>
	);
}
