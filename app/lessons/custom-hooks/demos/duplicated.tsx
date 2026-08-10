"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { useEffect, useState } from "react";

function WidthLabel() {
	// ここから 8 行
	const [width, setWidth] = useState(0);

	useEffect(() => {
		const update = () => setWidth(window.innerWidth);

		update();
		window.addEventListener("resize", update);
		return () => window.removeEventListener("resize", update);
	}, []);
	// ここまで

	return <p className="text-sm">いまの画面幅: {width}px</p>;
}

function DeviceLabel() {
	// まったく同じ 8 行が、もう一度
	const [width, setWidth] = useState(0);

	useEffect(() => {
		const update = () => setWidth(window.innerWidth);

		update();
		window.addEventListener("resize", update);
		return () => window.removeEventListener("resize", update);
	}, []);

	return (
		<p className="text-sm">
			判定: {width < 768 ? "スマホ向け" : "パソコン向け"}
		</p>
	);
}

export function Duplicated() {
	useTrackDemoRender();

	return (
		<div className="flex flex-col gap-2">
			<WidthLabel />
			<DeviceLabel />
		</div>
	);
}
