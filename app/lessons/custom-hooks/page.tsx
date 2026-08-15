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
import { Duplicated } from "./demos/duplicated";
import { Extracted } from "./demos/extracted";

const SLUG = "custom-hooks";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{ path: "lessons/custom-hooks/demos/duplicated.tsx", label: "duplicated.tsx" },
	{
		path: "lessons/custom-hooks/demos/use-window-width.ts",
		label: "use-window-width.ts",
	},
	{ path: "lessons/custom-hooks/demos/extracted.tsx", label: "extracted.tsx" },
] as const;

const [DUPLICATED, HOOK, EXTRACTED] = SOURCES.map((source) => source.path);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					ここまで <code>useState</code>、<code>useEffect</code>、
					<code>useReducer</code> と、いくつものフックを使ってきました。
				</p>
				<p>
					これらは<strong>React が用意したフック</strong>です。
					そして<strong>自分でフックを作ることもできます</strong>。
				</p>
				<p>
					新しい概念ではありません。
					<strong>ただの関数の切り出し</strong>です。
				</p>
			</LessonHeader>

			<LessonSection
				id="duplicated"
				{...at(DUPLICATED, "function WidthLabel", "function DeviceLabel")}
			>
				<h2>同じものが 2 回書かれている</h2>

				<p>
					画面幅を使う部品が 2 つあります。
					（ブラウザの幅を変えると、両方の数字が変わります）
				</p>

				<DemoCard
					title="同じ 8 行が 2 か所にある"
					tone="bad"
					sourcePath={DUPLICATED}
					description="ウィンドウの幅を変えると、2 つとも光る"
				>
					<Duplicated />
				</DemoCard>

				<p>
					動きます。問題は、右のコードを見ると分かります。
					<strong>まったく同じ 8 行が、2 回書かれています。</strong>
				</p>

				<StaticCode
					lang="ts"
					code={`const [width, setWidth] = useState(0);

useEffect(() => {
  const update = () => setWidth(window.innerWidth);
  update();
  window.addEventListener("resize", update);
  return () => window.removeEventListener("resize", update);
}, []);`}
				/>

				<p>
					3 つめの部品でも幅が要るなら、また 8 行。
					<strong>後片付けの書き忘れが 1 か所でもあれば、そこだけ漏れます。</strong>
				</p>
			</LessonSection>

			<LessonSection id="extract" {...at(HOOK, "export function useWindowWidth")}>
				<h2>関数に切り出す</h2>

				<p>
					重複したコードを関数にまとめるのは、React に限らず普通のことです。
					ここでも同じことをします。
				</p>

				<p>
					<strong>まるごとコピーして、関数で包み、最後に return を付けただけ</strong>です。
					中身は一切変えていません。
				</p>

				<Callout variant="point" title="カスタムフックの決まりは 1 つだけ">
					<p>
						<strong>名前を <code>use</code> で始める。</strong>それだけです。
					</p>
					<p>
						この命名を守ると、lint が
						<strong>「フックの決まりを守っているか」を検査してくれます</strong>。
						条件分岐の中で呼んでいないか、依存配列に漏れがないか。
					</p>
					<p>
						逆に <code>getWindowWidth</code> のような名前にすると、
						ただの関数だと思われて検査されません。
					</p>
				</Callout>

				<p>
					<code>useWindowWidth</code> の中では <code>useState</code> と
					<code>useEffect</code> を呼んでいます。
					<strong>フックの中でフックを呼べる</strong>——これがカスタムフックの正体です。
				</p>
			</LessonSection>

			<LessonSection id="result" {...at(EXTRACTED, "const width = useWindowWidth();")}>
				<h2>使う側</h2>

				<StaticCode
					lang="ts"
					code={`const width = useWindowWidth();`}
				/>

				<p>
					<strong>8 行が 1 行になりました。</strong>
					イベントの登録も、後片付けも、
					使う側はもう知らなくてよくなっています。
				</p>

				<DemoCard
					title="カスタムフックにまとめた"
					tone="good"
					sourcePath={EXTRACTED}
					description="動きも光り方も、まったく同じ"
				>
					<Extracted />
				</DemoCard>

				<p>
					<strong>画面の動きは 1 ミリも変わっていません。</strong>
					変わったのは、読む人が背負う量です。
				</p>

				<Callout variant="warn" title="state は共有されない">
					<p>
						2 つの部品が同じフックを呼んでいますが、
						<strong><code>width</code> はそれぞれ別々に持っています</strong>。
					</p>
					<p>
						カスタムフックが共有するのは<strong>ロジックだけ</strong>で、
						state ではありません。
						<code>useState</code> を 2 回書いたのと同じ状態になります。
					</p>
					<p>
						なお、読み込んだ直後から <strong>render 2</strong> になっています。
						<strong>幅を測って入れ直したぶん</strong>です
						（最初は 0 で始まり、effect の中で本当の幅に置き換わる）。
						数字が増えたのは、ちゃんと描き直された証拠です。
					</p>
					<p>
						開発中は、これに <strong>StrictMode</strong> の二重実行
						（クリーンアップの章で出てきたもの）が重なることもあります。
						最初の数字が 2 や 3 でも、それ自体は問題ではありません。
						<strong>操作したときに増えるかどうか</strong>を見てください。
					</p>
					<p>
						デモで幅を変えると<strong>2 つの箱が別々に光ります</strong>。
						それぞれが自分の <code>width</code> を持って、
						自分で描き直されている証拠です。
					</p>
					<p>
						state まで共有したいなら、Part 9 の Context を使います。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="when" {...at(HOOK, "const [width, setWidth]")}>
				<h3>いつ切り出すか</h3>

				<p>
					<strong>2 回目に同じものを書いたとき</strong>が、いちばん分かりやすい目安です。
					1 回目で切り出すと、まだ形が定まっていないことが多い。
				</p>

				<p>もう 1 つ、重複していなくても切り出す価値がある場合があります。</p>

				<ul>
					<li>
						<strong>コンポーネントが読みにくくなっているとき</strong>。
						画面の組み立てと、裏側の処理が混ざっている
					</li>
					<li>
						<strong>名前を付けたら意味がはっきりするとき</strong>。
						<code>useWindowWidth</code> と書いてあれば、中を読まずに済む
					</li>
				</ul>

				<Callout variant="note" title="世の中のライブラリも、ほとんどこれ">
					<p>
						このあと Part 9 で使う <code>useQueryState</code>、
						<code>useLocalStorageState</code>、<code>useSWR</code>。
						全部カスタムフックです。
					</p>
					<p>
						<strong>特別な仕組みで作られているわけではありません。</strong>
						あなたが書けるものと、まったく同じものです。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="quiz" {...at(HOOK, "export function useWindowWidth")}>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="カスタムフックの決まりは？"
					options={[
						{
							label: "名前を use で始める",
							correct: true,
							explanation:
								"それだけです。この命名によって lint がフックの決まりを検査してくれるようになります。",
						},
						{
							label: "React.createHook で登録する",
							explanation:
								"そんな API はありません。ただの関数です。",
						},
						{
							label: "必ず useEffect を含める",
							explanation:
								"含めなくてかまいません。useState だけのフックも普通にあります。",
						},
					]}
				/>

				<Quiz
					question="2 つの部品が同じカスタムフックを呼ぶと、state は？"
					options={[
						{
							label: "別々に持つ。共有されるのはロジックだけ",
							correct: true,
							explanation:
								"useState を 2 回書いたのと同じです。state まで共有したいなら Context を使います。",
						},
						{
							label: "共有される。同じフックだから",
							explanation:
								"共有されません。呼び出しごとに新しい state が作られます。",
						},
						{
							label: "最初に呼んだほうだけが持つ",
							explanation:
								"両方が持ちます。片方だけということはありません。",
						},
					]}
				/>

				<Quiz
					question="切り出す目安として適切なのは？"
					options={[
						{
							label: "2 回目に同じものを書いたとき",
							correct: true,
							explanation:
								"1 回目ではまだ形が定まっていないことが多く、早すぎる抽象化になりがちです。",
						},
						{
							label: "useEffect を書いたら必ず",
							explanation:
								"1 か所でしか使わない処理を無理に外に出すと、かえって追いにくくなります。",
						},
						{
							label: "コンポーネントが 50 行を超えたら",
							explanation:
								"行数は目安になりません。重複しているか、名前を付けると分かりやすくなるかで判断します。",
						},
					]}
				/>
			</LessonSection>

			<LessonSection id="summary" {...at(HOOK, "export function useWindowWidth")}>
				<h2>この章のまとめ</h2>

				<ul>
					<li>
						カスタムフックは<strong>ただの関数の切り出し</strong>。
						新しい仕組みではない
					</li>
					<li>
						決まりは<strong>名前を <code>use</code> で始める</strong>ことだけ
					</li>
					<li>
						中で他のフックを呼べる。後片付けも中に閉じ込められる
					</li>
					<li>
						共有されるのは<strong>ロジックだけで、state は別々</strong>
					</li>
					<li>
						世の中の <code>use〜</code> ライブラリも、全部これ
					</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
