import { Callout } from "@/components/lesson/callout";
import { LessonFooter } from "@/components/lesson/lesson-footer";
import { LessonHeader } from "@/components/lesson/lesson-header";
import { LessonSection } from "@/components/lesson/lesson-section";
import { LessonShell } from "@/components/lesson/lesson-shell";
import { Quiz } from "@/components/lesson/quiz";
import { StaticCode } from "@/components/lesson/static-code";
import { focus, loadSnippets } from "@/lib/code";
import { findLesson } from "@/lib/curriculum";
import type { Metadata } from "next";

const SLUG = "choosing-libraries";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{
		path: "lessons/custom-hooks/demos/use-window-width.ts",
		label: "use-window-width.ts",
	},
	{ path: "lessons/debounce/demos/debounced.tsx", label: "debounced.tsx" },
] as const;

const [HOOK, DEBOUNCED] = SOURCES.map((source) => source.path);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					この教材で、いくつものライブラリを使ってきました。
					nuqs、use-local-storage-state、SWR、
					React Hook Form、zod、use-debounce。
				</p>
				<p>
					どれも<strong>自分で書けるもの</strong>です。
					実際、<code>useDebounce</code> の中身は数行でした。
				</p>
				<p>
					では、どこで線を引くのか。その話をして終わります。
				</p>
			</LessonHeader>

			<LessonSection id="cost" {...at(HOOK, "export function useWindowWidth")}>
				<h2>入れることには値段がある</h2>

				<p>
					ライブラリを 1 つ入れると、次のものが付いてきます。
				</p>

				<ul>
					<li>
						<strong>読む人が覚えること</strong>が 1 つ増える
					</li>
					<li>
						<strong>更新の面倒</strong>が 1 つ増える。
						React が上がったとき、これも追いつく必要がある
					</li>
					<li>
						<strong>壊れたときに自分で直せない</strong>可能性
					</li>
					<li>ブラウザに送られるコードが増える</li>
				</ul>

				<p>
					だから<strong>「便利そうだから入れる」は理由になりません</strong>。
					払う値段に見合う困りごとが、先にある必要があります。
				</p>

				<Callout variant="point" title="判断の順番">
					<ol>
						<li>
							<strong>そもそも要るか。</strong>
							React の標準機能で足りないか
						</li>
						<li>
							<strong>自分で書くと何行か。</strong>
							10 行で済むなら書いたほうが早いことも多い
						</li>
						<li>
							<strong>間違えたときに気づけるか。</strong>
							気づけない種類のものは、任せる価値が高い
						</li>
					</ol>
				</Callout>

				<p>
					3 つめが実は決定的です。並べてみます。
				</p>

				<ul>
					<li>
						<strong>気づける間違い</strong> …{" "}
						メールアドレスの形を間違えて判定していれば、
						試した瞬間に分かります。直せます
					</li>
					<li>
						<strong>気づけない間違い</strong> …{" "}
						Part 9 で見た「古い結果が後から届いて上書きする」。
						<strong>たまにしか起きず、再現もできません</strong>
					</li>
				</ul>

				<p>
					自分で書いてよいのは前者です。
					<strong>後者を自分で正しく書き切るのは、かなり難しい。</strong>
					SWR のような道具に任せる価値があるのは、まさにここです。
				</p>

				<p>
					<code>useWindowWidth</code> のようなものは、
					間違えても<strong>影響がその 1 か所に閉じます</strong>。
					これも自分で書いてよい側です。
				</p>
			</LessonSection>

			<LessonSection id="check" {...at(DEBOUNCED, "import { useDebounce }")}>
				<h2>入れると決めたら、何を見るか</h2>

				<p>
					同じことをするライブラリは、たいてい複数あります。
					選ぶときに見るのは、だいたいこの 4 つです。
				</p>

				<div className="not-prose my-6 overflow-x-auto">
					<table className="w-full min-w-[34rem] border-collapse text-sm">
						<thead>
							<tr className="border-b">
								<th className="p-3 text-left font-semibold">見るもの</th>
								<th className="p-3 text-left font-semibold">
									何が分かるか
								</th>
							</tr>
						</thead>
						<tbody className="text-muted-foreground">
							<tr className="border-b">
								<td className="p-3 font-medium text-foreground">
									最終更新日
								</td>
								<td className="p-3">
									1 年以上前で止まっていたら、React の新しい版で
									動かなくなる恐れがある
								</td>
							</tr>
							<tr className="border-b">
								<td className="p-3 font-medium text-foreground">
									未解決の Issue
								</td>
								<td className="p-3">
									数より中身。困っている人に返事があるか
								</td>
							</tr>
							<tr className="border-b">
								<td className="p-3 font-medium text-foreground">
									週あたりの利用数
								</td>
								<td className="p-3">
									多いほど、困ったときに答えが見つかる
								</td>
							</tr>
							<tr>
								<td className="p-3 font-medium text-foreground">
									TypeScript の型
								</td>
								<td className="p-3">
									同梱されているか。別パッケージなら一手間増える
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<Callout variant="warn" title="星の数は当てにならない">
					<p>
						GitHub の星は<strong>過去の人気</strong>です。
						いま動いているかどうかとは関係ありません。
					</p>
					<p>
						星 2 万でも 2 年更新されていないものより、
						星 3 千で先月更新されているもののほうが安全なことがあります。
					</p>
				</Callout>

				<h3>抜けられるかどうか</h3>

				<p>
					もう 1 つ、見落とされがちな観点があります。
					<strong>やめたくなったとき、どれくらい大変か</strong>です。
				</p>

				<StaticCode
					lang="ts"
					code={`// 抜けやすい: 使っている場所が限られる
const [debounced] = useDebounce(keyword, 500);

// 抜けにくい: アプリ全体の書き方がそれに合わせて決まる
// （状態管理ライブラリ、ルーティング、UI フレームワーク）`}
				/>

				<p>
					抜けやすいものは、気軽に入れてかまいません。
					<strong>抜けにくいものほど、慎重に選びます。</strong>
				</p>
			</LessonSection>

			<LessonSection id="list" {...at(DEBOUNCED, "const [debouncedKeyword] = useDebounce")}>
				<h2>この教材で使ったもの</h2>

				<p>
					それぞれ、どの困りごとに対する答えだったかを並べておきます。
				</p>

				<div className="not-prose my-6 overflow-x-auto">
					<table className="w-full min-w-[38rem] border-collapse text-sm">
						<thead>
							<tr className="border-b">
								<th className="p-3 text-left font-semibold">名前</th>
								<th className="p-3 text-left font-semibold">困りごと</th>
								<th className="p-3 text-left font-semibold">章</th>
							</tr>
						</thead>
						<tbody className="text-muted-foreground">
							<tr className="border-b">
								<td className="p-3 font-mono text-foreground">nuqs</td>
								<td className="p-3">
									URL の読み書きが、型変換込みで面倒
								</td>
								<td className="p-3">Part 9</td>
							</tr>
							<tr className="border-b">
								<td className="p-3 font-mono text-foreground">
									use-local-storage-state
								</td>
								<td className="p-3">
									素で書くとサーバー側で落ちる。保存の書き忘れ
								</td>
								<td className="p-3">Part 9</td>
							</tr>
							<tr className="border-b">
								<td className="p-3 font-mono text-foreground">swr</td>
								<td className="p-3">
									読み込み中・失敗・取り直し・重複防止・順序の入れ替わり
								</td>
								<td className="p-3">Part 9</td>
							</tr>
							<tr className="border-b">
								<td className="p-3 font-mono text-foreground">
									react-hook-form
								</td>
								<td className="p-3">
									項目が増えたフォーム。1 文字ごとの描き直し
								</td>
								<td className="p-3">Part 10</td>
							</tr>
							<tr className="border-b">
								<td className="p-3 font-mono text-foreground">zod</td>
								<td className="p-3">
									型と検査がずれる。外から来た値を確かめられない
								</td>
								<td className="p-3">Part 10</td>
							</tr>
							<tr>
								<td className="p-3 font-mono text-foreground">
									use-debounce
								</td>
								<td className="p-3">打つたびに処理が走る</td>
								<td className="p-3">Part 10</td>
							</tr>
						</tbody>
					</table>
				</div>

				<p>
					<strong>どれも「困りごとが先」です。</strong>
					ライブラリを知ってから使い道を探したものは、1 つもありません。
				</p>

				<Callout variant="note" title="ここに入れなかったもの">
					<p>
						状態管理ライブラリ（Zustand、Jotai など）は扱いませんでした。
					</p>
					<p>
						<strong>Part 9 の 4 つで、たいていは足ります。</strong>
						サーバーのデータは SWR、共有したい設定は URL かブラウザ保存、
						残りは <code>useState</code> と Context。
					</p>
					<p>
						それでも足りないと<strong>実際に困ってから</strong>調べれば、
						そのときには何が欲しいかが自分で言えるはずです。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="quiz" {...at(HOOK, "export function useWindowWidth")}>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="自分で書くか、ライブラリに任せるか。決め手になるのは？"
					options={[
						{
							label: "間違えたときに気づけるかどうか",
							correct: true,
							explanation:
								"すぐ壊れて気づくものは自分で書けます。たまにしか起きない不具合になるものは、任せる価値が高いです。",
						},
						{
							label: "行数が多いかどうか",
							explanation:
								"目安にはなりますが決め手ではありません。短くても間違えやすいものはあります。",
						},
						{
							label: "有名かどうか",
							explanation:
								"有名でも、自分の困りごとに合っていなければ意味がありません。",
						},
					]}
				/>

				<Quiz
					question="GitHub の星が多いライブラリは安全？"
					options={[
						{
							label: "とは限らない。星は過去の人気で、いま動くかは別",
							correct: true,
							explanation:
								"最終更新日のほうが重要です。星 2 万でも 2 年止まっているものより、星 3 千で先月更新のほうが安全なことがあります。",
						},
						{
							label: "安全。多くの人が使っている証拠",
							explanation:
								"過去に多くの人が興味を持った証拠にすぎません。",
						},
						{
							label: "安全。星が多いとバグが早く直る",
							explanation:
								"直す人が動いていなければ、星の数は関係ありません。",
						},
					]}
				/>

				<Quiz
					question="慎重に選ぶべきなのはどんなライブラリ？"
					options={[
						{
							label: "アプリ全体の書き方がそれに合わせて決まるもの",
							correct: true,
							explanation:
								"やめるときのコストが高いためです。使う場所が限られるものは気軽に入れてかまいません。",
						},
						{
							label: "ファイルサイズが大きいもの",
							explanation:
								"考慮点ではありますが、抜けられるかどうかのほうが影響は大きいです。",
						},
						{
							label: "作者が個人のもの",
							explanation:
								"個人でもよく保守されているものは多くあります。組織かどうかより、動いているかどうかです。",
						},
					]}
				/>
			</LessonSection>

			<LessonSection id="summary" {...at(DEBOUNCED, "const [debouncedKeyword] = useDebounce")}>
				<h2>この章のまとめ</h2>

				<ul>
					<li>
						ライブラリには<strong>値段がある</strong>。
						覚えること、更新、直せないリスク
					</li>
					<li>
						判断は<strong>そもそも要るか → 何行で書けるか →
						間違いに気づけるか</strong>の順
					</li>
					<li>
						選ぶときは<strong>最終更新日</strong>を最初に見る。星の数ではない
					</li>
					<li>
						<strong>抜けにくいものほど慎重に</strong>選ぶ
					</li>
					<li>
						<strong>困りごとが先、ライブラリは後</strong>
					</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
