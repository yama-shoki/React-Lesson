"use client";

import { Component, type ReactNode } from "react";

/**
 * わざと壊すデモを、その箱の中だけで受け止めるための囲い。
 *
 * これが無いと、デモが投げた例外がページの外まで届いてしまう。
 * 開発中は全画面のエラー表示に覆われ、本番では章ごと真っ白になる。
 * 「押すと壊れます」と書いてある以上、壊れるのはその箱の中だけであるべき。
 *
 * React の決まりで、例外を受け止める役はクラスでしか書けない。
 * 教材でクラスを使っているのはここだけ。
 */
export class DemoErrorBoundary extends Component<
	{ children: ReactNode },
	{ message: string | null }
> {
	state = { message: null as string | null };

	static getDerivedStateFromError(error: unknown) {
		return {
			message: error instanceof Error ? error.message : String(error),
		};
	}

	render() {
		if (this.state.message === null) return this.props.children;

		return (
			<div className="flex flex-col gap-3">
				<p className="font-semibold text-amber-700 dark:text-amber-400">
					デモが壊れました。React はこう言っています:
				</p>

				<pre className="overflow-x-auto rounded-md border border-amber-500/50 bg-amber-500/[0.06] p-3 font-mono text-xs">
					{this.state.message}
				</pre>

				<button
					type="button"
					onClick={() => this.setState({ message: null })}
					className="focus-ring self-start rounded-md border px-3 py-1.5 text-sm"
				>
					元に戻す
				</button>
			</div>
		);
	}
}
