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
import { BrokenOrder } from "./demos/broken-order";
import { FixedOrder } from "./demos/fixed-order";

const SLUG = "hooks-rules";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{
		path: "lessons/hooks-rules/demos/broken-order.tsx",
		label: "broken-order.tsx",
	},
	{
		path: "lessons/hooks-rules/demos/fixed-order.tsx",
		label: "fixed-order.tsx",
	},
] as const;

const [BROKEN, FIXED] = SOURCES.map((source) => source.path);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					<code>useState</code> のように <code>use</code> で始まるものを、
					まとめて<strong>フック</strong>と呼びます。
				</p>
				<p>
					このフックには<strong>守らないといけない決まりが 2 つ</strong>あります。
					たった 2 つですが、破ると直しにくい壊れ方をします。
				</p>
				<p>
					しかも<strong>これから先の章で「ルールを守っていれば」という前提が
					何度も出てきます</strong>。先にここで決着をつけておきます。
				</p>
			</LessonHeader>

			<LessonSection id="rules" {...at(FIXED, "const [showNickname, setShowNickname]")}>
				<h2>決まりは 2 つだけ</h2>

				<Callout variant="point" title="フックの決まり">
					<ol>
						<li>
							<strong>関数のいちばん上で呼ぶ。</strong>
							<code>if</code> や <code>for</code> の中、
							<code>return</code> より後では呼ばない
						</li>
						<li>
							<strong>呼ぶのはコンポーネントか、他のフックの中だけ。</strong>
							ふつうの関数の中では呼ばない
						</li>
					</ol>
				</Callout>

				<p>
					1 つめを言い換えると、
					<strong>「毎回、同じフックが、同じ順番で呼ばれる」</strong>ようにしろ、
					ということです。
				</p>

				<p>なぜそんな決まりがあるのか。破ってみると分かります。</p>
			</LessonSection>

			<LessonSection id="broken" {...at(BROKEN, "if (showNickname) {", "useState(\"\")")}>
				<h2>破ってみる</h2>

				<p>
					「ボタンを押したときだけ入力欄を出す」画面です。
					入力欄が出るときだけ <code>useState</code> が要るのだから、
					<code>if</code> の中で呼べばいい——そう考えたくなります。
				</p>

				<StaticCode
					lang="ts"
					code={`const [showNickname, setShowNickname] = useState(false);

if (showNickname) {
  const [nickname, setNickname] = useState("");   // ✕ if の中
  ...
}`}
				/>

				<DemoCard
					title="if の中でフックを呼ぶ"
					tone="bad"
					sourcePath={BROKEN}
					description="ボタンを押すと、その場で壊れます"
				>
					<BrokenOrder />
				</DemoCard>

				<p>
					<strong>押した瞬間にエラーになります。</strong>
					React はこう言ってきます。
				</p>

				<StaticCode
					lang="bash"
					code={`Rendered more hooks than during the previous render.`}
				/>

				<p>
					「前回より多くのフックが呼ばれました」。
					<strong>数が合っていない</strong>と怒られています。
				</p>
			</LessonSection>

			<LessonSection id="why" {...at(BROKEN, "const [showNickname, setShowNickname]")}>
				<h2>なぜ数と順番が大事なのか</h2>

				<p>
					ここが腑に落ちると、決まりを丸暗記しなくてよくなります。
				</p>

				<p>
					<strong>React は、あなたが付けた変数名を見ていません。</strong>
					<code>nickname</code> という名前は、React には届いていないのです。
				</p>

				<StaticCode
					lang="ts"
					code={`const [count, setCount] = useState(0);
const [name, setName] = useState("");`}
				/>

				<p>
					React が知っているのは
					<strong>「1 番目の useState」「2 番目の useState」</strong>
					という<strong>呼ばれた順番だけ</strong>です。
					箱に番号を振って、順番に配っているイメージです。
				</p>

				<Callout variant="point" title="ロッカーの番号だと思ってください">
					<p>
						コインロッカーに荷物を預けるとき、
						<strong>預けた順に 1 番、2 番…と割り当てられる</strong>とします。
						名前は書きません。番号だけが手がかりです。
					</p>
					<p>
						毎回同じ順で預けるうちは、何も問題ありません。
					</p>
					<p>
						ですがある回だけ 1 つ飛ばして預けると、
						<strong>2 番の荷物を取りに行ったら 3 番のものが出てきます</strong>。
						これが <code>if</code> の中でフックを呼んだときに起きることです。
					</p>
				</Callout>

				<p>
					デモの場合、<code>showNickname</code> が <code>false</code> のときは
					フックが 1 つ、<code>true</code> のときは 2 つ。
					<strong>回によって数が変わってしまいます</strong>。
					React は前回と照らし合わせられなくなり、その場で止めます。
				</p>

				<p>
					止めてくれるだけ親切です。もし止まらなければ、
					<strong>別の state の値が入ってくる</strong>という、
					原因の見えない不具合になります。
				</p>
			</LessonSection>

			<LessonSection id="fixed" {...at(FIXED, "const [nickname, setNickname]")}>
				<h2>直し方</h2>

				<p>
					<strong>フックを全部いちばん上に並べて、出し分けは表示側でやります。</strong>
				</p>

				<StaticCode
					lang="ts"
					code={`// フックは無条件に、いつも同じ順で
const [showNickname, setShowNickname] = useState(false);
const [nickname, setNickname] = useState("");

// 出し分けるのは「呼ぶかどうか」ではなく「表示するかどうか」
if (showNickname) {
  return <入力欄 />;
}`}
				/>

				<DemoCard
					title="フックを上に並べる"
					tone="good"
					sourcePath={FIXED}
					description="今度は壊れません。しかも入力が残ります"
				>
					<FixedOrder />
				</DemoCard>

				<p>
					<strong>おまけがあります。</strong>
					閉じてからもう一度開くと、
					<strong>打った文字が残っています</strong>。
					state が常にそこにあるからです。
				</p>

				<p>
					「使わないかもしれないフックを毎回呼ぶのはむだでは？」と思うかもしれません。
					<code>useState</code> は<strong>ほとんど何もしません</strong>。
					箱を 1 つ用意するだけです。気にする必要はありません。
				</p>

				<Callout variant="note" title="早めに return するときの注意">
					<StaticCode
						lang="ts"
						code={`function Profile({ user }) {
  if (!user) return <p>読み込み中</p>;   // ← この後で
  const [name, setName] = useState("");  // ✕ フックを呼んでいる
}`}
					/>
					<p>
						これも決まり違反です。<code>return</code> したら、
						その先のフックは呼ばれません。
						<strong>早めに返すコードより前に、フックを置いてください。</strong>
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="lint" {...at(FIXED, "export function FixedOrder")}>
				<h3>覚えなくても、道具が教えてくれる</h3>

				<p>
					うれしいことに、この 2 つの決まりは
					<strong>lint が自動で見張ってくれます</strong>。
					<code>if</code> の中でフックを呼んだ時点で、赤線が出ます。
				</p>

				<StaticCode
					lang="bash"
					code={`React Hook "useState" is called conditionally.
React Hooks must be called in the exact same order in every component render.`}
				/>

				<p>
					<strong>この見張りが働く条件が、名前です。</strong>
					<code>use</code> で始まっているものだけを、lint はフックだと見なします。
				</p>

				<p>
					Part 6 で自分でフックを作るとき、
					<strong>名前を <code>use</code> で始める</strong>という決まりが出てきます。
					理由はこれです。名前を守ると、見張りが付いてきます。
				</p>
			</LessonSection>

			<LessonSection id="quiz" {...at(BROKEN, "if (showNickname) {")}>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="React は、どの state がどれかをどうやって見分けている？"
					options={[
						{
							label: "呼ばれた順番",
							correct: true,
							explanation:
								"変数名は React に届いていません。1 番目、2 番目…という順番だけが手がかりです。だから順番が変わると取り違えます。",
						},
						{
							label: "変数名（count や name）",
							explanation:
								"見ていません。同じ名前を付けても、別の名前を付けても、React の動きは変わりません。",
						},
						{
							label: "useState に渡した初期値",
							explanation:
								"初期値は最初の 1 回にしか使われません。見分けには使えません。",
						},
					]}
				/>

				<Quiz
					question="条件によって使ったり使わなかったりする state は、どう書く？"
					options={[
						{
							label: "フックは無条件に呼び、表示のほうを出し分ける",
							correct: true,
							explanation:
								"useState は箱を用意するだけで、ほとんど何もしません。使わない回があっても問題ありません。",
						},
						{
							label: "if の中で呼んで、必要なときだけ用意する",
							explanation:
								"回によってフックの数が変わり、React が前回と照らし合わせられなくなります。",
						},
						{
							label: "useState を使わず、ふつうの変数にする",
							explanation:
								"ふつうの変数では画面が更新されません。Part 4 の最初でやったとおりです。",
						},
					]}
				/>

				<Quiz
					question="自分で作る関数の名前を use で始めるのはなぜ？"
					options={[
						{
							label: "lint がフックだと見なして、決まりを見張ってくれるから",
							correct: true,
							explanation:
								"getWindowWidth のような名前だと、ただの関数だと思われて検査されません。名前を守ると、見張りが付いてきます。",
						},
						{
							label: "React がその名前を探して呼び出すから",
							explanation:
								"React は名前で探したりしません。呼ぶのはあなたのコードです。",
						},
						{
							label: "そう書かないと動かないから",
							explanation:
								"動きはします。ですが間違いを教えてもらえなくなります。",
						},
					]}
				/>
			</LessonSection>

			<LessonSection id="summary" {...at(FIXED, "const [nickname, setNickname]")}>
				<h2>この章のまとめ</h2>

				<ul>
					<li>
						フックは<strong>関数のいちばん上で、無条件に呼ぶ</strong>
					</li>
					<li>
						呼ぶのは<strong>コンポーネントか、他のフックの中だけ</strong>
					</li>
					<li>
						React が見ているのは<strong>変数名ではなく、呼ばれた順番</strong>
					</li>
					<li>
						出し分けたいときは、
						<strong>呼ぶかどうかではなく、表示するかどうかを分ける</strong>
					</li>
					<li>
						<code>use</code> で始まる名前にすると、
						<strong>lint が見張ってくれる</strong>
					</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
