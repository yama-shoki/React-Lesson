"use client";

import type { Snippet } from "@/lib/code";
import {
	createContext,
	type ReactNode,
	use,
	useCallback,
	useRef,
	useState,
} from "react";

/** 右ペインが今どのコードのどの行を見せているか */
export type ActiveCode = {
	snippetId: string;
	/** [開始行, 終了行]。1 始まり・両端を含む。省略するとファイル全体 */
	lines?: readonly [number, number];
};

type CodePaneValue = {
	snippets: Snippet[];
	active: ActiveCode | null;
	/**
	 * 読者が自分で選んだファイル。
	 * スクロールによる自動切り替えと区別するために別で持っている。
	 * デモカードとコードを線で結ぶ演出は、自分で選んだときだけ出したい。
	 */
	pinned: string | null;
	/** タブやデモカードの「コードを見る」ボタンから呼ばれる */
	selectSnippet: (snippetId: string) => void;
	/**
	 * セクションを監視対象に登録する。
	 * 戻り値を呼ぶと登録が解除される（useEffect の後片付けにそのまま渡せる）。
	 */
	registerSection: (element: Element, code: ActiveCode) => () => void;
};

const CodePaneContext = createContext<CodePaneValue | null>(null);

export const useCodePane = () => {
	const value = use(CodePaneContext);
	if (!value) {
		throw new Error("useCodePane は CodePaneProvider の中でしか使えません");
	}
	return value;
};

/**
 * 画面のこの帯に入ったセクションを「今読んでいるところ」とみなす。
 * 上から 65% ～ 75%、つまり画面の下寄り。
 *
 * 切り替わるのは「次の見出しが帯の上端（55%）を通過したとき」。
 * 帯を下げるほど、見出しがまだ画面の下のほうにあるうちに切り替わるので、
 * 体感としては早くなる。上げると、見出しが画面のてっぺん近くまで
 * 上がってからようやく切り替わり、読んでいる場所とコードがずれる。
 *
 * 幅を 10% と狭くしているのは、複数のセクションが同時に該当して
 * コードがチラつくのを防ぐため。
 * 上下の合計が 100% を超えると帯の高さが負になり、何も検出されなくなる。
 */
const ACTIVE_BAND = "-65% 0px -25% 0px";

export const CodePaneProvider = ({
	snippets,
	children,
}: {
	snippets: Snippet[];
	children: ReactNode;
}) => {
	const [active, setActive] = useState<ActiveCode | null>(null);
	const [pinned, setPinned] = useState<string | null>(null);

	/** 登録されたセクション要素 → そのセクションが指すコード */
	const sectionsRef = useRef(new Map<Element, ActiveCode>());
	/** 今まさに帯の中にいるセクション */
	const visibleRef = useRef(new Set<Element>());
	const observerRef = useRef<IntersectionObserver | null>(null);

	/**
	 * 帯に複数のセクションがいるときは、画面上でいちばん上のものを採用する。
	 * 帯が空になったときは何もしない（直前のコードを出したままにする）。
	 */
	const syncActive = useCallback(() => {
		const visible = [...visibleRef.current];
		if (visible.length === 0) return;

		visible.sort(
			(a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
		);

		const code = sectionsRef.current.get(visible[0]);
		if (!code) return;

		// 読み進めたら、自分で選んだ状態は解除する。
		// 解説と関係のないコードが選ばれたまま残るほうが混乱するため
		setPinned(null);

		setActive((current) => {
			if (
				current?.snippetId === code.snippetId &&
				current.lines?.[0] === code.lines?.[0] &&
				current.lines?.[1] === code.lines?.[1]
			) {
				return current;
			}

			// 同じファイルのまま行指定だけ消える節（クイズ・まとめ）では、
			// 直前の注目行を残す。ここで先頭に戻すと、クイズを解こうとした
			// 瞬間に根拠のコードが視界から消えてしまう
			if (current?.snippetId === code.snippetId && !code.lines) return current;

			return code;
		});
	}, []);

	/**
	 * Observer は最初の登録時に作る。
	 * 子の useEffect は親より先に走るので、Provider 側の useEffect では間に合わない。
	 */
	const getObserver = useCallback(() => {
		observerRef.current ??= new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						visibleRef.current.add(entry.target);
					} else {
						visibleRef.current.delete(entry.target);
					}
				}
				syncActive();
			},
			{ rootMargin: ACTIVE_BAND, threshold: 0 },
		);
		return observerRef.current;
	}, [syncActive]);

	const registerSection = useCallback(
		(element: Element, code: ActiveCode) => {
			sectionsRef.current.set(element, code);
			getObserver().observe(element);

			// 最初のセクションが登録された時点で右ペインを埋めておく。
			// これがないとページを開いた直後にコードが空になる。
			// ただし行のハイライトは付けない。まだ読んでいない箇所が
			// 光っていると、それが何を指しているのか分からないため
			setActive((current) => current ?? { snippetId: code.snippetId });

			return () => {
				sectionsRef.current.delete(element);
				visibleRef.current.delete(element);
				observerRef.current?.unobserve(element);
			};
		},
		[getObserver],
	);

	const selectSnippet = useCallback((snippetId: string) => {
		setPinned(snippetId);
		// ファイル全体を見たいときの操作なので、行のハイライトは外す
		setActive({ snippetId });
	}, []);

	return (
		<CodePaneContext
			value={{ snippets, active, pinned, selectSnippet, registerSection }}
		>
			{children}
		</CodePaneContext>
	);
};
