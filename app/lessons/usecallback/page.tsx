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
import { WithCallback } from "./demos/with-callback";
import { WithoutCallback } from "./demos/without-callback";

const SLUG = "usecallback";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{ path: "lessons/usecallback/demos/without-callback.tsx", label: "without-callback.tsx" },
	{ path: "lessons/usecallback/demos/with-callback.tsx", label: "with-callback.tsx" },
] as const;

const [WITHOUT, WITH] = SOURCES.map((source) => source.path);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					<code>memo</code> の章で、
					<strong>関数を props で渡すと memo が効かない</strong>と書きました。
					その対処がこの章です。
				</p>
				<p>
					<code>useMemo</code> が計算結果を覚えておく道具なら、
					<code>useCallback</code> は<strong>関数そのものを覚えておく</strong>道具です。
				</p>
			</LessonHeader>

			<LessonSection id="broken" {...at(WITHOUT, "const handleSave = () =>")}>
				<h2>memo したのに、子が描き直される</h2>

				<p>
					子は <code>memo</code> で包んであります。
					渡している props は <code>onSave</code> という関数 1 つだけ。
					そして「count を増やす」は、子とは何の関係もありません。
				</p>

				<DemoCard
					title="素の関数を渡す"
					tone="bad"
					sourcePath={WITHOUT}
					showRenderCount
					description="memo してあるのに、押すたびに子が光る"
				>
					<WithoutCallback />
				</DemoCard>

				<p>
					<strong>子が光ります。</strong>
					<code>memo</code> が効いていません。
				</p>

				<p>犯人はこの行です。</p>

				<StaticCode
					lang="ts"
					code={`const handleSave = () => setSaved((s) => s + 1);`}
				/>

				<p>
					この行は<strong>描き直されるたびに実行され、毎回新しい関数を作ります</strong>。
					中身が同じでも、React にとっては別のものです。
				</p>

				<p>
					<code>memo</code> は props を「同じものかどうか」で見比べます。
					毎回別の関数が渡ってくるので、
					<strong>「props が変わった」と判断してしまいます</strong>。
				</p>

				<Callout variant="note" title="関数が「毎回新しい」とはどういうことか">
					<p>
						JavaScript では、同じ中身の関数を 2 つ作っても別物として扱われます。
					</p>
					<StaticCode
						lang="ts"
						code={`const a = () => 1;
const b = () => 1;

a === b; // false（中身は同じでも別のもの）`}
					/>
					<p>
						コンポーネントが実行し直されるたびに、
						この「別のもの」が新しく生まれています。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="fixed" {...at(WITH, "useCallback(() => setSaved")}>
				<h2>同じ関数を使い回す</h2>

				<StaticCode
					lang="ts"
					code={`// 変更前
const handleSave = () => setSaved((s) => s + 1);

// 変更後
const handleSave = useCallback(() => setSaved((s) => s + 1), []);`}
				/>

				<p>
					依存配列が空なので、
					<strong>この関数は最初に作られたものがずっと使い回されます</strong>。
					毎回同じものが渡るので、<code>memo</code> が効くようになります。
				</p>

				<DemoCard
					title="useCallback で包む"
					tone="good"
					sourcePath={WITH}
					showRenderCount
					description="count を押しても、子は光らない"
				>
					<WithCallback />
				</DemoCard>

				<p>
					子の描き直しが止まりました。子のコードは 1 文字も変えていません。
					<strong>変えたのは、渡す側の 1 行だけ</strong>です。
				</p>
			</LessonSection>

			<LessonSection id="alone" {...at(WITH, "const Child = memo(")}>
				<h2>単独では意味がない</h2>

				<p>
					ここが最も誤解されるところです。
				</p>

				<Callout variant="point" title="useCallback は単独では効果がない">
					<p>
						関数を作り直さないだけでは、<strong>何も速くなりません</strong>。
						関数を作るコストなど、ほとんどゼロだからです。
					</p>
					<p>
						意味があるのは、その関数が
						<strong>「同じかどうか」を見られる場所に渡されるとき</strong>だけです。
					</p>
				</Callout>

				<p>具体的には、次の 2 つの場合です。</p>

				<ul>
					<li>
						<strong>memo した子に渡すとき</strong>（この章でやったこと）
					</li>
					<li>
						<strong>useEffect の依存配列に入れるとき</strong>
						（無限ループの章でやったこと）
					</li>
				</ul>

				<p>
					逆に言えば、<strong>この 2 つに当てはまらないなら要りません</strong>。
					ただのボタンの <code>onClick</code> を包む必要はありません。
				</p>

				<StaticCode
					code={`// 包む必要なし。誰も「同じかどうか」を見ていない
<button onClick={useCallback(() => setOpen(true), [])}>開く</button>

// これで十分
<button onClick={() => setOpen(true)}>開く</button>`}
				/>
			</LessonSection>

			<LessonSection id="relation" {...at(WITH, "useCallback(() => setSaved")}>
				<h3>useMemo との関係</h3>

				<p>
					実は <code>useCallback</code> は、
					<code>useMemo</code> の特別な形にすぎません。
				</p>

				<StaticCode
					lang="ts"
					code={`// この 2 つは同じ意味
const fn = useCallback(() => doSomething(), []);
const fn = useMemo(() => () => doSomething(), []);`}
				/>

				<p>
					「関数を返す useMemo」を書くのが面倒なので、
					専用の名前が用意されているだけです。
					<strong>覚えることは増えていません。</strong>
				</p>
			</LessonSection>

			<LessonSection id="quiz" {...at(WITHOUT, "const handleSave = () =>")}>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="memo した子に関数を渡すと、memo が効かなくなるのはなぜ？"
					options={[
						{
							label: "関数は描き直しのたびに新しく作られ、React が別のものと判断するから",
							correct: true,
							explanation:
								"中身が同じ関数でも、作られたものが違えば別物です。memo は「同じものか」で見比べるので、props が変わったと判断します。",
						},
						{
							label: "memo は関数の props に対応していないから",
							explanation:
								"対応していないわけではありません。同じ関数が渡り続ければ、ちゃんと効きます。",
						},
						{
							label: "関数の比較に時間がかかるから",
							explanation:
								"比較は一瞬で終わります。問題は比較の速さではなく、毎回別のものになっていることです。",
						},
					]}
				/>

				<Quiz
					question="ボタンの onClick に渡す関数を useCallback で包むべき？"
					options={[
						{
							label: "包まない。誰も「同じかどうか」を見ていないので意味がない",
							correct: true,
							explanation:
								"意味があるのは memo した子に渡すときと、effect の依存配列に入れるときだけです。それ以外では読みにくくなるだけです。",
						},
						{
							label: "包む。関数を作り直さないほうが速いから",
							explanation:
								"関数を作るコストはほぼゼロです。包んでも速くなりません。",
						},
						{
							label: "包む。すべての関数は useCallback で包むのが作法",
							explanation:
								"そんな作法はありません。効果のない場所で使うと、読みにくさだけが増えます。",
						},
					]}
				/>
			</LessonSection>

			<LessonSection id="summary" {...at(WITH, "useCallback(() => setSaved")}>
				<h2>この章のまとめ</h2>

				<ul>
					<li>
						関数は<strong>描き直しのたびに新しく作られる</strong>
					</li>
					<li>
						そのため、<code>memo</code> した子に関数を渡すと memo が効かない
					</li>
					<li>
						<code>useCallback</code> は<strong>同じ関数を使い回す</strong>ための道具
					</li>
					<li>
						<strong>単独では意味がない。</strong>
						memo した子に渡すときと、effect の依存配列に入れるときだけ
					</li>
					<li>
						正体は「関数を返す <code>useMemo</code>」の短縮形
					</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
