"use client";

import { cn } from "@/lib/utils";
import { CircleCheck, Code, TriangleAlert } from "lucide-react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { useCodePane } from "./code-pane-context";

/**
 * showRenderCount 付きの DemoCard 内で呼ぶ。
 * デモ側の state 更新で DemoCard 自体は再レンダリングされないため、
 * 子コンポーネントからここ経由で render 回数を報告する。
 */
export function useTrackDemoRender() {
	const trackRender = useContext(DemoRenderContext);
	useEffect(() => {
		trackRender?.();
	});
}

const DemoRenderContext = createContext<(() => void) | null>(null);

type Tone = "neutral" | "bad" | "good";

const toneStyles: Record<Tone, string> = {
	neutral: "border-border",
	bad: "border-amber-500/50 bg-amber-500/[0.03]",
	good: "border-emerald-500/50 bg-emerald-500/[0.03]",
};

const toneLabel: Record<Tone, { text: string; className: string } | null> = {
	neutral: null,
	bad: { text: "うまくいかない例", className: "text-amber-600" },
	good: { text: "直した例", className: "text-emerald-600" },
};

/**
 * 実際に動くデモを載せる箱。
 *
 * sourcePath を渡すと右上にコードボタンが出て、押すと右のコードペインが
 * そのファイルに切り替わる。このときカードとコードの該当行が線でつながるので、
 * 「画面のどの部分が、どのコードなのか」が一目で分かる。
 *
 * showRenderCount を付けると、そのデモが何回描き直されたかが数字で出て、
 * 描き直された瞬間に枠が光る。目に見えない再レンダリングを見せるための仕掛け。
 */
export const DemoCard = ({
	title,
	description,
	tone = "neutral",
	sourcePath,
	showRenderCount = false,
	children,
}: {
	title: string;
	description?: string;
	tone?: Tone;
	/** このデモの実装ファイル。指定するとコードペインと連動する */
	sourcePath?: string;
	showRenderCount?: boolean;
	children: React.ReactNode;
}) => {
	const { active, pinned, selectSnippet } = useCodePane();
	const label = toneLabel[tone];

	/**
	 * 読み進めてこのデモの話題に入ったときと、コードボタンを押したときの両方で光らせる。
	 * 「いま解説している画面はここ」「そのコードはこれ」を線で結ぶことで、
	 * 文章とコードと画面の三つが同じものを指していると分かる。
	 */
	const isPinned =
		sourcePath !== undefined &&
		(pinned === sourcePath || active?.snippetId === sourcePath);

	const countRef = useRef(0);
	const labelRef = useRef<HTMLSpanElement>(null);
	const flashRef = useRef<HTMLDivElement>(null);
	const [flashCount, setFlashCount] = useState(0);

	useEffect(() => {
		if (flashCount === 0) return;
		const element = flashRef.current;
		if (!element) return;

		element.classList.remove("react-dev-render-flash");
		// Restart the animation if it was already active.
		void element.offsetWidth;
		element.classList.add("react-dev-render-flash");

		// アニメーションが終わりきってから外す（CSS 側の長さと合わせる）
		const timer = window.setTimeout(() => {
			element.classList.remove("react-dev-render-flash");
		}, 900);
		return () => window.clearTimeout(timer);
	}, [flashCount]);

	const trackRender = useCallback(() => {
		countRef.current++;
		if (labelRef.current) {
			labelRef.current.textContent = `render ${countRef.current}`;
		}
		setFlashCount((current) => current + 1);
	}, []);

	const body = (
		<div
			// ConnectionLine がこの印を目印にして、コードの該当行まで線を引く
			data-demo-linked={isPinned ? "true" : undefined}
			className={cn(
				"not-prose relative my-6 rounded-xl border transition-shadow",
				toneStyles[tone],
				// 画面が狭いときは線が出ず、コードもすぐ下に出るので枠の強調はいらない
				isPinned &&
					"lg:border-[var(--connection)] lg:ring-2 lg:ring-[var(--connection)]/35",
			)}
		>
			{showRenderCount && (
				<div
					ref={flashRef}
					className="pointer-events-none absolute inset-0 z-10 rounded-xl border border-sky-400 bg-sky-400/15 opacity-0"
				/>
			)}

			<div className="rounded-t-xl border-b bg-background/40 px-4 py-2.5">
				<div className="flex flex-wrap items-center gap-x-2 gap-y-1">
					{tone === "bad" && (
						<TriangleAlert className="size-4 shrink-0 text-amber-600" />
					)}
					{tone === "good" && (
						<CircleCheck className="size-4 shrink-0 text-emerald-600" />
					)}

					<span className="text-sm font-semibold">{title}</span>

					{label && (
						<span className={cn("text-xs font-medium", label.className)}>
							{label.text}
						</span>
					)}

					{showRenderCount && (
						<span
							ref={labelRef}
							className="font-mono text-xs tabular-nums text-muted-foreground"
						/>
					)}

					{sourcePath && (
						<button
							type="button"
							onClick={() => selectSnippet(sourcePath)}
							aria-label="このデモのコードを見る"
							title="このデモのコードを見る"
							className={cn(
								"focus-ring ml-auto shrink-0 rounded-md border p-1 transition-colors",
								isPinned
									? "border-[var(--connection)] text-[var(--connection)]"
									: "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
							)}
						>
							<Code className="size-3.5" />
						</button>
					)}
				</div>

				{description && (
					<p className="mt-1 text-sm text-muted-foreground">{description}</p>
				)}
			</div>

			{/* デモ側で毎回 text-sm を書かなくて済むように、ここで文字サイズを決めておく。
          教材のコードは主題だけに集中させたい */}
			<div className="p-5 text-sm">{children}</div>
		</div>
	);

	if (!showRenderCount) return body;

	return (
		<DemoRenderContext.Provider value={trackRender}>
			{body}
		</DemoRenderContext.Provider>
	);
};
