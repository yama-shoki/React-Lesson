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
import { NoMemo } from "./demos/no-memo";
import { WithMemo } from "./demos/with-memo";

const SLUG = "usememo";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{ path: "lessons/usememo/demos/no-memo.tsx", label: "no-memo.tsx" },
	{ path: "lessons/usememo/demos/with-memo.tsx", label: "with-memo.tsx" },
	{ path: "lessons/usememo/demos/heavy.ts", label: "heavy.ts" },
] as const;

const [NO_MEMO, WITH_MEMO, HEAVY] = SOURCES.map((source) => source.path);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					コンポーネントは、state が変わるたびに
					<strong>頭から全部実行し直されます</strong>。
					途中に重い計算があれば、その計算も毎回走ります。
				</p>
				<p>
					関係のない state が変わっただけでも、です。
				</p>
				<p>
					<code>useMemo</code> は、
					<strong>前の計算結果を覚えておいて使い回す</strong>ための道具です。
				</p>
			</LessonHeader>

			<LessonSection id="problem" {...at(NO_MEMO, "const total = heavyCalculation(count)")}>
				<h2>関係ない操作で、計算が走る</h2>

				<p>
					下のデモには、わざと時間のかかる計算を入れてあります。
					<strong>入力欄に文字を打ってみてください。</strong>
				</p>

				<DemoCard
					title="毎回計算する"
					tone="bad"
					sourcePath={NO_MEMO}
					showRenderCount
					description="1 文字打つたびに引っかかる"
				>
					<NoMemo />
				</DemoCard>

				<p>
					<strong>打つたびに一瞬固まります。</strong>
					入力は計算とまったく関係がないのに、です。
				</p>

				<p>
					理由は単純で、<code>keyword</code>{" "}
					が変わるとコンポーネントが実行し直され、
					その途中にある計算の行も、また実行されるからです。
				</p>

				<StaticCode
					lang="ts"
					code={`const total = heavyCalculation(count); // 描き直しのたびに走る`}
				/>
			</LessonSection>

			<LessonSection id="fixed" {...at(WITH_MEMO, "useMemo(() => heavyCalculation(count), [count])")}>
				<h2>結果を覚えておく</h2>

				<p>
					<code>useMemo</code> で包み、
					<strong>いつ計算し直すか</strong>を伝えます。
				</p>

				<StaticCode
					lang="ts"
					code={`// 変更前
const total = heavyCalculation(count);

// 変更後
const total = useMemo(() => heavyCalculation(count), [count]);`}
				/>

				<p>
					依存配列は <code>useEffect</code> と同じ考え方です。
					<strong>ここに書いた値が変わったときだけ</strong>計算し直し、
					それ以外は前の結果をそのまま返します。
				</p>

				<DemoCard
					title="count が変わったときだけ計算する"
					tone="good"
					sourcePath={WITH_MEMO}
					showRenderCount
					description="入力はなめらか。count を押したときだけ待たされる"
				>
					<WithMemo />
				</DemoCard>

				<p>
					入力がなめらかになりました。
					<strong>「count を増やす」を押したときだけ</strong>、一瞬待たされます。
					そこは計算し直す必要があるので、正しい動きです。
				</p>
			</LessonSection>

			<LessonSection id="not-for" {...at(HEAVY, "for (let i = 0")}>
				<h2>使ってはいけない場面のほうが多い</h2>

				<p>
					ここまで読むと便利に見えますが、
					<strong>ほとんどの計算に useMemo は要りません。</strong>
				</p>

				<p>
					このデモの計算は<strong>1200 万回のループ</strong>です。
					こんな計算は、ふつうのアプリにはまず出てきません。
				</p>

				<StaticCode
					lang="ts"
					code={`// これらに useMemo は不要。速すぎて差が出ない
const total = price * quantity;
const fullName = firstName + lastName;
const found = items.filter((item) => item.done);   // 数百件程度なら不要`}
				/>

				<Callout variant="warn" title="包むこと自体にコストがある">
					<p>
						<code>useMemo</code> は、依存配列を見比べ、前の結果を保管します。
						<strong>その処理自体がタダではありません。</strong>
					</p>
					<p>
						軽い計算を包むと、<strong>計算するより見比べるほうが高くつきます</strong>。
						読みにくくなったうえに遅くなる、という最悪の結果になります。
					</p>
				</Callout>

				<Callout variant="point" title="Part 4-3 と矛盾しません">
					<p>
						「計算できるものは state にしない」と書きました。
						<code>useMemo</code> はそれを覆すものではありません。
					</p>
					<p>
						<strong>計算のままにしておいて、結果を使い回すだけ</strong>です。
						state にして二重管理にするのとは、まったく別の話です。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="another-use" {...at(WITH_MEMO, "const total = useMemo")}>
				<h3>もうひとつの使い道</h3>

				<p>
					実は <code>useMemo</code> は、速さ以外の目的でも使われます。
					<strong>同じものを渡し続けるため</strong>です。
				</p>

				<StaticCode
					code={`// 毎回新しいオブジェクト → memo が効かない / effect が毎回動く
const options = { unit: "回" };

// 同じものを使い回す
const options = useMemo(() => ({ unit: "回" }), []);`}
				/>

				<p>
					<code>memo</code> の章と、無限ループの章でやった問題への対処です。
					<strong>計算が重いからではなく、参照を安定させるために使う</strong>
					という使い方も覚えておいてください。
				</p>
			</LessonSection>

			<LessonSection id="quiz" {...at(WITH_MEMO, "const total = useMemo")}>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="useMemo は何をする道具？"
					options={[
						{
							label: "依存配列の値が変わったときだけ計算し直し、それ以外は前の結果を使い回す",
							correct: true,
							explanation:
								"計算そのものをなくすわけではありません。やり直す回数を減らすだけです。",
						},
						{
							label: "計算を速くする",
							explanation:
								"計算自体は速くなりません。同じ計算を繰り返さないようにするだけです。",
						},
						{
							label: "計算結果を state として保存する",
							explanation:
								"state にはなりません。二重管理を避けたまま、結果だけを使い回します。",
						},
					]}
				/>

				<Quiz
					question="const fullName = firstName + lastName; を useMemo で包むべき？"
					options={[
						{
							label: "包まない。計算が軽すぎて、見比べるコストのほうが高くつく",
							correct: true,
							explanation:
								"useMemo にもコストがあります。軽い計算を包むと、読みにくくなったうえに遅くなります。",
						},
						{
							label: "包む。すべての計算は useMemo で包むべき",
							explanation:
								"逆効果です。ほとんどの計算に useMemo は要りません。",
						},
						{
							label: "包む。文字列の結合は重いから",
							explanation:
								"文字列の結合は極めて軽い処理です。1200 万回のループとは比べものになりません。",
						},
					]}
				/>
			</LessonSection>

			<LessonSection id="summary" {...at(WITH_MEMO, "const total = useMemo")}>
				<h2>この章のまとめ</h2>

				<ul>
					<li>
						コンポーネントは毎回頭から実行される。
						<strong>途中の計算も毎回走る</strong>
					</li>
					<li>
						<code>useMemo</code> は、
						<strong>依存配列が変わったときだけ計算し直す</strong>
					</li>
					<li>
						<strong>ほとんどの計算には要らない。</strong>
						包むこと自体にコストがあり、軽い計算では逆効果
					</li>
					<li>
						速さ以外に、<strong>参照を安定させる</strong>目的でも使う
					</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
