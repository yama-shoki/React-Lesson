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
import { ParentRerendersChild } from "./demos/parent-re-renders-child";
import { RenderCounter } from "./demos/render-counter";
import { StateDown } from "./demos/state-down";
import { StateUp } from "./demos/state-up";

const SLUG = "rendering";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{
		path: "lessons/rendering/demos/render-counter.tsx",
		label: "render-counter.tsx",
	},
	{
		path: "lessons/rendering/demos/parent-re-renders-child.tsx",
		label: "parent-re-renders-child.tsx",
	},
	{ path: "lessons/rendering/demos/state-up.tsx", label: "state-up.tsx" },
	{ path: "lessons/rendering/demos/state-down.tsx", label: "state-down.tsx" },
] as const;

const [COUNTER, PARENT, UP, DOWN] = SOURCES.map((source) => source.path);

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
					きっかけは、いまのところ 2 つです。
					<strong>自分の state が変わったとき</strong>と、
					<strong>親がもう一度描き直されたとき</strong>。
					（3 つめは Part 9 の「Context」で出てきます）
				</p>
				<p>
					大切なのは、<strong>props が変わったから</strong>ではないことです。
					親が描き直されれば、props を受け取っていない子も描き直されます。
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
					上のデモでボタンを押すと、カードの見出しの横にある数字が増えます。
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
					code={`function Counter() {
  const [count, setCount] = useState(0);

  return (
    <p onClick={() => setCount((current) => current + 1)}>
      {count}
    </p>
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
					code={`前回: { type: "p", props: { children: 0 } }
今回: { type: "p", props: { children: 1 } }
         ↑ タグは同じ。中の文字だけ違う`}
				/>

				<p>
					<strong>違うのは文字だけなので、文字だけ書き換えます。</strong>
					要素そのものは作り直しません。だからボタンを押していても
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
						そのとき props が同じかどうかは、React が次に決めることです。
						props が同じでも、子の関数は実行されます。
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
					question="ページの一番上に置いた検索キーワードの state を、検索欄の中に移しました。何が変わりますか？"
					options={[
						{
							label: "打つたびに描き直される範囲が、検索欄の中だけに狭まる",
							correct: true,
							explanation:
								"描き直しは state を持つ場所から下へ広がります。state を下げれば、広がる範囲もそのぶん狭くなります。これが「使う場所の近くに置く」の効き目です。",
						},
						{
							label: "描き直しの回数が減る",
							explanation:
								"回数は変わりません。打った回数だけ描き直されます。変わるのは回数ではなく、1 回あたりに巻き込まれる範囲です。",
						},
						{
							label: "何も変わらない。React が賢く判断してくれる",
							explanation:
								"React は「この値を使っていないから飛ばそう」とは考えません。親が描き直されれば、子は props を受け取っていなくても描き直されます。だから置き場所が効いてきます。",
						},
					]}
				/>

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
					<li>
						きっかけは<strong>自分の state か、親が描き直されたか</strong>。
						props が変わったから、ではない
					</li>
					<li>
						つまり<strong>描き直しは、上から下へ広がります</strong>
					</li>
					<li>
						だから<strong>state は、使う場所のなるべく近くに置く</strong>。
						それだけで広がる範囲が狭まる
					</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
