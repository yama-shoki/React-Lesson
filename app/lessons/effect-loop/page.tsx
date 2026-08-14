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
import { FixedLoop } from "./demos/fixed-loop";
import { Loop } from "./demos/loop";
import { ObjectLoop } from "./demos/object-loop";
import { LoopCycleFigure } from "./figures/loop-cycle";

const SLUG = "effect-loop";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{ path: "lessons/effect-loop/demos/loop.tsx", label: "loop.tsx" },
	{ path: "lessons/effect-loop/demos/object-loop.tsx", label: "object-loop.tsx" },
	{ path: "lessons/effect-loop/demos/fixed-loop.tsx", label: "fixed-loop.tsx" },
] as const;

const [LOOP, OBJECT, FIXED] = SOURCES.map((source) => source.path);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					<code>useEffect</code> を書いていて、
					<strong>ブラウザが固まった</strong>経験はありませんか。
					初めて書く人がほぼ必ず一度は踏みます。
				</p>
				<p>
					原因は決まっています。
					<strong>依存配列に入れた値を、その effect の中で更新している</strong>。
					これだけです。
				</p>
				<p>
					仕組みが分かれば、書く前に気づけるようになります。
				</p>
			</LessonHeader>

			<LessonSection id="loop" {...at(LOOP, "setCount(count + 1)")}>
				<h2>止まらなくなる書き方</h2>

				<p>
					「動かしてみる」を押すと、count が一気に増えます。
					押しっぱなしにしているわけでも、繰り返し押しているわけでもありません。
				</p>

				<DemoCard
					title="依存配列の値を、その中で更新する"
					tone="bad"
					sourcePath={LOOP}
					showRenderCount
					description="一度押しただけで、50 まで駆け上がる"
				>
					<Loop />
				</DemoCard>

				<p>
					render の数字を見てください。
					<strong>一度の操作で何十回も描き直されています</strong>。
				</p>

				<Callout variant="warn" title="このデモには安全装置が入っています">
					<p>
						本物の無限ループはブラウザが固まって操作できなくなるので、
						<code>count</code> が 50 を超えたら止まるようにしてあります。
						<strong>この 1 行がなければ、止める手段がありません。</strong>
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="why" {...at(LOOP, "}, [count, running])")}>
				<h2>なぜ止まらないのか</h2>

				<p>
					<code>useEffect</code> は、
					<strong>依存配列の値が変わったときに実行される</strong>のでした。
					そして、その中で <code>setCount</code> を呼んでいます。
				</p>

				<LoopCycleFigure />

				<p>
					<code>count</code> を更新すると、コンポーネントが描き直されます。
					描き直されると <code>count</code> は新しい値になっています。
					依存配列の値が変わったので、React はまた effect を実行します。
					そしてまた <code>count</code> を更新する。
				</p>

				<p>
					<strong>自分の実行が、自分の次の実行を呼んでいます。</strong>
					どこにも終わりがありません。
				</p>

				<Callout variant="point" title="見分けかた">
					<p>
						<strong>
							依存配列に書いた値を、その effect の中で更新していないか。
						</strong>
					</p>
					<p>
						書いた直後にこれだけ確認すれば、ほとんどのループは防げます。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="object" {...at(OBJECT, "const options = {")}>
				<h2>入れた覚えがないのにループする</h2>

				<p>
					こちらは <code>count</code> を依存配列に入れていません。
					それでも止まりません。
				</p>

				<DemoCard
					title="オブジェクトを依存配列に入れる"
					tone="bad"
					sourcePath={OBJECT}
					showRenderCount
					description="count は依存配列に入っていないのに、やはり駆け上がる"
				>
					<ObjectLoop />
				</DemoCard>

				<p>
					犯人は <code>options</code> です。
				</p>

				<StaticCode
					lang="ts"
					code={`const options = { unit: "回" };`}
				/>

				<p>
					この行は<strong>描き直されるたびに実行されます</strong>。
					つまり毎回<strong>新しいオブジェクトが作られています</strong>。
					中身は同じでも、React から見れば別のものです。
				</p>

				<p>
					Part 4 の「オブジェクトと配列の更新」 でやった
					<strong>「React は同じものかどうかだけを見る」</strong>
					が、ここでも効いてきます。
					毎回別のものが渡ってくるので、React は毎回「依存が変わった」と判断します。
				</p>

				<Callout variant="warn" title="関数も配列も同じ">
					<p>
						オブジェクトだけの話ではありません。
						コンポーネントの中で作った<strong>関数</strong>も
						<strong>配列</strong>も、描き直されるたびに新しく作られます。
					</p>
					<StaticCode
						lang="ts"
						code={`const handleSave = () => { ... };   // 毎回新しい関数
const options = { unit: "回" };     // 毎回新しいオブジェクト
const items = [1, 2, 3];            // 毎回新しい配列`}
					/>
					<p>
						これらを依存配列に入れると、
						<strong>中身が変わっていなくても毎回実行されます</strong>。
					</p>
				</Callout>

				<Callout variant="note" title="実は道具が教えてくれます">
					<p>
						右のコードを書くと、エディタがこう警告します。
					</p>
					<StaticCode
						lang="bash"
						code={`The 'options' object makes the dependencies of useEffect Hook
(at line 30) change on every render. To fix this, wrap the
initialization of 'options' in its own useMemo() Hook`}
					/>
					<p>
						「<code>options</code> のせいで、毎回依存が変わっている」と、
						<strong>原因そのものを名指ししてくれます</strong>。
						しかも直し方（<code>useMemo</code> で包む）まで添えてあります。
						これは Part 8 で扱います。
						この警告が出たら、まずこの章のことを思い出してください。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="fixed" {...at(FIXED, "}, [running])")}>
				<h2>直し方</h2>

				<p>
					直す方向は 3 つあります。
					<strong>上から順に検討してください。</strong>
				</p>

				<h3>1. そもそも effect が要らないのでは、と疑う</h3>

				<p>
					前の章でやったとおりです。
					<strong>計算できる値なら、effect も state も要りません。</strong>
					ループの多くは、この見直しだけで消えます。
				</p>

				<h3>2. 依存を減らす</h3>

				<p>
					いまの値をもとに更新するなら、
					<strong>関数を渡す形</strong>にします。そうすれば、
					その値を依存配列に入れる必要がなくなります。
				</p>

				<Callout variant="note" title="このあとのデモについて">
					<p>
						すぐ下の「直した例」は、
						<strong>上の暴走する例を 1 行だけ直したものではありません</strong>。
						タイマーを使った別の作りにしてあります
						（1 秒に 1 回だけ光るので、止まっていることが目で分かるため）。
					</p>
					<p>
						いま読んでいる 1 行の書き換えは、
						<strong>それだけで暴走が止まります</strong>。
						デモの違いと混ぜないでください。
					</p>
				</Callout>

				<StaticCode
					lang="ts"
					code={`// ✕ count を使うので、依存配列に入れざるを得ない
setCount(count + 1);

// ○ 最新の値は React が渡してくれる。count は依存に不要
setCount((current) => current + 1);`}
				/>

				<DemoCard
					title="依存を減らして書き直す"
					tone="good"
					sourcePath={FIXED}
					showRenderCount
					description="一定の間隔で増え、止めれば止まる"
				>
					<FixedLoop />
				</DemoCard>

				<p>
					依存配列は <code>[running]</code> だけになりました。
					<strong>タイマーを仕掛けるのは 1 回きり</strong>で、
					あとはタイマー自身が数を増やしています。
					effect が自分を呼び直すことはありません。
				</p>

				<h3>3. 値そのものを安定させる</h3>

				<p>
					どうしてもオブジェクトや関数を依存配列に入れたいなら、
					<strong>毎回作り直されないようにします</strong>。
				</p>

				<StaticCode
					lang="ts"
					code={`// コンポーネントの外に出す（いちばん単純）
const options = { unit: "回" };

function Counter() { ... }`}
				/>

				<p>
					外に出せない場合は、<code>useMemo</code> や{" "}
					<code>useCallback</code> という道具で、
					<strong>同じものを使い回す</strong>ようにします。
					Part 8 で扱います。
				</p>

				<Callout variant="point" title="いま覚えておくこと">
					<p>
						道具の名前はまだ覚えなくて大丈夫です。
						<strong>「オブジェクトや関数は、書き直されるたびに
						新しく作られる」</strong>——これだけ持って先へ進んでください。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="quiz" {...at(LOOP, "setCount(count + 1)")}>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="useEffect が無限ループになる、いちばん多い原因は？"
					options={[
						{
							label: "依存配列に入れた値を、その effect の中で更新している",
							correct: true,
							explanation:
								"更新 → 描き直し → 依存が変わる → 実行、が輪になります。自分の実行が自分の次の実行を呼んでいる状態です。",
						},
						{
							label: "依存配列を空にしている",
							explanation:
								"空の場合は最初の 1 回しか実行されないので、ループにはなりません。",
						},
						{
							label: "タイマーを止める処理を書いていない",
							explanation:
								"後片付けの不足は別の問題（動き続けるものが溜まる）を起こしますが、ループの原因ではありません。",
						},
					]}
				/>

				<Quiz
					question="count を依存配列に入れていないのにループする。考えられる原因は？"
					options={[
						{
							label: "オブジェクトや関数を依存配列に入れていて、それが毎回新しく作られている",
							correct: true,
							explanation:
								"中身が同じでも、React は「別のもの」と判断します。毎回依存が変わったことになり、毎回実行されます。",
						},
						{
							label: "React のバグ",
							explanation:
								"仕様どおりの動きです。React は中身ではなく「同じものかどうか」を見ます。",
						},
						{
							label: "依存配列の書き方が間違っている",
							explanation:
								"書き方は正しくても起きます。問題は書き方ではなく、渡している値が毎回作り直されていることです。",
						},
					]}
				/>

				<Quiz
					question="setCount(count + 1) を setCount((c) => c + 1) に変える利点は？"
					options={[
						{
							label: "count を依存配列に入れなくて済む",
							correct: true,
							explanation:
								"最新の値は React が渡してくれるので、自分で count を読む必要がありません。依存が減れば、ループの輪も切れます。",
						},
						{
							label: "更新が速くなる",
							explanation:
								"速度は変わりません。変わるのは「どの値に依存するか」です。",
						},
						{
							label: "effect の外でも使えるようになる",
							explanation:
								"どちらの書き方も effect の外で使えます。違いは依存の有無です。",
						},
					]}
				/>
			</LessonSection>

			<LessonSection id="summary" {...at(FIXED, "}, [running])")}>
				<h2>この章のまとめ</h2>

				<ul>
					<li>
						<strong>依存配列に入れた値を、その中で更新すると止まらなくなる</strong>
					</li>
					<li>
						オブジェクト・配列・関数は<strong>描き直しのたびに新しく作られる</strong>。
						依存配列に入れると、中身が同じでも毎回実行される
					</li>
					<li>直す順番は、①effect が要るか疑う ②依存を減らす ③値を安定させる</li>
					<li>
						いまの値を使うなら <code>setCount((c) =&gt; c + 1)</code>。
						これだけで依存が 1 つ減る
					</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
