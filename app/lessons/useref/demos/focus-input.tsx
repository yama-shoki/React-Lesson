"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef } from "react";

export function FocusInput() {
	useTrackDemoRender();

	// 入れ物を用意する。中身は { current: ... } の形
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<div className="flex flex-col gap-3">
			{/* ref を渡すと、React が実物の要素を入れておいてくれる */}
			<Input ref={inputRef} placeholder="ここに入力" />

			<Button
				size="sm"
				variant="outline"
				// .current に入っているのは、本物の <input> 要素
				onClick={() => inputRef.current?.focus()}
			>
				入力欄にカーソルを移す
			</Button>
		</div>
	);
}
