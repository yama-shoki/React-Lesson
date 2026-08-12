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
import { MemoBroken } from "./demos/memo-broken";
import { MemoDemo } from "./demos/memo-demo";

const SLUG = "memo";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{ path: "lessons/memo/demos/memo-demo.tsx", label: "memo-demo.tsx" },
	{ path: "lessons/memo/demos/memo-broken.tsx", label: "memo-broken.tsx" },
] as const;

const [DEMO, BROKEN] = SOURCES.map((source) => source.path);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					Part 7 で、<strong>親が描き直されると子も描き直される</strong>
					ことを見ました。props が変わっていなくても、です。
				</p>
				<p>
					たいていはそれで問題ありません。ですが、
					子の中身が重かったり、数が多かったりすると効いてきます。
				</p>
				<p>
					そこで登場するのが <code>memo</code> です。
					<strong>props が変わっていない子をスキップする</strong>ための道具です。
				</p>
			</LessonHeader>

			<LessonSection id="basic" {...at(DEMO, "const Memoized = memo(")}>
				<h2>包むだけで、描き直しが止まる</h2>

				<p>
					下のデモには子が 2 つあります。
					<strong>中身はまったく同じで、片方だけ <code>memo</code> で包んであります。</strong>
				</p>

				<StaticCode
					code={`// 包んでいない
function Plain({ name }) { ... }

// 包んだだけ。中身は同じ
const Memoized = memo(function Memoized({ name }) { ... });`}
				/>

				<p>
					「count を増やす」を押してください。
					<code>name</code> は変わらないので、子の表示も変わりません。
				</p>

				<DemoCard
					title="memo あり / なしを並べる"
					sourcePath={DEMO}
					showRenderCount
					description="count を押したときの、2 つの子の違いを見る"
				>
					<MemoDemo />
				</DemoCard>

				<p>
					<strong>memo なしの子だけが光り、回数が増えていきます。</strong>
					memo ありの子は静かなままです。
				</p>

				<p>
					「name を変える」を押すと、今度は両方が光ります。
					props が実際に変わったので、memo でもスキップできません。
				</p>

				<Callout variant="point" title="memo がやっていること">
					<p>
						親が描き直されたとき、<strong>前回と今回の props を見比べて</strong>、
						変わっていなければ描き直しをスキップする。それだけです。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="broken" {...at(BROKEN, "const user = {")}>
				<h2>包んだのに効かない</h2>

				<p>
					ここからが本題です。<code>memo</code> は、
					<strong>包めば必ず効くわけではありません</strong>。
				</p>

				<p>
					下のデモも <code>memo</code> で包んであります。
					<code>user</code> の中身も変わりません。それでも押してみてください。
				</p>

				<DemoCard
					title="memo が効かない例"
					tone="bad"
					sourcePath={BROKEN}
					showRenderCount
					description="包んであるのに、押すたびに光る"
				>
					<MemoBroken />
				</DemoCard>

				<p>
					光ります。原因はこの 1 行です。
				</p>

				<StaticCode lang="ts" code={`const user = { name: "さとう" };`} />

				<p>
					Part 6「無限ループにしない」で見たとおり、この行は
					<strong>描き直されるたびに実行され、毎回新しいオブジェクトを作ります</strong>。
					中身は同じでも、React にとっては別のものです。
				</p>

				<p>
					<code>memo</code> は props を見比べるとき、
					<strong>「同じものかどうか」だけを見ます</strong>。
					Part 4 の「オブジェクトと配列の更新」 の話と、まったく同じ判定です。
					毎回別のものが渡ってくるので、
					<strong>「props が変わった」と判断されます</strong>。
				</p>

				<Callout variant="warn" title="memo が効かなくなる props">
					<p>
						毎回新しく作られるもの、つまり
						<strong>オブジェクト・配列・関数</strong>を props で渡すと、
						memo は効きません。
					</p>
					<StaticCode
						code={`<Child user={{ name: "さとう" }} />   // 毎回新しいオブジェクト
<Child items={[1, 2, 3]} />          // 毎回新しい配列
<Child onSave={() => save()} />      // 毎回新しい関数`}
					/>
					<p>
						とくに<strong>関数を渡す場合</strong>が圧倒的に多く、
						「memo したのに効かない」の原因はほぼこれです。
						その対処は <code>useCallback</code> の章で扱います。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="when" {...at(DEMO, "const Memoized = memo(")}>
				<h2>いつ使うか</h2>

				<p>
					ここまで読むと、全部 <code>memo</code>{" "}
					で包みたくなるかもしれません。<strong>やめてください。</strong>
				</p>

				<p>
					<code>memo</code> はタダではありません。
					props を見比べる処理そのものにコストがかかります。
					<strong>軽い子を包むと、比較のぶんだけ遅くなります。</strong>
				</p>

				<p>そして読みにくくなります。</p>

				<Callout variant="point" title="使う順番">
					<ol>
						<li>まず<strong>そのまま書く</strong></li>
						<li>実際に遅いと感じる、または計測して遅いと分かる</li>
						<li>
							どこが重いのかを特定する（React DevTools の Profiler）
						</li>
						<li>そこではじめて <code>memo</code> を検討する</li>
					</ol>
				</Callout>

				<p>
					まだ遅くもないのに包むと、
					<strong>読みにくさは必ず増えて、速さは増えるか分かりません</strong>。
					割に合いません。
				</p>

				<p>
					それに、次の章でやる方法を使えば、
					<strong><code>memo</code> を使わずに描き直しを減らせる</strong>場合があります。
				</p>
			</LessonSection>

			<LessonSection id="term" {...at(DEMO, "const Memoized = memo(")}>
				<h3>この手のやり方を「メモ化」と呼びます</h3>

				<p>
					<code>memo</code>、そしてこの Part でこのあと出てくる{" "}
					<code>useMemo</code> と <code>useCallback</code>。
					やっていることは共通しています。
				</p>

				<p>
					<strong>前の結果をとっておいて、使い回す。</strong>
					これをまとめて<strong>メモ化</strong>と呼びます。
					（メモを取っておく、の「メモ」です）
				</p>

				<p>
					記事や求人票でこの言葉を見かけたら、この 3 つのことだと思ってください。
				</p>
			</LessonSection>

			<LessonSection id="quiz" {...at(BROKEN, "const user = {")}>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="memo で正しく包んだのに、子が描き直される。原因は？"
					options={[
						{
							label: "オブジェクトや関数を props で渡していて、それが毎回新しく作られている",
							correct: true,
							explanation:
								"memo は「同じものかどうか」で props を見比べます。中身が同じでも、毎回作り直されていれば別のものと判断されます。",
						},
						{
							label: "memo の書き方が間違っている",
							explanation:
								"ここでは正しく包めている前提です。それでも起きます。問題は渡している props のほうにあります。",
						},
						{
							label: "親が state を持っているから",
							explanation:
								"親が描き直されること自体は前提です。それでも子をスキップするのが memo の役割で、効かないのは props が毎回変わって見えているからです。",
						},
					]}
				/>

				<Quiz
					question="memo はどこに使うべき？"
					options={[
						{
							label: "実際に遅いと分かってから、重い箇所に絞って使う",
							correct: true,
							explanation:
								"比較そのものにもコストがあり、読みにくさは確実に増えます。先回りして使うと割に合いません。",
						},
						{
							label: "すべての子コンポーネントに使う",
							explanation:
								"軽い子を包むと、比較のぶんだけかえって遅くなります。読みにくさも増えます。",
						},
						{
							label: "props を受け取るコンポーネントすべてに使う",
							explanation:
								"props の有無は基準になりません。基準は「実際に遅いかどうか」です。",
						},
					]}
				/>
			</LessonSection>

			<LessonSection id="summary" {...at(DEMO, "const Memoized = memo(")}>
				<h2>この章のまとめ</h2>

				<ul>
					<li>
						<code>memo</code> は、
						<strong>props が変わっていなければ子の描き直しをスキップする</strong>
					</li>
					<li>
						見比べ方は<strong>「同じものかどうか」</strong>。中身は見ない
					</li>
					<li>
						オブジェクト・配列・<strong>関数</strong>を渡すと、
						毎回新しく作られるため memo は効かない
					</li>
					<li>
						<strong>先回りして使わない。</strong>遅いと分かってから、重い箇所に絞る
					</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
