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
import { ClientPart } from "./demos/client-part";
import { ServerPart } from "./demos/server-part";

const SLUG = "server-components";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{
		path: "lessons/server-components/demos/server-part.tsx",
		label: "server-part.tsx",
	},
	{
		path: "lessons/server-components/demos/client-part.tsx",
		label: "client-part.tsx",
	},
] as const;

const [SERVER, CLIENT] = SOURCES.map((source) => source.path);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					ここまでずっと、
					<strong>コンポーネント＝ブラウザで動く関数</strong>
					だと思って読んできたはずです。
				</p>
				<p>
					<strong>半分は違います。</strong>
					いまの React には、
					<strong>サーバーで動くコンポーネント</strong>があります。
				</p>
				<p>
					この Part では「データをどこに置くか」を扱いますが、
					その前にこの土台をはっきりさせておきます。
					<strong>ここを飛ばすと、このあとの 4 章がぼやけます。</strong>
				</p>
			</LessonHeader>

			<LessonSection id="two-kinds" {...at(CLIENT, '"use client";')}>
				<h2>境目は、たった 1 行</h2>

				<StaticCode lang="ts" code={`"use client";`} />

				<p>
					ファイルのいちばん上にこの 1 行があるかどうか。
					<strong>それだけで、どこで動くかが決まります</strong>。
				</p>

				<div className="not-prose my-6 overflow-x-auto">
					<table className="w-full min-w-[36rem] border-collapse text-sm">
						<thead>
							<tr className="border-b">
								<th className="p-3 text-left font-semibold" />
								<th className="p-3 text-left font-semibold">
									Server Component
								</th>
								<th className="p-3 text-left font-semibold">
									Client Component
								</th>
							</tr>
						</thead>
						<tbody className="text-muted-foreground">
							<tr className="border-b">
								<td className="p-3 font-medium text-foreground">書き方</td>
								<td className="p-3">何も書かない（こちらが既定）</td>
								<td className="p-3 font-mono">&quot;use client&quot;</td>
							</tr>
							<tr className="border-b">
								<td className="p-3 font-medium text-foreground">動く場所</td>
								<td className="p-3">サーバー</td>
								<td className="p-3">ブラウザ</td>
							</tr>
							<tr className="border-b">
								<td className="p-3 font-medium text-foreground">実行の回数</td>
								<td className="p-3">1 回だけ</td>
								<td className="p-3">state が変わるたび何度でも</td>
							</tr>
							<tr className="border-b">
								<td className="p-3 font-medium text-foreground">
									useState / onClick
								</td>
								<td className="p-3">使えない</td>
								<td className="p-3">
									<span className="text-foreground">使える</span>
								</td>
							</tr>
							<tr>
								<td className="p-3 font-medium text-foreground">
									コードが届く先
								</td>
								<td className="p-3">
									<span className="text-foreground">
										ブラウザに送られない
									</span>
								</td>
								<td className="p-3">ブラウザに送られる</td>
							</tr>
						</tbody>
					</table>
				</div>

				<p>
					<strong>既定はサーバー側です。</strong>
					何も書かなければサーバーで動きます。
					<code>&quot;use client&quot;</code> は
					<strong>「ここから先はブラウザにも渡してください」という申告</strong>です。
				</p>
			</LessonSection>

			<LessonSection id="demo" {...at(SERVER, "export function ServerPart")}>
				<h2>並べて見る</h2>

				<p>
					外側がブラウザ側、中に入っている枠がサーバー側です。
				</p>

				<DemoCard
					title="サーバーで作ったものを、ブラウザ側の部品に置く"
					sourcePath={CLIENT}
					description="押すと上の枠だけが光る。下の枠は光らない"
				>
					<ClientPart>
						<ServerPart />
					</ClientPart>
				</DemoCard>

				<p>
					ボタンを押すと、<strong>上の枠だけが光ります</strong>。
					下の点線の枠は、何度押しても光りません。
					<strong>数字すら出ていません。</strong>
				</p>

				<p>
					<strong>サーバー側の部品は、もう終わっているからです。</strong>
					すでに出来上がった結果が置いてあるだけで、
					実行されるコードはそこにありません。
				</p>

				<Callout variant="note" title="光らない理由は、じつは 2 つ重なっています">
					<p>
						Part 8 で「children として渡したものは描き直されない」を
						やりました。このデモもその形なので、
						<strong>サーバー側でなくても光りません</strong>。
					</p>
					<p>
						ですので、<strong>光るかどうかは決め手になりません</strong>。
						決め手は<strong>数字がそもそも出ていないこと</strong>です。
						数えるには<strong>ブラウザで動くコードが要ります</strong>。
						サーバー側の部品には、それが 1 行も届いていません。
					</p>
				</Callout>

</LessonSection>

			<LessonSection id="compose" {...at(CLIENT, "{ children }: { children: ReactNode }")}>
				<h2>組み合わせ方の決まり</h2>

				<p>
					ここが引っかかりやすいところです。
				</p>

				<StaticCode
					lang="ts"
					code={`// ✕ ブラウザ側の中で、サーバー側の部品を import する
"use client";
import { ServerPart } from "./server-part";   // エラーは出ない。だが巻き込まれる`}
				/>

				<p>
					<code>&quot;use client&quot;</code> の中で読み込んだものは、
					<strong>すべてブラウザ側になってしまいます</strong>。
					境目は<strong>ファイル単位</strong>だからです。
				</p>

				<p>では、さっきのデモはどうやっていたのか。</p>

				<StaticCode
					lang="ts"
					code={`// ◯ 外側（サーバー側）で組み立てて、children として渡す
<ClientPart>
  <ServerPart />
</ClientPart>`}
				/>

				<p>
					<strong>Part 2 でやった children です。</strong>
					<code>ClientPart</code> は中身が何かを知りません。
					渡された<strong>出来上がったもの</strong>を置くだけです。
				</p>

				<Callout variant="note" title="Part 8 とまったく同じ形">
					<p>
						「children として受け取れば、中身は作り直されない」。
						これは Part 8 の
						<strong>「children で切り離す」</strong>とそっくりです。
					</p>
					<p>
						あちらは<strong>描き直しを避ける</strong>ため、
						こちらは<strong>実行する場所を分ける</strong>ため。
						目的は違いますが、
						<strong>効く理屈は同じ</strong>です。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="this-site" {...at(SERVER, "const SECRET_NOTE")}>
				<h3>この教材も、そうなっています</h3>

				<p>
					いま読んでいるこのページ自体が Server Component です。
					<strong>本文も見出しも、サーバーで作られています。</strong>
				</p>

				<p>
					<code>&quot;use client&quot;</code> が付いているのは、
					<strong>操作が要るところだけ</strong>です。
				</p>

				<ul>
					<li>デモ（押すと動くもの）</li>
					<li>クイズ（選ぶと答え合わせをするもの）</li>
					<li>右のコードペイン（スクロールに追従するもの）</li>
				</ul>

				<p>
					右ペインに出ているコードも、
					<strong>サーバー側でファイルを読んで色を付けたもの</strong>です。
					色付けの処理はブラウザに送られていません。
				</p>

				<Callout variant="warn" title="このあとの章で効いてきます">
					<ul>
						<li>
							<strong>URL に state を置く</strong> …{" "}
							組み立てる時点では URL が決まっていない、という話が出てきます
						</li>
						<li>
							<strong>ブラウザに保存する</strong> …{" "}
							サーバーには <code>localStorage</code> が存在しません
						</li>
						<li>
							<strong>サーバーのデータ</strong> …{" "}
							そもそもサーバー側で取れるなら、それが先です
						</li>
					</ul>
					<p>
						どれも<strong>「どこで動いているか」</strong>の話です。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="quiz" {...at(CLIENT, '"use client";')}>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="何も書かないコンポーネントは、どこで動く？"
					options={[
						{
							label: "サーバー",
							correct: true,
							explanation:
								"既定はサーバー側です。ブラウザで動かしたいときだけ \"use client\" と申告します。",
						},
						{
							label: "ブラウザ",
							explanation:
								"逆です。ブラウザ側にしたいときは、明示的に書く必要があります。",
						},
						{
							label: "両方で動く",
							explanation:
								"どちらか一方です。ファイル単位で決まります。",
						},
					]}
				/>

				<Quiz
					question="サーバー側の部品で useState が使えないのはなぜ？"
					options={[
						{
							label: "そのコードがブラウザに送られないから",
							correct: true,
							explanation:
								"サーバーで 1 回実行され、結果だけが届きます。ブラウザで動くコードがないので、押しても実行するものがありません。",
						},
						{
							label: "React がわざと禁止しているから",
							explanation:
								"禁止というより、成り立たないためです。",
						},
						{
							label: "サーバーでは変数が使えないから",
							explanation:
								"使えます。使えないのは「あとで変わる値」です。",
						},
					]}
				/>

				<Quiz
					question="ブラウザ側の部品の中に、サーバー側の部品を置きたい。どうする？"
					options={[
						{
							label: "外側で組み立てて、children として渡す",
							correct: true,
							explanation:
								"import すると、読み込んだ側と同じ扱いになってしまいます。出来上がったものを渡せば、そのまま置けます。",
						},
						{
							label: 'ブラウザ側のファイルで import する',
							explanation:
								"エラーにはなりません。ですが \"use client\" の中で読み込んだものは、すべてブラウザ側になります。黙って巻き込まれるぶん、かえって気づきにくい間違いです。",
						},
						{
							label: "サーバー側の部品にも \"use client\" を書く",
							explanation:
								"書いた時点でブラウザ側になるので、分ける意味がなくなります。",
						},
					]}
				/>
			</LessonSection>

			<LessonSection id="summary" {...at(CLIENT, '"use client";')}>
				<h2>この章のまとめ</h2>

				<ul>
					<li>
						境目は <code>&quot;use client&quot;</code> の 1 行。
						<strong>既定はサーバー側</strong>
					</li>
					<li>
						サーバー側は<strong>1 回だけ実行され、結果だけが届く</strong>。
						そのコードはブラウザに送られない
					</li>
					<li>
						だから <code>useState</code> も <code>onClick</code> も使えない
					</li>
					<li>
						組み合わせるときは
						<strong>import せず、children として渡す</strong>
					</li>
					<li>
						この教材のページ自体も、ほとんどがサーバー側
					</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
