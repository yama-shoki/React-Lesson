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
import { ManualFetch } from "./demos/manual-fetch";
import { WithSwr } from "./demos/with-swr";

const SLUG = "server-state";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{ path: "lessons/server-state/demos/manual-fetch.tsx", label: "manual-fetch.tsx" },
	{ path: "lessons/server-state/demos/with-swr.tsx", label: "with-swr.tsx" },
] as const;

const [MANUAL, SWR] = SOURCES.map((source) => source.path);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					最後の置き場所は<strong>サーバー</strong>です。
					そしてこれだけは、これまでと性質が違います。
				</p>
				<p>
					これまでの 3 つは、<strong>自分が持ち主</strong>でした。
					サーバーのデータは違います。
					<strong>持ち主は向こうにいて、こちらが持っているのは写し</strong>です。
				</p>
				<p>
					その違いが、扱い方を変えます。
				</p>
			</LessonHeader>

			<LessonSection id="manual" {...at(MANUAL, "const [members, setMembers]")}>
				<h2>自分で書くと、state が増えていく</h2>

				<p>
					Part 6 でやった <code>useEffect</code> を使えば、
					データの取得そのものは書けます。
				</p>

				<DemoCard
					title="useEffect で取ってくる"
					tone="bad"
					sourcePath={MANUAL}
					showRenderCount
					description="動くが、state が 3 つ必要になっている"
				>
					<ManualFetch />
				</DemoCard>

				<p>
					Part 8 の Suspense で一度出した形です。
					動きます。ですが、state が 3 つ必要になりました。
				</p>

				<StaticCode
					lang="ts"
					code={`const [members, setMembers] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);`}
				/>

				<p>
					しかも<strong>まだ足りません</strong>。
					実際のアプリでは、こういう要求が次々に来ます。
				</p>

				<ul>
					<li>「取り直す」ボタンを付けたい</li>
					<li>同じデータを別の画面でも使いたい（また取りに行く？）</li>
					<li>連続で押されたとき、古い結果が後から届いて上書きするのを防ぎたい</li>
					<li>タブに戻ってきたら最新にしたい</li>
					<li>失敗したら数回やり直したい</li>
				</ul>

				<p>
					<strong>これを全部、正しく書くのは大変です。</strong>
					そしてアプリのどこでデータを取るときも、同じ苦労を繰り返します。
				</p>
			</LessonSection>

			<LessonSection id="swr" {...at(SWR, "useSWR<{ members: string[] }>")}>
				<h2>取得は道具に任せる</h2>

				<p>
					そこで、データ取得専用の道具を使います。デモでは{" "}
					<strong>SWR</strong> を使っています。
				</p>

				<StaticCode
					lang="ts"
					code={`const { data, error, isLoading, mutate } = useSWR("/api/members", fetcher);`}
				/>

				<p>
					<strong>この 1 行に、さっきの state 3 つが全部入っています。</strong>
					さらに <code>mutate</code>（取り直す）まで付いてきます。
				</p>

				<DemoCard
					title="SWR に任せる"
					tone="good"
					sourcePath={SWR}
					showRenderCount
					description="取り直すボタンが動く。押すたびに違う人が返る"
				>
					<WithSwr />
				</DemoCard>

				<p>
					さきほど挙げた要求も、ほとんどが最初から入っています。
					タブに戻ったときの再取得も、同じ URL の重複防止も、
					<strong>自分では書きません</strong>。
				</p>

				<Callout variant="point" title="キーが同じなら、データも同じ">
					<p>
						<code>{'useSWR("/api/members", ...)'}</code> の第 1 引数はキーです。
						<strong>アプリのどこでも、同じキーなら同じデータが共有されます。</strong>
					</p>
					<p>
						つまり、これだけで Context を使わずに
						「サーバーのデータをアプリ全体で共有する」が実現します。
						バケツリレーも Provider も要りません。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="not-state" {...at(SWR, "const { data, error, isLoading, mutate }")}>
				<h2>state として持たない</h2>

				<p>ここが、この章でいちばん大事なところです。</p>

				<StaticCode
					lang="ts"
					code={`// ✕ 取ってきたデータを state に写す
const { data } = useSWR("/api/members", fetcher);
const [members, setMembers] = useState([]);

useEffect(() => {
  if (data) setMembers(data.members);
}, [data]);`}
				/>

				<p>
					Part 6 でやった<strong>「props を state に写す」</strong>
					とまったく同じ間違いです。
					写した瞬間に<strong>二重管理</strong>が始まります。
				</p>

				<p>
					サーバーのデータは、こちらが持ち主ではありません。
					<strong>いつでも取り直せる「写し」</strong>として扱います。
					自分の state にしてしまうと、
					向こうが変わったことに気づけなくなります。
				</p>

				<Callout variant="point" title="2 種類の状態">
					<ul>
						<li>
							<strong>自分の状態</strong> …{" "}
							入力中の文字、開いているタブ。持ち主は自分。<code>useState</code> で持つ
						</li>
						<li>
							<strong>サーバーの状態</strong> …{" "}
							ユーザー一覧、商品情報。持ち主は向こう。
							<strong>取得の道具に任せて、state にしない</strong>
						</li>
					</ul>
					<p>
						この 2 つは、記事や求人票では
							<strong>サーバー状態</strong> / <strong>クライアント状態</strong>
							と呼ばれます。見かけたらこの話だと思ってください。
						</p>
						<p>
							この 2 つを混ぜないことが、
						データ取得まわりを散らかさない最大のコツです。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="alternatives" {...at(SWR, 'useSWR<{ members: string[] }>')}>
				<h3>ほかの選択肢</h3>

				<ul>
					<li>
						<strong>TanStack Query</strong> …{" "}
						SWR と同じ役割で、より多機能。大きなアプリで選ばれることが多い
					</li>
					<li>
						<strong>Server Component</strong> …{" "}
						Next.js なら、そもそもサーバー側でデータを取って
						完成した画面を送れます。<strong>取得の状態管理自体がなくなります</strong>
					</li>
				</ul>

				<StaticCode
					code={`// Server Component なら、これだけで済む
async function MemberList() {
  const members = await getMembers();
  return <ul>{members.map(...)}</ul>;
}`}
				/>

				<p>
					読み込み中も、失敗も、二重管理も出てきません。
					<strong>まずこれで済まないかを考える</strong>のが、いまの標準的な進め方です。
				</p>

				<p>
					SWR や TanStack Query が要るのは、
					<strong>ブラウザ側で取り直したいとき</strong>です。
					検索、無限スクロール、定期更新など、操作に応じて何度も取りに行く場面になります。
				</p>
			</LessonSection>

			<LessonSection id="quiz" {...at(SWR, "const { data, error, isLoading, mutate }")}>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="サーバーから取ってきたデータを useState に入れるべき？"
					options={[
						{
							label: "入れない。持ち主は向こうなので、取り直せる写しとして扱う",
							correct: true,
							explanation:
								"state に写すと二重管理になり、向こうが変わったことに気づけなくなります。props を state に写すのと同じ間違いです。",
						},
						{
							label: "入れる。画面に出すものは state にする決まりだから",
							explanation:
								"そんな決まりはありません。表示するものでも、持ち主が自分でないなら state にしません。",
						},
						{
							label: "入れる。そうしないと画面が更新されない",
							explanation:
								"取得の道具が更新を面倒みてくれます。自分で state にする必要はありません。",
						},
					]}
				/>

				<Quiz
					question="useSWR のキーが同じだと何が起きる？"
					options={[
						{
							label: "アプリのどこで呼んでも、同じデータが共有される",
							correct: true,
							explanation:
								"Context を使わずにサーバーのデータを共有できます。重複した取得も防いでくれます。",
						},
						{
							label: "2 回取得しに行ってしまう",
							explanation:
								"逆です。同じキーならまとめられ、無駄な取得は起きません。",
						},
						{
							label: "エラーになる",
							explanation:
								"エラーにはなりません。同じキーで共有するのが、この仕組みの利点です。",
						},
					]}
				/>
			</LessonSection>

			<LessonSection id="summary" {...at(SWR, "const { data, error, isLoading, mutate }")}>
				<h2>この章のまとめ</h2>

				<ul>
					<li>
						サーバーのデータは<strong>持ち主が向こうにある「写し」</strong>
					</li>
					<li>
						自分で書くと、読み込み中・失敗・取り直し・重複防止を
						全部作り込むことになる
					</li>
					<li>
						SWR などの道具に任せると、その全部が 1 行に収まる
					</li>
					<li>
						<strong>取ってきたデータを state に写さない。</strong>二重管理になる
					</li>
					<li>
						Next.js なら、まず<strong>Server Component で済まないか</strong>を考える
					</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
