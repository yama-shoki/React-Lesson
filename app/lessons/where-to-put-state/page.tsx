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
import { Compare } from "./demos/compare";

const SLUG = "where-to-put-state";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{ path: "lessons/where-to-put-state/demos/compare.tsx", label: "compare.tsx" },
] as const;

const [COMPARE] = SOURCES.map((source) => source.path);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					この Part で、状態の置き場所を 4 つ見てきました。
					メモリ、URL、ブラウザの保存領域、サーバー。
				</p>
				<p>
					気づいたかもしれませんが、
					<strong>書き方はどれもほとんど同じでした</strong>。
					それは偶然ではありません。
				</p>
				<p>この章で、選び方をはっきりさせます。</p>
			</LessonHeader>

			<LessonSection id="same-shape" {...at(COMPARE, "const [inMemory, setInMemory]")}>
				<h2>形は同じ、置き場所が違うだけ</h2>

				<StaticCode
					lang="ts"
					code={`const [value, setValue] = useState("");
const [value, setValue] = useQueryState("key", { defaultValue: "" });
const [value, setValue] = useLocalStorageState("key", { defaultValue: "" });`}
				/>

				<p>
					<strong>並べてみると、まったく同じ形をしています。</strong>
					受け取るのは「いまの値」と「変える関数」。使い方も同じです。
				</p>

				<p>
					これは、それぞれのライブラリが
					<strong>わざと <code>useState</code> に似せて</strong>作られているからです。
					新しい置き場所を覚えるたびに、新しい書き方を覚え直す必要はありません。
				</p>

				<Callout variant="note" title="サーバーだけは形が違う">
					<p>
						4 つめのサーバーは、この仲間に入りません。
					</p>
					<StaticCode
						lang="ts"
						code={`const { data, error, isLoading, mutate } = useSWR(key, fetcher);`}
					/>
					<p>
						前の章で見たとおり、
						<strong>持ち主が自分ではない</strong>からです。
						読み込み中・失敗・取り直しが付いてくるぶん、
						受け取るものも増えます。
					</p>
				</Callout>

				<DemoCard
					title="3 つの置き場所を並べる"
					sourcePath={COMPARE}
					description="全部に入力してから、再読み込みしてみる"
				>
					<Suspense fallback={<p className="text-muted-foreground">読み込み中…</p>}>
						<Compare />
					</Suspense>
				</DemoCard>

				<p>再読み込みすると、はっきり分かれます。</p>

				<ul>
					<li>
						<strong>メモリ</strong> … 消えます
					</li>
					<li>
						<strong>URL</strong> … 残ります（アドレス欄にも出ています）
					</li>
					<li>
						<strong>ブラウザの保存領域</strong> … 残ります
					</li>
				</ul>

				<p>
					コードの形は同じでも、
					<strong>置き場所を変えるだけで振る舞いが変わります</strong>。
					だから「どこに置くか」は、あとから効いてくる選択になります。
				</p>
			</LessonSection>

			<LessonSection id="table" {...at(COMPARE, "useQueryState(")}>
				<h2>4 つの比較</h2>

				<div className="not-prose my-6 overflow-x-auto">
					<table className="w-full min-w-[36rem] border-collapse text-sm">
						<thead>
							<tr className="border-b">
								<th className="p-3 text-left font-semibold">置き場所</th>
								<th className="p-3 text-left font-semibold">リロード</th>
								<th className="p-3 text-left font-semibold">共有</th>
								<th className="p-3 text-left font-semibold">向いているもの</th>
							</tr>
						</thead>
						<tbody className="text-muted-foreground">
							<tr className="border-b">
								<td className="p-3 font-mono text-foreground">useState</td>
								<td className="p-3">消える</td>
								<td className="p-3">できない</td>
								<td className="p-3">入力途中、開閉の状態</td>
							</tr>
							<tr className="border-b">
								<td className="p-3 font-mono text-foreground">URL</td>
								<td className="p-3">残る</td>
								<td className="p-3">
									<span className="text-foreground">できる</span>
								</td>
								<td className="p-3">検索条件、並び順、タブ</td>
							</tr>
							<tr className="border-b">
								<td className="p-3 font-mono text-foreground">ブラウザ保存</td>
								<td className="p-3">残る</td>
								<td className="p-3">できない</td>
								<td className="p-3">表示設定、下書き</td>
							</tr>
							<tr>
								<td className="p-3 font-mono text-foreground">サーバー</td>
								<td className="p-3">残る</td>
								<td className="p-3">
									<span className="text-foreground">できる</span>
								</td>
								<td className="p-3">本物のデータ全般</td>
							</tr>
						</tbody>
					</table>
				</div>

				<p>
					<strong>下に行くほど「残る」度合いが強くなります。</strong>
					そして残るほど、扱いに気をつける必要が出てきます。
				</p>
			</LessonSection>

			<LessonSection id="how-to-choose" {...at(COMPARE, "useLocalStorageState(")}>
				<h2>選び方</h2>

				<p>
					上から順に問いかけて、最初に当てはまったところに置きます。
				</p>

				<Callout variant="point" title="4 つの問い">
					<ol>
						<li>
							<strong>それは本物のデータか？</strong>
							（ユーザー情報、商品、投稿）→ <strong>サーバー</strong>
						</li>
						<li>
							<strong>URL を送って、相手に同じ画面を見せたいか？</strong>
							→ <strong>URL</strong>
						</li>
						<li>
							<strong>次に来たときも覚えていてほしいか？</strong>
							→ <strong>ブラウザの保存領域</strong>
						</li>
						<li>
							どれでもない → <strong>useState</strong>
						</li>
					</ol>
				</Callout>

				<p>
					迷ったら <code>useState</code> で始めてかまいません。
					<strong>形が同じなので、あとから移すのが簡単だからです。</strong>
				</p>

				<StaticCode
					lang="ts"
					code={`// あとで URL に移したくなったら、1 行だけ書き換える
- const [keyword, setKeyword] = useState("");
+ const [keyword, setKeyword] = useQueryState("keyword", { defaultValue: "" });`}
				/>

				<p>
					使っている場所には手を触れません。
					これが「形を揃えてある」ことの実利です。
				</p>
			</LessonSection>

			<LessonSection id="context-place" {...at(COMPARE, "const [inUrl, setInUrl]")}>
				<h3>Context はどこに入るのか</h3>

				<p>
					この表に Context がないことに気づいたかもしれません。
					それには理由があります。
				</p>

				<Callout variant="warn" title="Context は置き場所ではない">
					<p>
						Context は<strong>値を配る仕組み</strong>であって、
						値を保管する場所ではありません。
					</p>
					<p>
						中身はたいてい <code>useState</code> です。
						つまり「メモリに置いたものを、遠くまで配る」ための道具です。
					</p>
				</Callout>

				<p>
					だから「Context に置くか、useState に置くか」という問いは、
					そもそも成り立ちません。正しくは
					<strong>「useState で持ったものを、Context で配るかどうか」</strong>です。
				</p>
			</LessonSection>

			<LessonSection id="quiz" {...at(COMPARE, "const [inMemory, setInMemory]")}>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="「文字を大きく表示する」という表示設定は、どこに置くのがよい？"
					options={[
						{
							label: "ブラウザの保存領域",
							correct: true,
							explanation:
								"その人のための設定なので、次に来たときも覚えていてほしい。ですが他人と共有する意味はありません。",
						},
						{
							label: "URL",
							explanation:
								"URL を送った相手にまで自分の文字サイズを押しつけることになります。共有して意味のある情報ではありません。",
						},
						{
							label: "サーバー",
							explanation:
								"ログインが要らないサイトでは置き場所がありません。この程度の設定にサーバーは大げさです。",
						},
					]}
				/>

				<Quiz
					question="「Context に置くか、useState に置くか」という問いは？"
					options={[
						{
							label: "成り立たない。Context は配る仕組みで、置き場所ではない",
							correct: true,
							explanation:
								"Context の中身はたいてい useState です。正しくは「useState で持ったものを Context で配るかどうか」です。",
						},
						{
							label: "成り立つ。Context のほうが広い範囲に置ける",
							explanation:
								"範囲の話ではありません。Context 自体は値を保管していません。",
						},
						{
							label: "成り立つ。Context のほうが速い",
							explanation:
								"速度の話でもありません。むしろ購読の範囲によっては描き直しが増えます。",
						},
					]}
				/>

				<Quiz
					question="useState / URL / ブラウザ保存の 3 つが、同じ書き方に似せてあるのはなぜ？"
					options={[
						{
							label: "あとから置き場所を移すとき、1 行の書き換えで済むようにするため",
							correct: true,
							explanation:
								"使っている場所には手を触れずに移せます。迷ったら useState で始められるのは、この設計のおかげです。",
						},
						{
							label: "偶然そうなっただけ",
							explanation:
								"意図的です。それぞれのライブラリが useState に合わせて作られています。",
						},
						{
							label: "React がそう決めているから",
							explanation:
								"React の決まりではありません。ライブラリ側が合わせているだけです。",
						},
					]}
				/>
			</LessonSection>

			<LessonSection id="summary" {...at(COMPARE, "const [inMemory, setInMemory]")}>
				<h2>この章のまとめ</h2>

				<ul>
					<li>
						置き場所は 4 つ。うち<strong>メモリ・URL・ブラウザ保存の 3 つは
						同じ書き方</strong>（サーバーだけは形が違う）
					</li>
					<li>
						選ぶ順番は、
						<strong>本物のデータか → 共有したいか → 覚えていてほしいか</strong>
					</li>
					<li>
						迷ったら <code>useState</code>。形が同じなので、あとから移すのは 1 行
					</li>
					<li>
						<strong>Context は置き場所ではなく、配る仕組み</strong>
					</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
