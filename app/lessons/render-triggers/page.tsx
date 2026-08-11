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
import { StateDown } from "./demos/state-down";
import { StateUp } from "./demos/state-up";
import { ParentRerendersChild } from "./demos/parent-re-renders-child";

const SLUG = "render-triggers";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{
		path: "lessons/render-triggers/demos/parent-re-renders-child.tsx",
		label: "parent-re-renders-child.tsx",
	},
	{
		path: "lessons/render-triggers/demos/state-up.tsx",
		label: "state-up.tsx",
	},
	{
		path: "lessons/render-triggers/demos/state-down.tsx",
		label: "state-down.tsx",
	},
] as const;

const [PARENT, UP, DOWN] = SOURCES.map((source) => source.path);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					再レンダリングが起きる理由は、いまのところ 2 つです。 自分の state
					が変わったときと、親がもう一度描き直されたときです。
					（3 つめは Part 9 の Context で出てきます）
				</p>
				<p>
					ここで大切なのは、<strong>props が変わったから</strong>
					ではないということです。
					親が再レンダリングされると、子も再レンダリングされます。
				</p>
			</LessonHeader>

			<LessonSection
				id="parent"
				{...at(
					PARENT,
					"useTrackDemoRender();",
					"function ParentRerendersChild",
				)}
			>
				<h2>子が props を受け取っていなくても再レンダリングされる</h2>

				<p>
					下のデモでは、子コンポーネントに props を渡していません。
					それでも親のボタンを押すと、子の render 回数が増えます。
				</p>

				<DemoCard
					title="親の更新で子も再レンダリング"
					sourcePath={PARENT}
					showRenderCount
					tone="neutral"
					description="親の state を更新すると、子も再び実行される"
				>
					<ParentRerendersChild />
				</DemoCard>

				<p>
					React は子の関数をもう一度実行して、その結果を比べます。 props
					が同じでも、親が再び描き直されるときは子も動きます。
				</p>
			</LessonSection>

			<LessonSection
				id="why"
				{...at(
					PARENT,
					"onClick={() => setCount((current) => current + 1)}",
					"<Child />",
				)}
			>
				<h2>props の変化はきっかけではない</h2>

				<StaticCode
					lang="ts"
					code={`function Child() {
  useTrackDemoRender();
  return <p>私は props を受け取っていません。</p>;
}

function Parent() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount((current) => current + 1)}>
        親を更新する
      </button>
      <Child />
    </div>
  );
}`}
				/>

				<p>
					この例では、子が受け取る値はありません。
					それでも親が更新されれば、子の関数は再び呼ばれます。
				</p>

				<Callout variant="warn" title="props が変わることだけが原因ではない">
					<p>
						親が再レンダリングされたとき、React は子の結果を再び計算します。
					</p>
					<p>
						そのとき props が同じかどうかは、React が次に決めることです。 props
						が同じでも、子の関数は実行されます。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="placement" {...at(UP, "const [keyword, setKeyword]")}>
				<h2>だから「state をどこに置くか」が効いてくる</h2>

				<p>
					親が動けば子も動く。この性質には、実用的な使い道があります。
					<strong>state を置く場所を変えるだけで、
					描き直される範囲が変わります。</strong>
				</p>

				<p>
					下は検索欄と一覧です。一覧は入力とまったく関係ありません。
					<strong>打ちながら、下の箱が光るかどうかを見てください。</strong>
				</p>

				<DemoCard
					title="state を外側に置いた場合"
					tone="bad"
					sourcePath={UP}
					showRenderCount
					description="打つたびに、関係のない一覧まで光る"
				>
					<StateUp />
				</DemoCard>

				<p>
					<strong>一覧まで一緒に光っています。</strong>
					<code>keyword</code> を受け取ってすらいないのに、です。
					いちばん外側が描き直されているので、中身が全部巻き込まれています。
				</p>

				<p>
					直し方は<strong>state を、それを使う部品の中まで下ろす</strong>ことです。
				</p>

				<StaticCode
					lang="ts"
					code={`// 入力欄だけを部品にして、state をその中に持たせる
function SearchBox() {
  const [keyword, setKeyword] = useState("");
  return <input value={keyword} ... />;
}`}
				/>

				<DemoCard
					title="state を使う場所まで下ろした場合"
					tone="good"
					sourcePath={DOWN}
					showRenderCount
					description="打っても、一覧は光らない"
				>
					<StateDown />
				</DemoCard>

				<p>
					<strong>一覧が光らなくなりました。</strong>
					描き直されるのは <code>SearchBox</code> の中だけです。
					外側は state を持っていないので、そもそも動きません。
				</p>

				<Callout variant="point" title="最初の一手は、道具ではなく置き場所">
					<p>
						次の Part では、描き直しを止める道具
						（<code>memo</code> など）が出てきます。
					</p>
					<p>
						ですが<strong>先に試すべきはこちら</strong>です。
						state を下ろすだけで済むなら、
						覚えることも、書き足すコードも増えません。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="quiz" {...at(PARENT, "function Child")}>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="子コンポーネントの props が同じでも再レンダリングされるのはどちらの場合？"
					options={[
						{
							label: "親が再レンダリングされたとき",
							correct: true,
							explanation:
								"親が再レンダリングされると、React は子も再び実行します。props が同じでもです。",
						},
						{
							label: "props が変わったときだけ",
							explanation:
								"props が同じでも子の関数は実行されるので、props は条件ではありません。React が props を見るのは、そのあとの話です。",
						},
						{
							label: "子に state があるときだけ",
							explanation:
								"子に state があっても、親が再レンダリングされれば子も再レンダリングされます。",
						},
					]}
				/>

				<Quiz
					question="親が再レンダリングするとき、子はどうなりますか？"
					options={[
						{
							label: "子の関数ももう一度実行される",
							correct: true,
							explanation:
								"React は親の結果だけでなく、子の結果も再計算します。props が変わっていなくても実行されます。",
						},
						{
							label: "子は前の結果をそのまま使い続ける",
							explanation:
								"React は子の結果を再確認するため、子の関数をもう一度呼びます。",
						},
						{
							label: "親が更新されると、子の画面は必ず消える",
							explanation:
								"子の画面は消えません。再レンダリングは表示を再計算するだけです。",
						},
					]}
				/>
			</LessonSection>

			<LessonSection id="summary" {...at(DOWN, "function SearchBox")}>
				<h2>この章のまとめ</h2>

				<ul>
					<li>
						再レンダリングの理由は
						<strong>自分の state が変わったか、親が描き直されたか</strong>
					</li>
					<li>
						<strong>props が変わったから、ではありません。</strong>
						props を受け取っていない子も、親と一緒に描き直される
					</li>
					<li>
						つまり<strong>描き直しは、上から下へ広がります</strong>
					</li>
					<li>
						だから<strong>state は、使う場所のなるべく近くに置く</strong>。
						それだけで範囲が狭まる
					</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
