"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

/**
 * デモの中に置く「描き直しが見える箱」。
 *
 * ひとつのデモの中で、どの部品が描き直されて、どの部品が
 * 描き直されていないかを並べて見せたいときに使う。
 * 自分が描き直されるたびに回数が増え、枠が青く光る。
 *
 * 回数は ref に持つ。state にすると、数えること自体が
 * 描き直しを起こして数字が増え続けてしまう。
 */
export function RenderBox({
	title,
	tone = "neutral",
	children,
}: {
	title: string;
	/** 注目させたいほうを highlight にすると枠が色づく */
	tone?: "neutral" | "highlight";
	children: React.ReactNode;
}) {
	// 数字は 1 から始める。初回マウントぶんは数えないし、光らせない
	const count = useRef(1);
	const mountedRef = useRef(false);
	const labelRef = useRef<HTMLSpanElement>(null);
	const flashRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!mountedRef.current) {
			if (labelRef.current) labelRef.current.textContent = "render 1";
			return;
		}

		count.current++;
		if (labelRef.current) {
			labelRef.current.textContent = `render ${count.current}`;
		}

		const element = flashRef.current;
		if (!element) return;

		element.classList.remove("react-dev-render-flash");
		// すでに光っている途中なら、いったん止めてから光らせ直す
		void element.offsetWidth;
		element.classList.add("react-dev-render-flash");

		const timer = window.setTimeout(() => {
			element.classList.remove("react-dev-render-flash");
		}, 900);

		return () => window.clearTimeout(timer);
	});

	useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	return (
		<div
			className={cn(
				"relative rounded-md border p-3",
				tone === "highlight" && "border-[var(--connection)]/60",
			)}
		>
			<div
				ref={flashRef}
				className="pointer-events-none absolute inset-0 rounded-md border border-sky-400 bg-sky-400/15 opacity-0"
			/>

			<div className="mb-1.5 flex items-center justify-between gap-2">
				<span className="font-semibold">{title}</span>
				<span
					ref={labelRef}
					className="font-mono text-xs tabular-nums text-muted-foreground"
				/>
			</div>

			<div className="text-muted-foreground">{children}</div>
		</div>
	);
}
