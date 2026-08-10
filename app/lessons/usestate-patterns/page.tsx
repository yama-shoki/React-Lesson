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
import { BooleanSoup } from "./demos/boolean-soup";
import { LazyInit } from "./demos/lazy-init";
import { ResetByKey } from "./demos/reset-by-key";
import { Selection } from "./demos/selection";
import { StatusUnion } from "./demos/status-union";
import { Toggle } from "./demos/toggle";

const SLUG = "usestate-patterns";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{ path: "lessons/usestate-patterns/demos/toggle.tsx", label: "toggle.tsx" },
	{
		path: "lessons/usestate-patterns/demos/selection.tsx",
		label: "selection.tsx",
	},
	{
		path: "lessons/usestate-patterns/demos/boolean-soup.tsx",
		label: "boolean-soup.tsx",
	},
	{
		path: "lessons/usestate-patterns/demos/status-union.tsx",
		label: "status-union.tsx",
	},
	{
		path: "lessons/usestate-patterns/demos/lazy-init.tsx",
		label: "lazy-init.tsx",
	},
	{
		path: "lessons/usestate-patterns/demos/reset-by-key.tsx",
		label: "reset-by-key.tsx",
	},
] as const;

const [TOGGLE, SELECTION, SOUP, UNION, LAZY, RESET] = SOURCES.map(
	(source) => source.path,
);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					前の章で <code>useState</code> の形は分かりました。
					ですが「数を数える」以外に何ができるのか、
					まだ想像しにくいと思います。
				</p>
				<p>
					実際のアプリで <code>useState</code> がどう使われているかを、
					<strong>よく出てくる順に 6 つ</strong>並べます。
				</p>
				<p>
					前半 4 つは<strong>今日から使うもの</strong>。
					後半 2 つは<strong>「そういう手があるのか」と知っておくと効くもの</strong>です。
				</p>
			</LessonHeader>

			<LessonSection id="toggle" {...at(TOGGLE, "const [isOpen, setIsOpen]")}>
				<h2>1. 切り替える（いちばん多い）</h2>

				<p>
					開いている / 閉じている、表示 / 非表示、オン / オフ。
					<strong>2 択のものは <code>useState</code> の出番の 8 割</strong>です。
				</p>

				<StaticCode
					lang="ts"
					code={`const [isOpen, setIsOpen] = useState(false);`}
				/>

				<p>
					切り替えるときは、<strong>いまの反対を入れます</strong>。
				</p>

				<StaticCode lang="ts" code={`setIsOpen(!isOpen);`} />

				<DemoCard
					title="開閉を切り替える"
					sourcePath={TOGGLE}
					showRenderCount
					description="押すたびに中身が出たり消えたりする"
				>
					<Toggle />
				</DemoCard>

				<p>
					Part 3 でやった <code>&amp;&amp;</code> と組み合わせるのが定番の形です。
					<strong>「true のときだけ出す」</strong>と読めます。
				</p>

				<StaticCode code={`{isOpen && <p>中身</p>}`} />

				<Callout variant="note" title="名前は is / has で始める">
					<p>
						<code>isOpen</code>、<code>isLoading</code>、
						<code>hasError</code>。
					</p>
					<p>
						こう書いておくと、<code>if (isOpen)</code> が
						<strong>英語の文として読めます</strong>。
						<code>open</code> だと「開く（動詞）」とも読めて紛らわしくなります。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection
				id="selection"
				{...at(SELECTION, "const [selected, setSelected]")}
			>
				<h2>2. どれが選ばれているかを覚える</h2>

				<p>
					タブ、プラン選択、一覧から 1 件選ぶ。
					<strong>「いま選ばれているもの」を 1 つだけ持ちます</strong>。
				</p>

				<StaticCode
					lang="ts"
					code={`const [selected, setSelected] = useState<string | null>(null);`}
				/>

				<p>
					ここで大事なのが <code>null</code> です。
					<strong>「まだ選んでいない」も、立派な状態のひとつ</strong>だからです。
					空文字 <code>&quot;&quot;</code> で代用すると、
					「選んでいない」のか「空という名前を選んだ」のか区別できなくなります。
				</p>

				<DemoCard
					title="選択中の項目を持つ"
					sourcePath={SELECTION}
					showRenderCount
					description="押すと色が変わり、下の文が変わる"
				>
					<Selection />
				</DemoCard>

				<Callout variant="point" title="選ばれているかどうかは、持たない">
					<p>ボタンごとに「選ばれているか」を持ちたくなります。</p>
					<StaticCode
						lang="ts"
						code={`// ✕ ボタンの数だけ state が要る。しかも 2 つ同時に true にできてしまう
const [isTrialSelected, setIsTrialSelected] = useState(false);
const [isStandardSelected, setIsStandardSelected] = useState(false);

// ◯ 選ばれているものを 1 つだけ持ち、あとは比べて求める
const isSelected = selected === plan;`}
					/>
					<p>
						この Part の後半、「state は最小限にする」で扱う考え方です。
						<strong>比べて分かることは、持ちません。</strong>
					</p>
				</Callout>
			</LessonSection>

			<LessonSection
				id="soup"
				{...at(SOUP, "const [isLoading, setIsLoading]", "const [isError, setIsError]")}
			>
				<h2>3. 「途中の状態」を持つ</h2>

				<p>
					送信中、読み込み中、失敗した。
					<strong>時間のかかる処理には、必ず途中があります</strong>。
				</p>

				<p>素直に書くと、真偽値を並べたくなります。</p>

				<StaticCode
					lang="ts"
					code={`const [isLoading, setIsLoading] = useState(false);
const [isDone, setIsDone] = useState(false);
const [isError, setIsError] = useState(false);`}
				/>

				<p>
					動きます。ですが<strong>穴があります</strong>。
					デモの「壊す」ボタンを押してみてください。
				</p>

				<DemoCard
					title="真偽値を 3 つ並べる"
					tone="bad"
					sourcePath={SOUP}
					showRenderCount
					description="「壊す」を押すと、ありえない表示になる"
				>
					<BooleanSoup />
				</DemoCard>

				<p>
					<strong>「送信中」と「送信しました」と「失敗しました」が同時に出ました。</strong>
					現実にはありえない状態です。
				</p>

				<p>
					真偽値が 3 つあると、組み合わせは <strong>2 × 2 × 2 = 8 通り</strong>。
					そのうち<strong>意味があるのは 4 通りだけ</strong>です。
					残りの 4 通りは、書けてしまうけれど存在してはいけない状態です。
				</p>

				<Callout variant="warn" title="バグはここから生まれる">
					<p>
						「壊す」ボタンのような書き方を、わざとする人はいません。
					</p>
					<p>
						ですが<strong>エラー処理を足したとき</strong>、
						<code>setIsLoading(false)</code> を書き忘れる。それだけで
						「送信中のまま、失敗しましたと出ている」画面ができあがります。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="union" {...at(UNION, "type Status =")}>
				<h2>4. とりうる状態を、並べて書く</h2>

				<p>
					解決は簡単です。
					<strong>state を 1 つにして、とりうる値を並べます。</strong>
				</p>

				<StaticCode
					lang="ts"
					code={`type Status = "idle" | "sending" | "done" | "error";

const [status, setStatus] = useState<Status>("idle");`}
				/>

				<p>
					縦棒（<code>|</code>）は「または」です。Part 0 の TypeScript で出てきました。
					<strong>この 4 つ以外にはなれません。</strong>
					<code>setStatus(&quot;おわり&quot;)</code> と書けば、その場で赤線が出ます。
				</p>

				<DemoCard
					title="状態を 1 つにまとめる"
					tone="good"
					sourcePath={UNION}
					showRenderCount
					description="「壊す」ボタンが作れない"
				>
					<StatusUnion />
				</DemoCard>

				<p>
					<strong>今度は「壊す」ボタンを置けませんでした。</strong>
					<code>status</code> は必ず 1 つの値しか持てないので、
					3 つ同時に true という状態が<strong>作れないからです</strong>。
				</p>

				<StaticCode
					lang="ts"
					code={`setStatus("sending");   // これだけで、他は自動的に否定される`}
				/>

				<p>
					リセットの書き忘れも起きません。
					<strong>次の状態を入れれば、前の状態は必ず消えます。</strong>
				</p>

				<Callout variant="point" title="ありえない状態を、作れなくする">
					<p>
						これはプログラミング全般で強力な考え方です。
						<strong>気をつけて防ぐのではなく、書けなくする。</strong>
					</p>
					<p>
						真偽値が 2 つ以上並びはじめたら、
						<strong>それは 1 つの union にできないか</strong>を疑ってください。
					</p>
					<p>
						Part 9 で使う SWR も、まさにこの形で状態を返してきます。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="lazy" {...at(LAZY, "const [code] = useState(buildInitialCode);")}>
				<h2>5. 初期値の計算が重いとき</h2>

				<p>ここから応用です。まず、よくある落とし穴から。</p>

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
					関数の引数は、渡す前に評価されるからです。
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
				<h2>6. state をまるごとリセットする</h2>

				<p>
					最後は、知らないとまず思いつかない手です。
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

			<LessonSection id="quiz" {...at(UNION, "type Status =")}>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="「まだ選んでいない」を表すのに適しているのは？"
					options={[
						{
							label: 'useState<string | null>(null)',
							correct: true,
							explanation:
								"「選んでいない」を空文字で代用すると、「空という名前を選んだ」状態と区別できなくなります。",
						},
						{
							label: 'useState("")',
							explanation:
								"動きはしますが、空文字が正当な選択肢になったときに破綻します。",
						},
						{
							label: "選択肢ごとに useState(false) を用意する",
							explanation:
								"2 つ同時に true にできてしまいます。選ばれているかどうかは比べて求めます。",
						},
					]}
				/>

				<Quiz
					question="真偽値を 3 つ並べる代わりに union を使うと、何が良くなる？"
					options={[
						{
							label: "ありえない組み合わせが、そもそも書けなくなる",
							correct: true,
							explanation:
								"気をつけて防ぐのではなく、書けなくします。前の状態を消し忘れることもなくなります。",
						},
						{
							label: "再レンダリングの回数が減る",
							explanation:
								"回数は変わりません。state の数が減っても、更新のたびに描き直されます。",
						},
						{
							label: "コードが短くなる",
							explanation:
								"短くはなりますが、それは結果です。目的は不正な状態を作れなくすることです。",
						},
					]}
				/>

				<Quiz
					question="useState(buildValue()) と useState(buildValue) の違いは？"
					options={[
						{
							label: "前者は毎回呼ばれ、後者は最初の 1 回だけ呼ばれる",
							correct: true,
							explanation:
								"括弧を付けると、渡す前に呼ばれてしまいます。関数そのものを渡せば、React が必要なときだけ呼びます。",
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

			<LessonSection id="summary" {...at(TOGGLE, "const [isOpen, setIsOpen]")}>
				<h2>この章のまとめ</h2>

				<ul>
					<li>
						<strong>切り替え</strong>（<code>!isOpen</code>）が
						いちばんよく使う形。名前は <code>is</code> / <code>has</code> で始める
					</li>
					<li>
						<strong>選択中のもの</strong>は 1 つだけ持ち、
						「選ばれているか」は比べて求める。
						「未選択」は <code>null</code>
					</li>
					<li>
						真偽値が並びはじめたら
						<strong>union にまとめる</strong>。
						ありえない状態を書けなくする
					</li>
					<li>
						初期値の計算が重いなら<strong>括弧を外す</strong>
						（<code>useState(build)</code>）
					</li>
					<li>
						<strong><code>key</code> を変える</strong>と、
						中の state がまるごと消える
					</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
