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
import { StableObject } from "./demos/stable-object";
import { Transition } from "./demos/transition";
import { WithMemo } from "./demos/with-memo";

const SLUG = "usememo";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{ path: "lessons/usememo/demos/no-memo.tsx", label: "no-memo.tsx" },
	{ path: "lessons/usememo/demos/with-memo.tsx", label: "with-memo.tsx" },
	{ path: "lessons/usememo/demos/heavy.ts", label: "heavy.ts" },
	{ path: "lessons/usememo/demos/stable-object.tsx", label: "stable-object.tsx" },
	{ path: "lessons/usememo/demos/transition.tsx", label: "transition.tsx" },
] as const;

const [NO_MEMO, WITH_MEMO, HEAVY, STABLE, TRANSITION] = SOURCES.map(
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
					計算し直す必要があるので、ここは減らしようがありません。
				</p>
			</LessonSection>

			<LessonSection id="transition" {...at(TRANSITION, "startTransition")}>
				<h2>それでも待たされるときは</h2>

				<p>
					<code>useMemo</code> で減らせるのは
					<strong>「しなくてよい計算」</strong>だけです。
					本当に必要な計算そのものは、速くなりません。
				</p>

				<p>
					では、その 1 回の重さはどうにもならないのか。
					<strong>計算を速くすることはできませんが、
					画面を止めないことはできます。</strong>
				</p>

				<StaticCode
					lang="ts"
					code={`const [isPending, startTransition] = useTransition();

const increase = () => {
  // 押した手応えは、すぐ返す
  setCount((current) => current + 1);

  // 重いほうは「急がなくていい」と伝える
  startTransition(() => {
    setTarget((current) => current + 1);
  });
};`}
				/>

				<DemoCard
					title="急ぐものと、急がないものを分ける"
					sourcePath={TRANSITION}
					showRenderCount
					description="連打してみる。数字はどう動くか"
				>
					<Transition />
				</DemoCard>

				<p>
					連打すると、<strong>数字だけが軽やかに増えていきます</strong>。
					重い計算のほうは薄くなって「計算中…」と出たまま、
					<strong>手を止めたところで追いつきます</strong>。
				</p>

				<p>
					<code>startTransition</code> で包んだ更新は、
					<strong>後回しにしてよい</strong>と React に伝わります。
					急ぎの更新（押した手応え）が先に処理され、
					重いほうは<strong>途中で捨ててやり直せます</strong>。
					だから連打しても引っかかりません。
				</p>

				<Callout variant="point" title="3 つは、減らすところが違う">
					<ul>
						<li>
							<code>memo</code> …{" "}
							<strong>描き直しの範囲</strong>を減らす
						</li>
						<li>
							<code>useMemo</code> …{" "}
							<strong>計算の回数</strong>を減らす
						</li>
						<li>
							<code>useTransition</code> … 減らさない。
							<strong>順番を変える</strong>
						</li>
					</ul>
					<p>
						最後の 1 つだけ性質が違います。
						そして<strong>次の章の React Compiler が自動化してくれるのは、
						前の 2 つだけ</strong>です。
						順番の判断は、人間にしか決められません。
					</p>
				</Callout>

				<Callout variant="note" title="よく似た useDeferredValue">
					<p>
						<code>useDeferredValue</code> という、ほぼ同じ役割のものもあります。
						<strong>更新のきっかけを自分で書けるとき</strong>は{" "}
						<code>useTransition</code>、
						<strong>受け取った値が重いだけのとき</strong>は{" "}
						<code>useDeferredValue</code>、と考えておけば足ります。
					</p>
				</Callout>
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

				<Callout variant="point" title="Part 4 の「state は最小限にする」 と矛盾しません">
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

			<LessonSection id="another-use" {...at(STABLE, "const stable = useMemo")}>
				<h2>もうひとつの使い道：同じものを渡し続ける</h2>

				<p>
					ここまでは「重い計算を省く」話でした。
					ですが実務では、
					<strong>もうひとつの使い道のほうがよく出てきます</strong>。
					計算が重いからではなく、
					<strong>前と同じものを渡し続けるため</strong>に使う、という使い方です。
				</p>

				<p>
					<code>memo</code> の章で、
					<strong>包んだのに効かない</strong>例を見ました。
					原因は「毎回新しいオブジェクトを渡していること」でした。
					あのとき外に出して直しましたが、
					<strong>state から組み立てるものは外に出せません</strong>。
				</p>

				<p>その場合に使うのが、これです。</p>

				<StaticCode
					code={`// ✕ 毎回新しいオブジェクト → memo が効かない / effect が毎回動く
const options = { unit: "回" };

// ○ 同じものを使い回す
const options = useMemo(() => ({ unit: "回" }), []);`}
				/>

				<DemoCard
					title="同じ子に、2 通りの渡し方をする"
					sourcePath={STABLE}
					description="count を押す。name は変わっていない"
				>
					<StableObject />
				</DemoCard>

				<p>
					どちらの子も <code>memo</code> で包んであり、
					<code>name</code> は一度も変わっていません。
					それでも<strong>上の箱だけが光ります</strong>。
					渡しているものが毎回別物だからです。
				</p>

				<Callout variant="point" title="ここまでが 1 本につながります">
					<p>
						<code>memo</code> は<strong>「同じものかどうか」</strong>で判定する。
						<code>useMemo</code> は<strong>その「同じもの」を作り続ける</strong>。
						2 つでひと組の道具です。
					</p>
					<p>
						渡すのが<strong>関数</strong>のときは、次の章の
						<code>useCallback</code> が同じ役割をします。
					</p>
				</Callout>
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
						速さ以外に、<strong>毎回同じものを渡し続ける</strong>目的でも使う
					</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
