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
					Part 4 の「useState」 で、<code>setCount</code> は画面を直接書き換えるのではなく、
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
					左のデモでボタンを押すと、カードの見出しの横にある数字が増えます。
					これは<strong>このコンポーネントの関数が、
					もう一度実行された回数</strong>です。
				</p>
			</LessonSection>

			<LessonSection
				id="what"
				{...at(
					COUNTER,
					"const [count, setCount] = useState(0);",
					"再レンダリングする",
				)}
			>
				<h2>再レンダリングは、画面の更新ではない</h2>

				<StaticCode
					lang="ts"
					code={`function RenderCounter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((current) => current + 1)}>
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
					ここで<strong>「結果」とは何か</strong>をはっきりさせておきます。
					これが分かると、この先の Part 8 が一気に読みやすくなります。
				</p>

				<p>
					Part 1 でやったとおり、<strong>JSX はただの値</strong>でした。
					<code>&lt;button&gt;{"{count}"}&lt;/button&gt;</code> を実行すると、
					画面が書き換わるのではなく
					<strong>「こういう button を出してくれ」という指示書</strong>が
					1 つできあがります。
				</p>

				<StaticCode
					lang="ts"
					code={`// 実行すると、だいたいこういう形の値になる
{ type: "button", props: { children: 1 } }`}
				/>

				<p>
					関数がもう一度実行されると、
					<strong>この指示書がもう 1 枚</strong>できます。
					React がやっているのは、
					<strong>前回の指示書と今回の指示書を見比べること</strong>です。
				</p>

				<StaticCode
					lang="ts"
					code={`前回: { type: "button", props: { children: 0 } }
今回: { type: "button", props: { children: 1 } }
         ↑ タグは同じ。中の文字だけ違う`}
				/>

				<p>
					<strong>違うのは文字だけなので、文字だけ書き換えます。</strong>
					button 自体は作り直しません。だからボタンを押していても
					フォーカスが外れませんし、入力欄の中身も消えません。
				</p>

				<p>
					この「見比べ」を<strong>差分の検出</strong>と呼びます。
					Part 3 の <code>key</code> は、
					まさにこの見比べのときに使われる目印でした。
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

			<LessonSection
				id="summary"
				{...at(COUNTER, "const [count, setCount] = useState(0);")}
			>
				<h2>この章のまとめ</h2>

				<ul>
					<li>
						再レンダリング＝
						<strong>コンポーネントの関数がもう一度実行されること</strong>
					</li>
					<li>
						実行して出てくるのは画面ではなく、
						<strong>「こう出してくれ」という指示書（JSX）</strong>
					</li>
					<li>
						React は<strong>前回の指示書と見比べて、違うところだけ</strong>
						実際の画面に反映する
					</li>
					<li>
						だから<strong>再レンダリング＝遅い、ではありません</strong>。
						関数の実行と、画面の書き換えは別の段階
					</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
