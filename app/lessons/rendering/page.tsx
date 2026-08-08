import { Callout } from "@/components/lesson/callout";
import { DemoCard } from "@/components/lesson/demo-card";
import { LessonFooter } from "@/components/lesson/lesson-footer";
import { LessonHeader } from "@/components/lesson/lesson-header";
import { LessonSection } from "@/components/lesson/lesson-section";
import { LessonShell } from "@/components/lesson/lesson-shell";
import { Quiz } from "@/components/lesson/quiz";
import { StaticCode } from "@/components/lesson/static-code";
import { focus, loadSnippets } from "@/lib/code";
import { findLesson } from "@/lib/curriculum";
import type { Metadata } from "next";
import { RenderCounter } from "./demos/render-counter";

const SLUG = "rendering";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{
		path: "lessons/rendering/demos/render-counter.tsx",
		label: "render-counter.tsx",
	},
] as const;

const [COUNTER] = SOURCES.map((source) => source.path);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					Part 4-1 で、<code>setCount</code> は画面を直接書き換えるのではなく、
					<strong>関数をもう一度実行させる</strong>と説明しました。
				</p>
				<p>
					この章では、その「もう一度実行する」という動きを
					<strong>目で見える形</strong>にします。
				</p>
				<p>
					React では、コンポーネントの関数が実行されることを
					<strong>再レンダリング</strong>と呼びます。
					これが起きても、画面のすべてが一から作り直されるわけではありません。
				</p>
			</LessonHeader>

			<LessonSection id="intro" {...at(COUNTER, "function RenderCounter")}>
				<h2>再レンダリングとは、関数がもう一度実行されること</h2>

				<p>
					React のコンポーネントは関数です。 state
					を変えると、その関数がまた呼ばれます。 これが{" "}
					<strong>再レンダリング</strong> です。
				</p>

				<DemoCard
					title="再レンダリングのカウンター"
					sourcePath={COUNTER}
					showRenderCount
					description="押すたびにコンポーネント関数がもう一度走る"
				>
					<RenderCounter />
				</DemoCard>

				<p>
					左のデモでボタンを押すと、右上の数字が増えます。
					これは「このデモの中の tracked
					コンポーネントが再び描かれた」ことを表しています。
				</p>
			</LessonSection>

			<LessonSection
				id="what"
				{...at(
					COUNTER,
					"const [count, setCount] = useState(0);",
					"onClick={() => setCount(count + 1)}",
				)}
			>
				<h2>再レンダリングは、画面の更新ではない</h2>

				<StaticCode
					lang="ts"
					code={`const [count, setCount] = useState(0);

function RenderCounter() {
  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}`}
				/>

				<p>
					<code>setCount</code> は React への依頼です。
					「値が変わったよ」と教えます。 React
					はそのあと、コンポーネントの関数をもう一度実行します。
				</p>

				<p>
					そして React は、前回の結果と今回の結果を比べて
					<strong>変わったところだけを実際の画面に反映します</strong>。
					すべてをまっさらに作り直すわけではありません。
				</p>

				<Callout variant="point" title="再レンダリングと画面の更新は別物">
					<p>
						関数の実行と、ブラウザに何かが描かれることは
						<strong>別の段階</strong>です。
					</p>
					<p>
						React はまず関数を実行し、次に差分だけを更新します。
						だから「再レンダリング＝遅い」とは限りません。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection
				id="quiz"
				{...at(
					COUNTER,
					"const [count, setCount] = useState(0);",
					"useTrackDemoRender();",
				)}
			>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="再レンダリングとは何ですか？"
					options={[
						{
							label: "コンポーネントの関数がもう一度実行されること",
							correct: true,
							explanation:
								"React では、state が変わるとコンポーネントの関数が再び実行されます。これが再レンダリングです。",
						},
						{
							label: "画面全体が一から書き直されること",
							explanation:
								"関数は再び実行されますが、React は変わったところだけを実際の画面に更新します。全部を作り直すわけではありません。",
						},
						{
							label: "button 要素が一回クリックされること",
							explanation:
								"クリックはきっかけのひとつにすぎません。再レンダリングは関数の実行を指します。",
						},
					]}
				/>

				<Quiz
					question="setCount を呼んだとき、React は何をしますか？"
					options={[
						{
							label: "コンポーネントの関数をもう一度実行し、新しい UI を作る",
							correct: true,
							explanation:
								"setCount は画面を直接書き換えるのではなく、React に再レンダリングを頼むための関数です。",
						},
						{
							label: "画面の該当部分だけを直接書き換える",
							explanation:
								"React は最初に関数を実行して新しい JSX を作り、それから差分だけを反映します。",
						},
						{
							label: "値が変わったあと、ブラウザが自動で refresh する",
							explanation:
								"React はブラウザのリロードを使いません。レンダリングは JavaScript の関数実行と差分更新です。",
						},
					]}
				/>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
