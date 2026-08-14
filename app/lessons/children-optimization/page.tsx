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
import { Flat } from "./demos/flat";
import { Split } from "./demos/split";
import { ChildrenBoundaryFigure } from "./figures/children-boundary";

const SLUG = "children-optimization";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{ path: "lessons/children-optimization/demos/flat.tsx", label: "flat.tsx" },
	{ path: "lessons/children-optimization/demos/split.tsx", label: "split.tsx" },
] as const;

const [FLAT, SPLIT] = SOURCES.map((source) => source.path);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					前の章で <code>memo</code> をやりました。
					ですが、<strong>memo を使わずに描き直しを止める方法</strong>があります。
				</p>
				<p>
					しかも新しい道具は要りません。使うのは
					Part 2 でやった <code>children</code> です。
				</p>
				<p>
					知っている人と知らない人で、書くコードがはっきり変わる話です。
				</p>
			</LessonHeader>

			<LessonSection id="flat" {...at(FLAT, "<Heavy />")}>
				<h2>まず、ふつうに書いた場合</h2>

				<p>
					state を持つコンポーネントの中に、重い子を置きます。
					いちばん自然な書き方です。
				</p>

				<DemoCard
					title="子を中に直接書く"
					sourcePath={FLAT}
					showRenderCount
					description="count を押すと、子も一緒に光る"
				>
					<Flat />
				</DemoCard>

				<p>
					<code>count</code> しか変えていないのに、
					<strong>子も毎回描き直されています</strong>。
					Part 7 でやったとおり、親が描き直されれば子も描き直されるからです。
				</p>
			</LessonSection>

			<LessonSection id="split" {...at(SPLIT, "{children}")}>
				<h2>子を外で作って、渡す</h2>

				<p>
					同じものを、<strong>子を外側で作ってから渡す</strong>形に書き換えます。
					子の中身には手を触れません（表示する文言だけ、どちらの形か分かるように変えてあります）。
				</p>

				<StaticCode
					code={`// 変更前：子を中で作る
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <Button onClick={...}>{count}</Button>
      <Heavy />
    </div>
  );
}

// 変更後：子を受け取って置くだけ
function Counter({ children }) {
  const [count, setCount] = useState(0);
  return (
    <div>
      <Button onClick={...}>{count}</Button>
      {children}
    </div>
  );
}`}
				/>

				<DemoCard
					title="children として受け取る"
					tone="good"
					sourcePath={SPLIT}
					showRenderCount
					description="count を押しても、子は光らない"
				>
					<Split />
				</DemoCard>

				<p>
					<strong>子が光らなくなりました。</strong>
					<code>memo</code> は使っていません。
					子の中身も変えていません。
				</p>
			</LessonSection>

			<LessonSection id="why" {...at(SPLIT, "export function Split()")}>
				<h2>なぜ止まるのか</h2>

				<p>
					鍵は<strong>「その &lt;Heavy /&gt; が、どの関数の中に書いてあるか」</strong>です。
				</p>

				<ChildrenBoundaryFigure />

				<p>
					<code>&lt;Heavy /&gt;</code> という JSX は、
					Part 1 でやったとおり<strong>ただの値</strong>です。
					ここまではいいとして、
					<strong>その値がいつ作られるのか</strong>が問題になります。
				</p>

				<p>
					関数の中に書いた行は、
					<strong>その関数が呼ばれるたびに、上から順に実行されます</strong>。
					Part 6 で見た <code>const options = {"{ ... }"}</code> が
					毎回新しいオブジェクトになったのと、まったく同じことです。
				</p>

				<p>
					つまり <code>&lt;Heavy /&gt;</code> も、
					<strong>
						Counter の中に書いてあれば、Counter が動くたびに作り直されます
					</strong>
					。外に書いてあれば、作り直されません。
				</p>

				<ul>
					<li>
						中に直接書いた場合、<code>&lt;Heavy /&gt;</code> は
						<strong>Counter の中</strong>にある。
						Counter が実行されるたびに、新しく作り直される
					</li>
					<li>
						children として渡した場合、<code>&lt;Heavy /&gt;</code> は
						<strong>Counter の外</strong>にある。
						Counter がいくら実行されても、そこは実行されない
					</li>
				</ul>

				<p>
					Counter が描き直されるとき、React が受け取る{" "}
					<code>children</code> は<strong>前回とまったく同じもの</strong>です。
				</p>

				<Callout variant="warn" title="Part 7 で習ったことと矛盾していませんか">
					<p>
						Part 7 では
						<strong>「props が同じでも、親が描き直されれば子も実行される」</strong>
						と書きました。ここではその逆のことが起きています。
						引っかかって当然です。
					</p>
					<p>
						じつは React には、
						<strong>止まり方が 2 種類</strong>あります。
					</p>
					<ol>
						<li>
							<strong>指示書そのものが前回と同じとき</strong> …{" "}
							中を見るまでもないので、
							<strong>その枝ごと処理を打ち切ります</strong>。
							いま起きているのはこちら
						</li>
						<li>
							<strong>指示書は新しいが、props が同じとき</strong> …{" "}
							これは<strong>見比べないと分かりません</strong>。
							だから既定では止まらず、
							<code>memo</code> で「見比べてくれ」と頼む
						</li>
					</ol>
					<p>
						Part 7 で言っていたのは 2 のほうです。
						<code>children</code> として渡すと
						<strong>そもそも指示書が作り直されない</strong>ので、
						1 の打ち切りが効きます。
						<strong>道具を使わずに済むのは、このためです。</strong>
					</p>
				</Callout>

</LessonSection>

			<LessonSection id="usage" {...at(SPLIT, "function Counter({ children }")}>
				<h2>どういうときに効くか</h2>

				<p>
					Part 7 で <strong>state を使う場所まで下ろした</strong>のと同じ発想です。
					違うのは、<strong>重い表示を入力と同じ階層から動かせない</strong>ときにも
					使えることです。
				</p>

				<p>
					この形が効くのは、
					<strong>状態が頻繁に変わる場所と、重い表示が同じ階層にいるとき</strong>です。
				</p>

				<StaticCode
					code={`// 入力のたびに全部が描き直される
function Page() {
  const [keyword, setKeyword] = useState("");
  return (
    <div>
      <input value={keyword} onChange={...} />
      <HeavyChart />   {/* 打つたびに描き直される */}
    </div>
  );
}`}
				/>

				<p>
					検索欄に文字を打つたび、関係のないグラフまで描き直されます。
					ここで「入力を持つ部分」を切り出し、
					グラフを <code>children</code> として渡せば、巻き込まれなくなります。
				</p>

				<StaticCode
					code={`function Page() {
  return (
    <SearchBox>
      <HeavyChart />   {/* SearchBox の外で作られる */}
    </SearchBox>
  );
}`}
				/>

				<Callout variant="note" title="memo とどちらを使うか">
					<p>
						どちらでも解決できる場面では、
						<strong>この方法のほうが素直</strong>です。
						新しい道具を持ち出さず、
						<strong>state を持つ範囲を狭くしただけ</strong>だからです。
					</p>
					<p>
						一方、リストの各行のように
						<strong>同じ形の子がたくさん並ぶ</strong>場合は{" "}
						<code>memo</code> の出番です。使い分けの目安になります。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="quiz" {...at(SPLIT, "{children}")}>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="children として渡した子が描き直されないのはなぜ？"
					options={[
						{
							label: "その JSX は親の外で作られていて、親が実行されても作り直されないから",
							correct: true,
							explanation:
								"JSX は書かれた場所で作られる値です。親の外にあれば、親が何度実行されてもそこは実行されません。前回と同じものが渡るので、描き直す必要がありません。",
						},
						{
							label: "React が children を特別扱いしているから",
							explanation:
								"特別扱いはありません。children もただの props で、判定も他と同じ「同じものかどうか」です。",
						},
						{
							label: "children には自動で memo がかかるから",
							explanation:
								"memo はかかりません。そもそも作り直されていないので、比較するまでもなくスキップされます。",
						},
					]}
				/>

				<Quiz
					question="この方法と memo、どちらを先に検討する？"
					options={[
						{
							label: "children で切り離すほう。新しい道具を持ち出さずに済む",
							correct: true,
							explanation:
								"state を持つ範囲を狭くしているだけなので、構造として素直です。同じ形の子が大量に並ぶ場合は memo が向きます。",
						},
						{
							label: "memo。どんな場合でも確実に効く",
							explanation:
								"props にオブジェクトや関数を渡していると効きません。確実ではありません。",
						},
						{
							label: "どちらも同じなので好みで選ぶ",
							explanation:
								"効く場面が違います。切り離しは階層をまたぐ巻き込みに、memo は同じ形の子が並ぶ場合に向きます。",
						},
					]}
				/>
			</LessonSection>

			<LessonSection id="summary" {...at(SPLIT, "{children}")}>
				<h2>この章のまとめ</h2>

				<ul>
					<li>
						JSX は<strong>書かれた場所で作られる値</strong>
					</li>
					<li>
						<code>children</code> として渡した子は<strong>親の外で作られる</strong>ので、
						親が描き直されても巻き込まれない
					</li>
					<li>
						<code>memo</code> を使わず、
						<strong>state を持つ範囲を狭くするだけ</strong>で描き直しが減る
					</li>
					<li>
						判定はいつも<strong>「同じものかどうか」</strong>。
						state 更新も memo もこの章も、すべて同じ仕組み
					</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
