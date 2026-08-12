"use client";

import { cn } from "@/lib/utils";
import { CircleCheck, Code, TriangleAlert } from "lucide-react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
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

	/**
	 * お手本 (react-dev) に合わせて、数字は 1 から始める。
	 *
	 * 初回マウントぶんは数えないし光らせない。ここを数えると
	 * 「押していないのに render 2」から始まってしまい、
	 * 「数字が増える = 描き直された」という約束が最初から崩れる。
	 * （開発時は React が effect を 2 回走らせるので、なおさら目立つ）
	 */
	const countRef = useRef(1);
	const mountedRef = useRef(false);
	const labelRef = useRef<HTMLSpanElement>(null);
	const flashRef = useRef<HTMLDivElement>(null);

	/** 光らせ待ちの本数。連続で描き直されたときに潰し合わないよう順番に流す */
	const queueRef = useRef(0);
	const timerRef = useRef<number | undefined>(undefined);

	useEffect(() => {
		mountedRef.current = true;
		// StrictMode の作り直しでは片付けが走るので、そこで戻しておく
		return () => {
			mountedRef.current = false;
		};
	}, []);

	useEffect(() => {
		return () => {
			if (timerRef.current !== undefined) window.clearTimeout(timerRef.current);
		};
	}, []);

	const pump = useCallback(() => {
		const step = () => {
			if (queueRef.current === 0) {
				timerRef.current = undefined;
				// 光り終わったら印を外しておく（付けっぱなしにしない）
				flashRef.current?.classList.remove("react-dev-render-flash");
				return;
			}
			queueRef.current--;

			const element = flashRef.current;
			if (element) {
				element.classList.remove("react-dev-render-flash");
				// すでに光っている途中なら、いったん止めてから焼き直す
				void element.offsetWidth;
				element.classList.add("react-dev-render-flash");
			}

			// 次の 1 本は少し置いてから。こうしないと「2 回光った」が 1 回に見える
			timerRef.current = window.setTimeout(step, queueRef.current > 0 ? 300 : 900);
		};

		step();
	}, []);

	const trackRender = useCallback(() => {
		if (!mountedRef.current) {
			// マウント時の報告。数字だけ出して、光らせない
			if (labelRef.current) labelRef.current.textContent = "render 1";
			return;
		}

		countRef.current++;
		if (labelRef.current) {
			labelRef.current.textContent = `render ${countRef.current}`;
		}

		// 何十回も連鎖したときに延々ストロボしないよう、待ち行列は 3 本まで
		queueRef.current = Math.min(queueRef.current + 1, 3);
		if (timerRef.current === undefined) pump();
	}, [pump]);

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
					className="pointer-events-none absolute inset-0 rounded-xl border border-sky-400 bg-sky-400/15 opacity-0"
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
