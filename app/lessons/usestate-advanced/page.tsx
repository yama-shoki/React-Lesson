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
import { LazyInit } from "./demos/lazy-init";
import { ResetByKey } from "./demos/reset-by-key";

const SLUG = "usestate-advanced";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{
		path: "lessons/usestate-advanced/demos/lazy-init.tsx",
		label: "lazy-init.tsx",
	},
	{
		path: "lessons/usestate-advanced/demos/reset-by-key.tsx",
		label: "reset-by-key.tsx",
	},
] as const;

const [LAZY, RESET] = SOURCES.map((source) => source.path);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					前の章で、よく使う 4 つの形を見ました。
					ふだん書くぶんには、あれで足ります。
				</p>
				<p>
					この章は<strong>「そういう手があるのか」と知っておくと効く</strong> 2 つです。
					どちらも<strong>知らないと、まず思いつきません</strong>。
				</p>
				<p>
					読み流して、必要になったときに思い出せれば十分です。
				</p>
			</LessonHeader>

			<LessonSection id="lazy" {...at(LAZY, "const [code] = useState(buildInitialCode);")}>
				<h2>1. 初期値の計算が重いとき</h2>

				<p>まず、よくある落とし穴から。</p>

				<StaticCode
					lang="ts"
					code={`const [code] = useState(buildInitialCode());`}
				/>

				<p>
					一見なんともない行です。ですが
					<strong><code>buildInitialCode()</code> は描き直すたびに毎回呼ばれます</strong>。
				</p>

				<p>
					初期値として使われるのは最初の 1 回だけなのに、
					<strong>計算だけは毎回走ります</strong>。
					括弧を書いた時点で先に実行され、その<strong>結果</strong>が渡るからです。
				</p>

				<StaticCode
					lang="ts"
					code={`// ✕ 毎回呼ばれる（結果だけ捨てられる）
useState(buildInitialCode());

// ◯ 最初の 1 回だけ呼ばれる
useState(buildInitialCode);`}
				/>

				<p>
					<strong>括弧を外すだけです。</strong>
					こう書くと「呼んだ結果」ではなく「関数そのもの」を渡すことになり、
					React が必要なときだけ呼びます。
				</p>

				<DemoCard
					title="初期値の計算を 1 回で済ませる"
					tone="good"
					sourcePath={LAZY}
					showRenderCount
					description="連打しても引っかからない"
				>
					<LazyInit />
				</DemoCard>

				<p>
					Part 0 の<strong>「関数を値として扱う」</strong>が効いてくる場面です。
					<code>onClick={"{handleClick}"}</code> と{" "}
					<code>onClick={"{handleClick()}"}</code> の違いと、まったく同じ話です。
				</p>

				<Callout variant="note" title="いつ気にするか">
					<p>
						<code>useState(0)</code> や <code>useState(&quot;&quot;)</code>{" "}
						のような値なら、気にする必要はありません。
					</p>
					<p>
						気にするのは<strong>初期値を関数で作っているとき</strong>だけです。
						保存されたデータの読み込み、大きな配列の組み立てなど。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="reset" {...at(RESET, "<CommentBox key={target}")}>
				<h2>2. key を変えて、state ごと作り直す</h2>

				<p>
					こちらは、知らないとまず思いつかない手です。
				</p>

				<p>
					感想を書く欄があり、対象を切り替えられるとします。
					<strong>切り替えたら、書きかけの文は消えてほしい</strong>。
				</p>

				<p>
					素直にやるなら、切り替えのたびに <code>setText(&quot;&quot;)</code>{" "}
					を呼ぶことになります。
					ですが state が増えるほど、消し忘れが出てきます。
				</p>

				<StaticCode code={`<CommentBox key={target} target={target} />`} />

				<p>
					<strong><code>key</code> を渡すだけです。</strong>
				</p>

				<DemoCard
					title="key を変えて作り直す"
					sourcePath={RESET}
					showRenderCount
					description="何か書いてから、もう片方に切り替えてみる"
				>
					<ResetByKey />
				</DemoCard>

				<p>
					<strong>書きかけの文が消えました。</strong>
					リセットのコードは 1 行も書いていません。
				</p>

				<p>
					Part 3 の「リストと key」で、
					<strong>key は React が「同じものか別のものか」を見分ける目印</strong>
					だと説明しました。それがそのまま効いています。
				</p>

				<p>
					<code>key</code> が変わると、React はそれを
					<strong>別のコンポーネントだと判断して作り直します</strong>。
					作り直された部品の state は、当然まっさらです。
				</p>

				<Callout variant="point" title="使いどころ">
					<ul>
						<li>編集する対象を切り替えたら、フォームを初期化したい</li>
						<li>「もう一度やる」で、中身を全部まっさらにしたい</li>
					</ul>
					<p>
						どちらも<strong>「消したい state を数える」必要がありません</strong>。
						中に何個あっても、まとめて消えます。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="quiz" {...at(LAZY, "const [code] = useState(buildInitialCode);")}>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="useState(buildValue()) と useState(buildValue) の違いは？"
					options={[
						{
							label: "前者は毎回呼ばれ、後者は最初の 1 回だけ呼ばれる",
							correct: true,
							explanation:
								"括弧を書いた時点で先に実行され、その結果が渡ります。関数そのものを渡せば、React が必要なときだけ呼びます。",
						},
						{
							label: "どちらも同じ。書き方の好み",
							explanation:
								"結果の値は同じですが、呼ばれる回数が違います。初期値の計算が重いと差が出ます。",
						},
						{
							label: "後者は初期値が undefined になる",
							explanation:
								"なりません。React が関数を呼んで、その戻り値を初期値にします。",
						},
					]}
				/>

				<Quiz
					question="key を変えると子コンポーネントの state が消えるのはなぜ？"
					options={[
						{
							label: "React が別のコンポーネントだと判断して、作り直すから",
							correct: true,
							explanation:
								"key は「同じものか別のものか」の目印です。別物と判断された部品は、state ごと作り直されます。",
						},
						{
							label: "key を変えると React が state を消す処理を走らせるから",
							explanation:
								"消しているのではなく、作り直しています。結果として前の state はどこにもありません。",
						},
						{
							label: "key に指定した値が state に代入されるから",
							explanation:
								"key は state とは関係ありません。見分けるための目印です。",
						},
					]}
				/>
			</LessonSection>

			<LessonSection id="summary" {...at(RESET, "<CommentBox key={target}")}>
				<h2>この章のまとめ</h2>

				<ul>
					<li>
						初期値の計算が重いなら<strong>括弧を外す</strong>
						（<code>useState(build)</code>）。最初の 1 回しか呼ばれなくなる
					</li>
					<li>
						<strong><code>key</code> を変える</strong>と、
						中の state がまるごと消える。リセットのコードを書かなくてよい
					</li>
					<li>
						どちらも<strong>困ってから思い出せば十分</strong>です
					</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
