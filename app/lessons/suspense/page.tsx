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
import { Suspense } from "react";
import { ListSkeleton } from "./demos/skeleton";
import { SlowList } from "./demos/slow-list";

const SLUG = "suspense";

// 待ち時間を見せる章なので、毎回サーバーで組み立てる。
// これを付けないとビルド時に完成させてしまい、fallback が一生見えない。
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{ path: "lessons/suspense/demos/slow-list.tsx", label: "slow-list.tsx" },
	{ path: "lessons/suspense/demos/skeleton.tsx", label: "skeleton.tsx" },
] as const;

const [SLOW, SKELETON] = SOURCES.map((source) => source.path);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					ここまでのパフォーマンスの話は、
					<strong>むだな描き直しを減らす</strong>ことでした。
				</p>
				<p>
					この章は違います。
					<strong>どうしても時間がかかるもの</strong>を、どう見せるかの話です。
				</p>
				<p>
					データの取得に 2 秒かかるとき、その 2 秒を短くはできません。
					できるのは、<strong>その間に何を見せるか</strong>を決めることです。
				</p>
			</LessonHeader>

			<LessonSection id="demo" {...at(SLOW, "async function getMembers")}>
				<h2>まず動くものを見る</h2>

				<p>
					このページを開き直すと、下のカードだけが遅れて出てきます。
					<strong>ページ全体は待っていません。</strong>
				</p>

				<DemoCard
					title="2 秒かかる一覧"
					sourcePath={SLOW}
					description="ページを再読み込みすると、ここだけ遅れて出る"
				>
					<Suspense fallback={<ListSkeleton />}>
						<SlowList />
					</Suspense>
				</DemoCard>

				<p>
					周りの文章はすぐ読めています。
					<strong>遅いのはこの箱の中だけ</strong>で、そこが仕切られています。
				</p>

				<p>この仕切りを作っているのが、たった 3 行です。</p>

				<StaticCode
					code={`<Suspense fallback={<ListSkeleton />}>
  <SlowList />
</Suspense>`}
				/>
			</LessonSection>

			<LessonSection id="server-component" {...at(SLOW, "export async function SlowList")}>
				<h2>サーバーで待つ</h2>

				<p>
					デモの中身は、こう書かれています。
				</p>

				<StaticCode
					lang="ts"
					code={`export async function SlowList() {
  const members = await getMembers();
  return <ul>...</ul>;
}`}
				/>

				<p>
					<strong>コンポーネントが <code>async</code> になっていて、
					中で <code>await</code> しています。</strong>
					もしこれを、ブラウザ側で自分で書くとどうなるか。
					（この書き方は Part 9 で詳しく扱います）
				</p>

				<StaticCode
					lang="ts"
					code={`// useEffect で取る場合、state が 3 つ要る
const [members, setMembers] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);

// async な Server Component なら、この 1 行
const members = await getMembers();`}
				/>

				<p>
					読み込み中の state がありません。
					<strong>「読み込み中かどうか」を Suspense が外側で受け持つ</strong>からです。
					中のコードは、データが揃った後のことだけ書けばよくなります。
				</p>

				<Callout variant="point" title="Server Component とは">
					<p>
						<code>&quot;use client&quot;</code> が付いていないコンポーネントは、
						<strong>サーバー側で実行されます</strong>。
						ブラウザに届くのは、実行し終わった結果の HTML です。
					</p>
					<p>
						サーバーで動くので <code>await</code> が書けます。
						代わりに <code>useState</code> や <code>onClick</code> は使えません。
					</p>
					<p>
						この話は<strong>Part 9 の最初の章</strong>
						「サーバーで動くコンポーネント」で正面から扱います。
						ここでは<strong>「サーバーで動くから待てる」</strong>
						とだけ思って読み進めてください。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="fallback" {...at(SKELETON, "export function ListSkeleton")}>
				<h2>fallback は「同じ形の型」にする</h2>

				<p>
					<code>fallback</code> には好きなものを置けます。
					ですが<strong>置き方に良し悪しがあります</strong>。
				</p>

				<p>
					このデモの fallback は、本体と
					<strong>同じ高さ（<code>h-24</code>）</strong>にしてあります。
					だから 2 秒後に差し替わっても、下の文章が動きません。
				</p>

				<Callout variant="warn" title="高さを揃えないとどうなるか">
					<p>
						<code>{'fallback={<p>読み込み中…</p>}'}</code> のように
						1 行だけ置くと、中身が来た瞬間に
						<strong>下のコンテンツが押し下げられます</strong>。
					</p>
					<p>
						読んでいた行が飛ぶ、押そうとしたボタンが逃げる。
						これは体感品質をはっきり下げます。
					</p>
					<p>
						<strong>来るものと同じ寸法の空箱を先に置く。</strong>
						スケルトンと呼ばれる作り方です。
					</p>
				</Callout>

				<p>
					<code>animate-pulse</code> でうっすら点滅させているのも意味があります。
					<strong>止まっているのではなく、待っている</strong>と伝えるためです。
				</p>
			</LessonSection>

			<LessonSection id="where" {...at(SLOW, "async function getMembers")}>
				<h2>どこに置くか</h2>

				<p>
					<code>Suspense</code> は<strong>仕切り</strong>です。
					置いた場所より内側だけが待ちます。
				</p>

				<StaticCode
					code={`// ✕ ページ全体を包む → 何も見えないまま 2 秒
<Suspense fallback={<Spinner />}>
  <Header />
  <Article />
  <SlowList />
</Suspense>

// ◯ 遅いところだけ包む → 他は即座に出る
<Header />
<Article />
<Suspense fallback={<ListSkeleton />}>
  <SlowList />
</Suspense>`}
				/>

				<p>
					<strong>遅いものに、できるだけ近いところで包みます。</strong>
					包む範囲が広いほど、待たされる範囲も広がります。
				</p>

				<p>
					逆に、遅いものが 2 つあって
					<strong>片方だけ先に出したい</strong>なら、
					それぞれ別々に包みます。早く終わったほうから順に出てきます。
				</p>

				<Callout variant="point" title="では、失敗は誰が受け持つのか">
					<p>
						「読み込み中は Suspense が外側で受け持つ」なら、
						<strong>失敗したときは？</strong>と思ったはずです。
					</p>
					<p>
						そちらにも受け皿があります。<strong>エラー境界</strong>と呼ばれるもので、
						Next.js なら <code>error.tsx</code> というファイルを置くと、
						その範囲で起きた失敗をそこで受け止めてくれます。
					</p>
					<StaticCode
						lang="bash"
						code={`app/lessons/error.tsx   ← この下で失敗が起きたら、これが出る`}
					/>
					<p>
						<strong>待ちの外側が Suspense、失敗の外側がエラー境界。</strong>
						対になっています。この教材では扱いませんが、
						組みになっていることだけ覚えておいてください。
					</p>
				</Callout>

				<Callout variant="note" title="Next.js の loading.tsx">
					<p>
						ページ全体の待ち時間には、
						<code>loading.tsx</code> というファイルを置く方法もあります。
						Next.js がそのページを <code>Suspense</code> で包んでくれます。
					</p>
					<p>
						ページ単位なら <code>loading.tsx</code>、
						ページの一部なら自分で <code>Suspense</code> を書く、
						という使い分けになります。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="quiz" {...at(SLOW, "export async function SlowList")}>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="Suspense を使うと何が変わる？"
					options={[
						{
							label: "遅い部分だけを仕切って、他を先に表示できる",
							correct: true,
							explanation:
								"処理そのものは速くなりません。待つ範囲を狭め、待っている間に何を見せるかを決められるようになります。",
						},
						{
							label: "データの取得そのものが速くなる",
							explanation:
								"速くなりません。2 秒かかるものは 2 秒かかります。",
						},
						{
							label: "再レンダリングの回数が減る",
							explanation:
								"再レンダリングの話ではありません。待ち時間の見せ方の話です。",
						},
					]}
				/>

				<Quiz
					question="async な Server Component で読み込み中の state が要らないのはなぜ？"
					options={[
						{
							label: "「読み込み中かどうか」を Suspense が外側で受け持つから",
							correct: true,
							explanation:
								"中のコードはデータが揃った後のことだけ書けます。useEffect 版で 3 つ必要だった state が消えます。",
						},
						{
							label: "Server Component では state が使えないから",
							explanation:
								"使えないのは事実ですが、理由が逆です。要らなくなったから困らない、という順序です。",
						},
						{
							label: "サーバーの処理は一瞬で終わるから",
							explanation:
								"終わりません。このデモは実際に 2 秒待っています。",
						},
					]}
				/>

				<Quiz
					question="fallback として適切なのは？"
					options={[
						{
							label: "本体と同じ寸法の、うっすら動く空箱",
							correct: true,
							explanation:
								"差し替わったときに周りが動きません。動きがあることで「待っている」とも伝わります。",
						},
						{
							label: "小さく「読み込み中…」と 1 行",
							explanation:
								"中身が来た瞬間に下が押し下げられます。読んでいた行が飛び、押そうとしたボタンが逃げます。",
						},
						{
							label: "何も置かない（null）",
							explanation:
								"何も起きていないように見えます。壊れていると思われる可能性があります。",
						},
					]}
				/>
			</LessonSection>

			<LessonSection id="summary" {...at(SLOW, "export async function SlowList")}>
				<h2>この章のまとめ</h2>

				<ul>
					<li>
						<code>Suspense</code> は<strong>待つ範囲を仕切る境界線</strong>。
						速くする道具ではない
					</li>
					<li>
						<code>async</code> な Server Component なら、
						<strong>読み込み中の state が要らなくなる</strong>
					</li>
					<li>
						fallback は<strong>本体と同じ寸法の型</strong>にする。
						でないと差し替わった瞬間に画面が跳ねる
					</li>
					<li>
						<strong>遅いものに、できるだけ近いところで包む</strong>
					</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
