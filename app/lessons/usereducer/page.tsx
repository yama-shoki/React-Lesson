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
import { Scattered } from "./demos/scattered";
import { WithReducer } from "./demos/with-reducer";

const SLUG = "usereducer";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{ path: "lessons/usereducer/demos/scattered.tsx", label: "scattered.tsx" },
	{
		path: "lessons/usereducer/demos/with-reducer.tsx",
		label: "with-reducer.tsx",
	},
] as const;

const [SCATTERED, REDUCER] = SOURCES.map((source) => source.path);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					<code>useState</code> は、状態が 1 つか 2 つのうちは快適です。
				</p>
				<p>
					ですが数が増え、「リセット」「下書きを読み込む」のように
					<strong>まとめて変える操作</strong>が出てくると、
					更新のコードが画面のあちこちに散らばりはじめます。
				</p>
				<p>
					<code>useReducer</code> は、その散らばりを
					<strong>1 か所に集める</strong>ための道具です。
				</p>
			</LessonHeader>

			<LessonSection
				id="scattered"
				{...at(SCATTERED, "const [name, setName]", "setAgreed(false);")}
			>
				<h2>散らばっていく様子を見る</h2>

				<p>
					名前・メール・同意チェックの 3 つを持つフォームです。
					<code>useState</code> を 3 つ並べて作ってあります。
				</p>

				<DemoCard
					title="useState を 3 つ並べたフォーム"
					sourcePath={SCATTERED}
					showRenderCount
					description="動く。ただし更新の手順が増えていく"
				>
					<Scattered />
				</DemoCard>

				<p>
					動きます。問題は<strong>「リセット」</strong>です。
				</p>

				<StaticCode
					lang="ts"
					code={`const reset = () => {
  setName("");
  setEmail("");
  setAgreed(false);
};`}
				/>

				<p>
					項目を 1 つ増やすたびに、ここも 1 行増えます。
					<strong>そして書き忘れても、React は何も教えてくれません</strong>。
					画面上はただ「リセットしたのに 1 つだけ残る」という不具合になります。
				</p>

				<p>
					state が 3 つなら耐えられます。
					実際のフォームで 8 個、10 個になったところを想像してください。
				</p>
			</LessonSection>

			<LessonSection id="shape" {...at(REDUCER, "type Form = {", "};")}>
				<h2>まず、状態を 1 つにまとめる</h2>

				<p>
					バラバラの <code>useState</code> をやめて、
					<strong>1 つのオブジェクト</strong>にします。
				</p>

				<StaticCode
					lang="ts"
					code={`type Form = {
  name: string;
  email: string;
  agreed: boolean;
};`}
				/>

				<p>
					こうすると「フォームの状態」がコード上の 1 か所に現れます。
					項目を足すのも、この型に 1 行足すだけです。
				</p>
			</LessonSection>

			<LessonSection
				id="action"
				{...at(REDUCER, "type Action =", '| { type: "reset" };')}
			>
				<h2>次に、「起きたこと」を並べる</h2>

				<p>
					ここが <code>useReducer</code> のいちばん大事な考え方です。
				</p>

				<Callout variant="point" title="どう変えるか、ではなく、何が起きたか">
					<p>
						<code>{'setName("太郎")'}</code> は
						<strong>「どう変えるか」</strong>を書いています。
					</p>
					<p>
						<code>{'dispatch({ type: "changed_name", value: "太郎" })'}</code> は
						<strong>「何が起きたか」</strong>を書いています。
					</p>
					<p>
						（<code>dispatch</code> は
						<strong>「出来事を送る関数」</strong>です。
						この章のあいだ、ずっとこの意味で出てきます）
					</p>
				</Callout>

				<p>
					この違いが効いてきます。「何が起きたか」で書くと、
					<strong>1 つの出来事で複数の値をまとめて変えられる</strong>からです。
				</p>

				<p>
					たとえば <code>reset</code> は「リセットが押された」という
					<strong>1 つの出来事</strong>です。
					<code>useState</code> 版ではこれが 3 回の更新に分解されていました。
					出来事として書けば、分解する必要がありません。
				</p>

				<Callout variant="note" title="名前のつけかた">
					<p>
						アクションの名前は、
						<strong>操作する側から見た出来事</strong>にします。
					</p>
					<ul>
						<li>
							◯ <code>changed_name</code>、<code>reset</code>、
							<code>added_todo</code>
						</li>
						<li>
							✕ <code>set_name</code>、<code>update_state</code>
						</li>
					</ul>
					<p>
						後者だと、結局「どう変えるか」を書いていることになり、
						集めた意味が薄れます。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection
				id="reducer"
				{...at(REDUCER, "function formReducer", "return initialForm;")}
			>
				<h2>最後に、更新の一覧表を書く</h2>

				<p>
					<strong>いまの状態</strong>と<strong>起きたこと</strong>を受け取って、
					<strong>次の状態</strong>を返す関数です。これを reducer と呼びます。
				</p>

				<StaticCode
					lang="ts"
					code={`function formReducer(state, action) {
  // いまの状態 + 起きたこと → 次の状態
}`}
				/>

				<p>
					この関数を読めば、
					<strong>このフォームで起こりうる変化が全部わかります</strong>。
					画面のコードを追いかける必要がありません。
				</p>

				<Callout variant="note" title="default を書いていないのはなぜ？">
					<p>
						<code>switch</code> なのに <code>default</code> がありません。
						ふつうは書き忘れですが、ここは意図的です。
					</p>
					<p>
						<code>Action</code> の型で
						<strong>ありうる出来事を並べてある</strong>ので、
						4 つ全部書けば漏れはありません。
						逆に 1 つ書き忘れると、
						<strong>TypeScript がその場で教えてくれます</strong>。
					</p>
				</Callout>

				<Callout variant="warn" title="reducer の中で state を書き換えない">
					<p>
						Part 4 の「オブジェクトと配列の更新」と同じ決まりです。
						<code>state.name = ...</code> ではなく、
						<code>{"{ ...state, name: ... }"}</code> と新しく作って返します。
					</p>
					<p>
						reducer は<strong>純粋な関数</strong>である必要があります。
						同じ引数なら必ず同じ結果を返し、外の世界に触らない。
						（外の世界に触る、とは
						<strong>通信したり、外の変数を書き換えたり、
						画面を直接いじったりすること</strong>です）
						そのおかげで、この関数だけを取り出してテストできます。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="result" {...at(REDUCER, "const [form, dispatch]")}>
				<h2>できあがり</h2>

				<StaticCode
					lang="ts"
					code={`const [form, dispatch] = useReducer(formReducer, initialForm);`}
				/>

				<p>
					<code>useState</code> とよく似た形です。受け取るのは
					<strong>いまの状態</strong>と<strong>出来事を送る関数</strong>。
					変わったのは、更新のしかたが reducer に集まったことだけです。
				</p>

				<DemoCard
					title="useReducer でまとめたフォーム"
					tone="good"
					sourcePath={REDUCER}
					showRenderCount
					description="見た目の動きは同じ。中身の置き方が違う"
				>
					<WithReducer />
				</DemoCard>

				<p>
					<strong>画面の動きはまったく同じです。</strong>
					変わったのは、リセットの実装がこうなったこと。
				</p>

				<StaticCode
					lang="ts"
					code={`// useState 版
setName(""); setEmail(""); setAgreed(false);

// useReducer 版
dispatch({ type: "reset" });`}
				/>

				<p>
					項目が 10 個に増えても、
					<strong>この行は変わりません</strong>。
					増えた分は reducer の <code>reset</code> が面倒を見ます。
					書き忘れようがなくなりました。
				</p>
			</LessonSection>

			<LessonSection id="when" {...at(REDUCER, "const [form, dispatch]")}>
				<h2>どちらを使うか</h2>

				<p>
					<code>useReducer</code> のほうが必ず良い、というわけではありません。
					<strong>書く量は確実に増えます</strong>。
					その代わり、更新が 1 か所に集まります。
				</p>

				<div className="not-prose my-6 overflow-x-auto">
					<table className="w-full min-w-[34rem] border-collapse text-sm">
						<thead>
							<tr className="border-b">
								<th className="p-3 text-left font-semibold">状況</th>
								<th className="p-3 text-left font-semibold">選ぶもの</th>
							</tr>
						</thead>
						<tbody className="text-muted-foreground">
							<tr className="border-b">
								<td className="p-3">値が 1〜2 個で、単純に入れ替えるだけ</td>
								<td className="p-3 font-mono text-foreground">useState</td>
							</tr>
							<tr className="border-b">
								<td className="p-3">
									1 つの操作で複数の値がまとめて変わる
								</td>
								<td className="p-3 font-mono text-foreground">useReducer</td>
							</tr>
							<tr className="border-b">
								<td className="p-3">
									更新のコードが画面のあちこちに散っている
								</td>
								<td className="p-3 font-mono text-foreground">useReducer</td>
							</tr>
							<tr>
								<td className="p-3">
									「なぜこの値になったか」を追いにくい
								</td>
								<td className="p-3 font-mono text-foreground">useReducer</td>
							</tr>
						</tbody>
					</table>
				</div>

				<p>
					<strong>迷ったら <code>useState</code> で始めてかまいません。</strong>
					つらくなってから移せます。
					実際、この章でやったのはまさにその作業でした。
				</p>

				<Callout variant="note" title="Context と組み合わせる">
					<p>
						Part 9 で Context をやります。
						<code>useReducer</code> の <code>dispatch</code> は
						<strong>毎回同じものが返ってきます</strong>。
						これが Context で配るときに効いてきます
						（なぜ嬉しいのかは Part 8 で扱います）。
					</p>
					<p>
						「状態は Context A、dispatch は Context B」と分けて配るのは、
						大きなアプリでよく見る形です。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="quiz" {...at(REDUCER, "type Action =")}>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="アクションの名前として適切なのは？"
					options={[
						{
							label: '{ type: "added_todo", text }',
							correct: true,
							explanation:
								"操作する側から見た「起きたこと」になっています。1 つの出来事で複数の値を変えられるのは、この書き方だからです。",
						},
						{
							label: '{ type: "set_todos", todos }',
							explanation:
								"「どう変えるか」を書いています。これでは setTodos を遠回りに呼んでいるだけで、集めた意味がありません。",
						},
						{
							label: '{ type: "update", key, value }',
							explanation:
								"何でも入る万能アクションは、reducer を読んでも何が起きうるのか分からなくなります。",
						},
					]}
				/>

				<Quiz
					question="reducer の中で state.name = value と書いてよい？"
					options={[
						{
							label: "だめ。新しいオブジェクトを作って返す",
							correct: true,
							explanation:
								"reducer は純粋な関数である必要があります。直接書き換えると React は変化に気づけず、テストもしにくくなります。",
						},
						{
							label: "よい。reducer の中は特別だから",
							explanation:
								"特別ではありません。Part 4 でやった決まりがそのまま適用されます。",
						},
						{
							label: "よい。最後に return すれば問題ない",
							explanation:
								"return しても、渡された state を書き換えている事実は変わりません。",
						},
					]}
				/>

				<Quiz
					question="useReducer に移して得られるのは？"
					options={[
						{
							label: "更新のしかたが 1 か所に集まり、追いやすくなる",
							correct: true,
							explanation:
								"reducer を読めば起こりうる変化が全部わかります。代わりに書く量は増えます。",
						},
						{
							label: "描き直しが減って速くなる",
							explanation:
								"速度のための道具ではありません。描き直しの回数は基本的に変わりません。",
						},
						{
							label: "コードの量が減る",
							explanation:
								"むしろ増えます。増えた分と引き換えに、見通しを買っています。",
						},
					]}
				/>

				<Quiz
					question="dispatch を子コンポーネントに渡すとき、useCallback で包む必要はある？"
					options={[
						{
							label: "ない。dispatch は毎回同じものが返ってくると決まっている",
							correct: true,
							explanation:
								"React が保証しています。だから memo した子に渡しても、依存配列に入れても安全です。ここが useState の setter と同じで、useReducer を選ぶ理由の 1 つになります。",
						},
						{
							label: "ある。関数なので毎回新しく作られる",
							explanation:
								"自分で書いた関数はそうですが、dispatch は React が用意したものです。作り直されません。",
						},
						{
							label: "state が変わったときだけ包む必要がある",
							explanation:
								"state が変わっても dispatch は変わりません。だから条件によらず、包む必要はありません。",
						},
					]}
				/>
			</LessonSection>

			<LessonSection id="summary" {...at(REDUCER, "function formReducer")}>
				<h2>この章のまとめ</h2>

				<ul>
					<li>
						state が増え、<strong>まとめて変える操作</strong>が出てきたら
						<code>useReducer</code> の出番
					</li>
					<li>
						アクションは<strong>「どう変えるか」ではなく「何が起きたか」</strong>
						で書く
					</li>
					<li>
						reducer は<strong>純粋な関数</strong>。state を直接書き換えない
					</li>
					<li>
						書く量は増える。代わりに<strong>更新が 1 か所に集まる</strong>
					</li>
					<li>迷ったら <code>useState</code> から始めて、つらくなったら移す</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
