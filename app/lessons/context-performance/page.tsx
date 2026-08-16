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
import Link from "next/link";
import { LargeContextDemo } from "./demos/large-context";
import { SplitContextDemo } from "./demos/split-context";

const SLUG = "context-performance";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{ path: "lessons/context-performance/demos/large-context.tsx", label: "large-context.tsx" },
	{ path: "lessons/context-performance/demos/split-context.tsx", label: "split-context.tsx" },
] as const;

const [LARGE, SPLIT] = SOURCES.map((source) => source.path);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					Context は便利なので、つい
					<strong>「アプリの状態を全部ここに入れよう」</strong>
					と考えたくなります。
				</p>
				<p>
					それをやると、<strong>関係のない部品まで一斉に描き直されます</strong>。
					しかも気づきにくい形で。
				</p>
			</LessonHeader>

			<LessonSection id="large" {...at(LARGE, "<LargeContext value={{ count, setCount, name, setName }}>")}>
				<h2>ひとつにまとめた場合</h2>

				<p>
					<code>count</code> と <code>name</code> を、
					ひとつの Context に入れてあります。
					そして下には、それぞれ<strong>片方しか使っていない</strong>部品が並んでいます。
				</p>

				<p>
					<strong>「count を増やす」を押してください。</strong>
				</p>

				<DemoCard
					title="count と name を同じ Context に入れる"
					tone="bad"
					sourcePath={LARGE}
					description="count を押すと、name の部品まで光る"
				>
					<LargeContextDemo />
				</DemoCard>

				<p>
					<strong><code>name</code> しか使っていない部品まで光ります。</strong>
					name の値はまったく変わっていないのに、です。
				</p>
			</LessonSection>

			<LessonSection id="why" {...at(LARGE, "const { name } = use(LargeContext)")}>
				<h2>なぜ関係ない部品まで描き直されるのか</h2>

				<p>
					Part 7 で「再レンダリングの理由は、いまのところ 2 つ」と書きました。
					<strong>これが 3 つめです。</strong>
					自分の state でも、親の描き直しでもなく、
					<strong>見に行っている Context が変わったとき</strong>。
				</p>

				<p>理由は 2 つ重なっています。</p>

				<h3>1. Context は「項目ごと」に見てくれない</h3>

				<p>
					<code>use(LargeContext)</code> は、
					<strong>その Context 全体を購読します</strong>。
					「name だけを見ている」と書いたつもりでも、React はそう解釈しません。
				</p>

				<StaticCode
					lang="ts"
					code={`// name だけ取り出しているように見えるが…
const { name } = use(LargeContext);

// React から見ると「LargeContext を購読している」だけ`}
				/>

				<p>
					React が見ているのは
					<strong><code>value</code> に渡したものが、前と別のものになったかどうか</strong>
					だけです。
					別のものになっていれば、購読している部品はすべて描き直されます。
					<strong>どの項目を使っているかは、見ていません。</strong>
				</p>

				<h3>2. value のオブジェクトが毎回新しく作られる</h3>

				<StaticCode
					lang="ts"
					code={`<LargeContext value={{ count, setCount, name, setName }}>`}
				/>

				<p>
					この <code>{"{ ... }"}</code> は、
					描き直されるたびに<strong>新しいオブジェクト</strong>になります。
					Part 8 で何度も見た形です。
				</p>

				<p>
					<code>count</code> が変わって Provider が描き直されると、
					中身が同じでも <strong>value は別のもの</strong>になります。
					購読している側から見れば「変わった」ことになります。
				</p>

				<Callout variant="point" title="ここでも同じ判定">
					<p>
						<strong>同じものかどうか。</strong>
						state 更新も、memo も、children も、そして Context も、
						すべてこの判定でつながっています。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="split" {...at(SPLIT, "function CountProvider({ children }")}>
				<h2>関心ごとに分ける</h2>

				<p>
					解決は単純です。<strong>置き場所を分けます。</strong>
				</p>

				<StaticCode
					lang="ts"
					code={`// ひとつにまとめる代わりに
const CountContext = createContext(...);
const NameContext = createContext(...);`}
				/>

				<DemoCard
					title="Context を 2 つに分ける"
					tone="good"
					sourcePath={SPLIT}
					description="count を押しても、name の部品は光らない"
				>
					<SplitContextDemo />
				</DemoCard>

				<p>
					<strong>片方だけが光るようになりました。</strong>
					<code>name</code> の部品は <code>NameContext</code>{" "}
					しか購読していないので、count の変化は届きません。
				</p>
			</LessonSection>

			<LessonSection id="stabilize" {...at(SPLIT, "const value = useMemo")}>
				<h3>分けただけでは、まだ半分</h3>

				<p>
					ここまでで<strong>原因 1</strong>（項目単位で購読できない）は消えました。
					ですが<strong>原因 2</strong> はまだ残っています。
					<code>value</code> に <code>{"{ count, setCount }"}</code>{" "}
					と直接書くと、
					Provider が描き直されるたびに新しいオブジェクトになります。
				</p>

				<p>
					これを止める道具は、Part 8 でもう手に入れています。
					<strong><code>useMemo</code></strong> です。
				</p>

				<StaticCode
					lang="ts"
					code={`// ✕ 描き直されるたびに、新しいオブジェクト
return <CountContext value={{ count, setCount }}>{children}</CountContext>;

// ○ count が変わったときだけ、新しいオブジェクト
const value = useMemo(() => ({ count, setCount }), [count]);
return <CountContext value={value}>{children}</CountContext>;`}
				/>

				<p>
					いまのデモでは、<code>count</code> が変われば
					どのみち購読側は描き直されるので、
					<strong>この 1 行で見た目が変わるわけではありません</strong>。
					効いてくるのは、
					<strong>Provider が別の理由で描き直されたとき</strong>です。
				</p>

				<p>
					たとえば Provider に別の state が増えたとき。
					<code>value</code> を包んでいなければ、
					<code>count</code> は 1 ミリも変わっていないのに
					<code>count</code> を使う部品が全部描き直されます。
					包んであれば、何も起きません。
				</p>

				<Callout variant="point" title="Provider を書くときの型">
					<p>
						<strong>Context を分ける</strong>（原因 1）と、
						<strong>value を <code>useMemo</code> で包む</strong>（原因 2）。
						この 2 つはセットです。
						どちらか片方だけでは、狙いどおりには止まりません。
					</p>
					<p>
						なお <code>setCount</code> のような更新関数は、
						React が<strong>毎回同じものを渡すと保証している</strong>ので、
						依存配列に入れる必要はありません。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="children-trick" {...at(SPLIT, "{children}")}>
				<h3>Provider が children を受け取っている理由</h3>

				<p>
					デモの Provider は、こういう形をしています。
				</p>

				<StaticCode
					lang="ts"
					code={`function CountProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const value = useMemo(() => ({ count, setCount }), [count]);
  return <CountContext value={value}>{children}</CountContext>;
}`}
				/>

				<p>
					これは Part 8 の<strong>「children で切り離す」</strong>と同じ形です。
					そして、この形でなければ<strong>デモが成立しません</strong>。
				</p>

				<p>
					もし Provider の中に子を直接書いていたら、
					<code>count</code> が変わって Provider が描き直されるたびに、
					<strong>Context とは関係なく子も全部描き直されます</strong>。
					それでは「Context を分けた効果」が見えません。
				</p>

				<p>
					children として外から渡すことで、
					<strong>Context による描き直しだけ</strong>を取り出して観察できています。
				</p>

				<Callout variant="note">
					<p>
						実務でも同じです。Provider は
						<strong>children を受け取るだけの薄い部品</strong>にしておきます。
						そうしないと、分割した意味が半減します。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="practice" {...at(SPLIT, "const CountContext = createContext")}>
				<h2>どう分けるか</h2>

				<p>
					分ける基準は<strong>「一緒に変わるかどうか」</strong>です。
				</p>

				<ul>
					<li>
						<strong>一緒に変わるもの</strong>は同じ Context でよい
						（ユーザー情報の名前とメールアドレスなど）
					</li>
					<li>
						<strong>別々に変わるもの</strong>は分ける
						（ユーザー情報とテーマ設定など）
					</li>
					<li>
						<strong>更新が頻繁なもの</strong>は必ず分ける。
						巻き込む回数がそのまま増える
					</li>
				</ul>

				<h3>値と更新関数を分ける手もある</h3>

				<StaticCode
					lang="ts"
					code={`const CountContext = createContext(0);           // 値
const SetCountContext = createContext(() => {}); // 更新関数`}
				/>

				<p>
					「更新はするが表示はしない」部品は珍しくありません。
					そういう部品は <code>SetCountContext</code> だけを購読すれば、
					<strong>値が変わっても描き直されなくなります</strong>。
				</p>

				<Callout variant="warn" title="ただし、やりすぎない">
					<p>
						分ければ分けるほど Provider が増え、
						入れ子が深くなって読みにくくなります。
					</p>
					<p>
						<code>memo</code> の章で挙げた 4 ステップと同じで、
						<strong>実際に遅くなってから分ける</strong>のが基本です。
						最初から細かく分ける必要はありません。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="quiz" {...at(LARGE, "const { name } = use(LargeContext)")}>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="const { name } = use(LargeContext) と書けば、name が変わったときだけ描き直される？"
					options={[
						{
							label: "されない。Context 全体を購読しているので、他の項目が変わっても描き直される",
							correct: true,
							explanation:
								"React に「項目ごとの購読」という仕組みはありません。分割代入で取り出しても、購読しているのは Context 全体です。",
						},
						{
							label: "される。使っている項目だけが対象になる",
							explanation:
							"そうなればよいのですが、React はそこまで見てくれません。だから Context を分ける必要があります。",
						},
						{
							label: "される。ただし memo が必要",
							explanation:
								"memo をつけても、Context の購読による描き直しは止められません。",
						},
					]}
				/>

				<Quiz
					question="Provider が children を受け取る形にする理由は？"
					options={[
						{
							label: "Provider が描き直されても、子が巻き込まれないようにするため",
							correct: true,
							explanation:
								"children は Provider の外で作られるので、Provider の再実行では作り直されません。Part 8 の切り離しと同じ仕組みです。",
						},
						{
							label: "Context の値を子に渡すために必要だから",
							explanation:
								"値は Context 経由で渡るので、children でなくても渡せます。理由は描き直しの範囲を抑えることです。",
						},
						{
							label: "書き方の作法として決まっているから",
							explanation:
								"作法ではなく、動作上の理由があります。中に直接書くと、分割した効果が半減します。",
						},
					]}
				/>
			</LessonSection>

			<LessonSection id="summary" {...at(SPLIT, "const CountContext = createContext")}>
				<h2>この章のまとめ</h2>

				<ul>
					<li>
						Context は<strong>項目ごとではなく全体を購読する</strong>。
						使っていない項目の変化でも描き直される
					</li>
					<li>
						value のオブジェクトは毎回新しく作られるので、
						<strong>Provider が描き直されれば必ず「変わった」</strong>ことになる
					</li>
					<li>
						対処は<strong>一緒に変わるものだけ、同じ箱に入れる</strong>こと。基準は「一緒に変わるかどうか」
					</li>
					<li>
						Provider は<strong>children を受け取る薄い部品</strong>にする。
						中に直接書くと分割の効果が半減する
					</li>
					<li>ただし、やりすぎない。実際に遅くなってから分ける</li>
				</ul>

				<Callout variant="note" title="この手数を減らす道具があります">
					<p>
						分けて、包んで、囲む。
						<strong>正しいのですが、手数が多い</strong>のも確かです。
						画面が育つほど Provider が増えていきます。
					</p>
					<p>
						実務では、ここで外部のストアを使うことが多くなります。
						次の章の <Link href="/lessons/zustand">Zustand</Link> で、
						<strong>同じことがセレクタ 1 行で書ける</strong>のを見ます。
					</p>
				</Callout>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
