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

const SLUG = "react-compiler";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{ path: "lessons/usecallback/demos/with-callback.tsx", label: "with-callback.tsx" },
] as const;

const [WITH] = SOURCES.map((source) => source.path);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					この Part で 3 つの道具を見てきました。
					<code>memo</code>、<code>useMemo</code>、<code>useCallback</code>。
				</p>
				<p>
					正直なところ、<strong>面倒だと思いませんでしたか。</strong>
					それは正しい感覚です。
				</p>
				<p>
					React チームも同じことを考えました。
					そして<strong>この 3 つを自動で書いてくれる仕組み</strong>を作りました。
					それが React Compiler です。
				</p>
			</LessonHeader>

			<LessonSection id="what" {...at(WITH, "useCallback(() => setSaved")}>
				<h2>何をしてくれるのか</h2>

				<p>
					React Compiler は、ビルドのときにコードを読んで、
					<strong>必要な場所に自動でメモ化を入れます</strong>。
				</p>

				<StaticCode
					code={`// 自分で書くコード
function Counter() {
  const [count, setCount] = useState(0);
  const handleSave = () => save(count);

  return <Child onSave={handleSave} />;
}

// コンパイラが変換したあと（イメージ）
// handleSave は count が変わったときだけ作り直される`}
				/>

				<p>
					つまり、<strong>この Part でやってきたことを、書かなくてよくなります</strong>。
					<code>useCallback</code> も <code>useMemo</code> も
					<code>memo</code> も、自分で書く必要がなくなります。
				</p>

				<Callout variant="point" title="手で書くより丁寧">
					<p>
						人間は「ここは重そうだ」という勘で判断しますが、
						コンパイラは<strong>すべての値について機械的に判断します</strong>。
						包み忘れも、無駄な包みすぎも起きません。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="still-need" {...at(WITH, "const Child = memo(")}>
				<h2>では、この 3 章は無駄だったのか</h2>

				<p>
					<strong>まったく無駄ではありません。</strong>
					理由は 3 つあります。
				</p>

				<h3>1. まだ全部のプロジェクトで使えるわけではない</h3>

				<p>
					導入されていないプロジェクトはたくさんあります。
					既存のコードを読むときにも、<code>memo</code> や{" "}
					<code>useCallback</code> は出てきます。
					<strong>読めなければ話になりません。</strong>
				</p>

				<h3>2. 効かない場所がある</h3>

				<p>
					コンパイラは、React のルールを守って書かれたコードにしか適用されません。
					レンダリング中に値を書き換えているような、
					<strong>ルール違反のコードは対象外</strong>になります。
				</p>

				<p>
					「なぜかコンパイラが効いていない」となったとき、
					原因を探せるかどうかは、この 3 章を理解しているかで決まります。
				</p>

				<h3>3. 何が起きているか分からないまま使うことになる</h3>

				<p>
					自動化された仕組みは、うまく動いている間は考えなくて済みます。
					問題は<strong>うまく動かなかったとき</strong>です。
				</p>

				<Callout variant="point" title="この教材が Compiler を無効にしている理由">
					<p>
						この教材のプロジェクトは、<strong>意図的に無効</strong>にしてあります。
						有効にすると、<code>memo</code> / <code>useMemo</code> /{" "}
						<code>useCallback</code> の各章のデモで
						<strong>「memo なし」も自動でメモ化されてしまい、差が消える</strong>からです。
					</p>
					<p>
						仕組みを学ぶには、自動化を切っておく必要があります。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="how" {...at(WITH, "const Child = memo(")}>
				<h3>使ってみるには</h3>

				<StaticCode
					lang="bash"
					code={`# コンパイラ本体を入れて
bun add -D babel-plugin-react-compiler`}
				/>

				<StaticCode
					lang="ts"
					code={`// next.config.ts — 設定はこの 1 行
const nextConfig: NextConfig = {
  reactCompiler: true,
};`}
				/>

				<p>
					React Compiler は 1.0 で安定版になり、
					Next.js 16 では設定項目から <code>experimental</code> が取れました。
					<strong>もう実験的な機能ではありません</strong>。
					（古い記事にある <code>experimental: {"{ reactCompiler: true }"}</code>{" "}
					は Next.js 15 までの書き方です）
				</p>

				<p>
					導入したら、<strong>既存の <code>useMemo</code> や{" "}
					<code>useCallback</code> は、動作を確かめながら少しずつ外していけます</strong>。
					一度に全部消さないでください。
					さきほど見たとおり、コンパイラは
					<strong>React の決まりを守れていない場所では手を出しません</strong>。
					そこだけは自分のメモ化が効いていた、ということがあり得ます。
				</p>

				<Callout variant="note" title="これからどうなるか">
					<p>
						手でメモ化を書く時代は、少しずつ終わりに向かっています。
						ただし<strong>「なぜメモ化が必要だったのか」という理解は残ります</strong>。
					</p>
					<p>
						道具が変わっても、
						「React は同じものかどうかだけを見る」という仕組みは変わりません。
						そこさえ押さえていれば、道具の変化にはついていけます。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="quiz" {...at(WITH, "useCallback(() => setSaved")}>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="React Compiler を導入すると何が変わる？"
					options={[
						{
							label: "memo / useMemo / useCallback を自分で書かなくてよくなる",
							correct: true,
							explanation:
								"ビルド時に自動でメモ化が入ります。人間の勘より機械的で、包み忘れも包みすぎも起きません。",
						},
						{
							label: "再レンダリング自体が起きなくなる",
							explanation:
								"再レンダリングはこれまでどおり起きます。無駄な描き直しが減るだけです。",
						},
						{
							label: "React の書き方そのものが変わる",
							explanation:
								"書き方は変わりません。むしろメモ化を書かなくてよくなるぶん、素直な形に戻ります。",
						},
					]}
				/>

				<Quiz
					question="Compiler があるなら、memo や useCallback は学ばなくてよい？"
					options={[
						{
							label: "学ぶ必要がある。既存コードを読むときと、効かないときの原因究明に要る",
							correct: true,
							explanation:
								"導入していないプロジェクトは多く、ルール違反のコードには適用されません。うまく動かないときに原因を探せるかどうかが分かれ目です。",
						},
						{
							label: "学ばなくてよい。自動化されるので不要",
							explanation:
								"自動化された仕組みは、うまく動かなかったときに理解が要ります。読む機会もなくなりません。",
						},
						{
							label: "学ばなくてよいが、面接で聞かれるので覚えておく",
							explanation:
								"面接のためではありません。実際に困る場面があるから学びます。",
						},
					]}
				/>
			</LessonSection>

			<LessonSection id="summary" {...at(WITH, "useCallback(() => setSaved")}>
				<h2>この章のまとめ</h2>

				<ul>
					<li>
						React Compiler は、
						<strong>メモ化を自動で入れてくれる仕組み</strong>
					</li>
					<li>人間の勘より機械的なので、包み忘れも包みすぎも起きない</li>
					<li>
						ただし<strong>既存コードを読むとき</strong>と
						<strong>効かないときの原因究明</strong>には、手で書く知識が要る
					</li>
					<li>
						道具が変わっても、
						<strong>「React は同じものかどうかだけを見る」</strong>という仕組みは変わらない
					</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
