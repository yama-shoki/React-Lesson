"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { useWindowWidth } from "./use-window-width";

function WidthLabel() {
	// 8 行が 1 行になった
	const width = useWindowWidth();

	return <p className="text-sm">いまの画面幅: {width}px</p>;
}

function DeviceLabel() {
	const width = useWindowWidth();

	return (
		<p className="text-sm">
			判定: {width < 768 ? "スマホ向け" : "パソコン向け"}
		</p>
	);
}

export function Extracted() {
	useTrackDemoRender();

	return (
		<div className="flex flex-col gap-2">
			<WidthLabel />
			<DeviceLabel />
		</div>
	);
}
