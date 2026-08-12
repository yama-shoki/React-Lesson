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
import { PropDrilling } from "./demos/prop-drilling";
import { WithContext } from "./demos/with-context";

const SLUG = "context";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{ path: "lessons/context/demos/prop-drilling.tsx", label: "prop-drilling.tsx" },
	{ path: "lessons/context/demos/with-context.tsx", label: "with-context.tsx" },
] as const;

const [DRILLING, CONTEXT] = SOURCES.map((source) => source.path);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					Part 4 で「state はそれを使う部品すべてを含む、いちばん下に置く」
					と書きました。
				</p>
				<p>
					ところが実際のアプリでは、その「いちばん下」が
					<strong>かなり上のほうになる</strong>ことがあります。
					ログイン中のユーザー、テーマの設定、言語。
					アプリのどこからでも使いたいものです。
				</p>
				<p>
					すると、間の部品が<strong>使いもしない props を受け渡すだけ</strong>
					になります。それを解決するのが Context です。
				</p>
			</LessonHeader>

			<LessonSection id="drilling" {...at(DRILLING, "function Sidebar({ user }")}>
				<h2>間の部品が、ただの通り道になる</h2>

				<p>
					<code>user</code> を使うのは、いちばん下の <code>Profile</code> だけです。
					ですが、そこへ届けるために <code>Layout</code> と{" "}
					<code>Sidebar</code> も受け取る必要があります。
				</p>

				<DemoCard
					title="props で下まで運ぶ"
					tone="bad"
					sourcePath={DRILLING}
					description="間の 2 つは user を使わないのに受け取っている"
				>
					<PropDrilling />
				</DemoCard>

				<p>
					これを<strong>バケツリレー</strong>と呼びます。
					深さが 2 段や 3 段なら大した問題ではありません。
					つらくなるのは次のような場合です。
				</p>

				<ul>
					<li>階層が 5 段、6 段と深くなる</li>
					<li>
						運ぶものが増える（user だけでなく theme、language も…）
					</li>
					<li>
						途中に部品を挟むたびに、<strong>全部の中継地点を書き換える</strong>必要がある
					</li>
				</ul>

				<p>
					とくに最後がつらい。
					<code>Sidebar</code> と <code>Profile</code> の間にもう 1 つ挟むだけで、
					そこにも props を書き足さなければなりません。
				</p>
			</LessonSection>

			<LessonSection id="context" {...at(CONTEXT, "const UserContext = createContext")}>
				<h2>置き場所を作って、直接取りに行く</h2>

				<p>
					Context は<strong>値の置き場所</strong>です。
					一度置けば、その内側にいる部品はどこからでも取り出せます。
					間の部品を経由しません。
				</p>

				<p>使うのは 3 つだけです。</p>

				<StaticCode
					lang="ts"
					code={`// 1. 置き場所を作る
const UserContext = createContext<string>("");

// 2. 値を置く（この中にいる部品が対象）
<UserContext value={user}>
  <Layout />
</UserContext>

// 3. 取り出す
const user = use(UserContext);`}
				/>

				<DemoCard
					title="Context で受け取る"
					tone="good"
					sourcePath={CONTEXT}
					description="Layout と Sidebar は user を知らない"
				>
					<WithContext />
				</DemoCard>

				<p>
					<code>Layout</code> と <code>Sidebar</code> から
					<strong>props が消えました</strong>。
					間に何段挟んでも、書き換える必要はありません。
				</p>

				<Callout variant="note" title="React 19 で書き方が短くなりました">
					<p>
						以前は <code>&lt;UserContext.Provider value=...&gt;</code> と
						書く必要がありましたが、<strong><code>.Provider</code> は不要</strong>になりました。
					</p>
					<p>
						取り出すほうは <code>use(UserContext)</code> と書けるようになりました。
						ただし <code>useContext(UserContext)</code> も
						<strong>いまも現役で、なくなる予定はありません</strong>。
						古い記事にこちらが出てきても、間違いではありません。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="custom-hook" {...at(CONTEXT, "const useUser = () =>")}>
				<h3>取り出す部分は関数にまとめる</h3>

				<p>
					デモでは、取り出す処理を <code>useUser</code> という関数にしています。
				</p>

				<StaticCode
					lang="ts"
					code={`const useUser = () => use(UserContext);`}
				/>

				<p>1 行ですが、これには意味があります。</p>

				<ul>
					<li>
						使う側が <code>UserContext</code> という置き場所の存在を知らなくて済む
					</li>
					<li>
						あとで「値がないときはエラーにする」といった処理を、
						<strong>ここ 1 か所に足せる</strong>
					</li>
				</ul>

				<StaticCode
					lang="ts"
					code={`// あとからこう強化できる
const useUser = () => {
  const user = use(UserContext);
  if (!user) throw new Error("UserContext の中で使ってください");
  return user;
};`}
				/>

				<p>
					Context を作るときは、
					<strong>この取り出し用の関数もセットで用意する</strong>のが定番です。
				</p>
			</LessonSection>

			<LessonSection id="caution" {...at(CONTEXT, "<UserContext value={user}>")}>
				<h2>ただし、すぐには使わない</h2>

				<Callout variant="warn" title="Context は最後の手段">
					<p>
						便利に見えますが、<strong>まずリフトアップで足ります</strong>。
						2 段や 3 段のバケツリレーは、問題ではありません。
					</p>
				</Callout>

				<p>Context を使うと、代わりに失うものがあります。</p>

				<ul>
					<li>
						<strong>どこから値が来ているか、コードを見ても分からなくなる</strong>。
						props なら渡している場所をたどれます
					</li>
					<li>
						その部品は<strong>Context の中でしか動かなくなる</strong>。
						単体で使い回せなくなります
					</li>
					<li>
						次の章でやるとおり、
						<strong>再レンダリングの範囲が広がりやすい</strong>
					</li>
				</ul>

				<p>
					Part 2 でやった<strong>合成</strong>で解決できることも多くあります。
					中身を親で組み立てて <code>children</code> として渡せば、
					そもそも中継が発生しません。
				</p>

				<Callout variant="point" title="使いどきの目安">
					<p>
						<strong>アプリ全体で共有するもの</strong>に限る。
						ログイン中のユーザー、テーマ、言語設定あたりです。
					</p>
					<p>
						画面ひとつの中で完結する値なら、
						リフトアップか合成で足ります。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="quiz" {...at(CONTEXT, "const useUser = () =>")}>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="Context を使うと何が解決する？"
					options={[
						{
							label: "間の部品が、使いもしない props を受け渡さなくて済む",
							correct: true,
							explanation:
								"値の置き場所を作り、必要な部品が直接取りに行く形になります。中継地点を書き換える必要がなくなります。",
						},
						{
							label: "再レンダリングが減る",
							explanation:
								"むしろ増えやすくなります。次の章で詳しく扱います。",
						},
						{
							label: "state を持たなくてよくなる",
							explanation:
								"state は必要です。Context はそれを配る仕組みであって、持つ仕組みではありません。",
						},
					]}
				/>

				<Quiz
					question="バケツリレーが 3 段ある。Context を使うべき？"
					options={[
						{
							label: "まだ使わない。3 段程度ならリフトアップや合成で足りる",
							correct: true,
							explanation:
								"Context は値の出どころが見えにくくなるという代償があります。アプリ全体で共有するものに限るのが目安です。",
						},
						{
							label: "使う。バケツリレーは常に避けるべき",
							explanation:
								"浅いバケツリレーは問題ではありません。props なら渡し元をたどれるという利点もあります。",
						},
						{
							label: "使う。段数に関係なく Context のほうが読みやすい",
							explanation:
								"読みやすさは逆になることもあります。どこから値が来ているかがコード上で追えなくなります。",
						},
					]}
				/>
			</LessonSection>

			<LessonSection id="summary" {...at(CONTEXT, "const UserContext = createContext")}>
				<h2>この章のまとめ</h2>

				<ul>
					<li>
						Context は<strong>値の置き場所</strong>。内側の部品がどこからでも取り出せる
					</li>
					<li>
						使うのは 3 つ。<code>createContext</code> /{" "}
						<code>&lt;Context value=...&gt;</code> / <code>use(Context)</code>
					</li>
					<li>取り出す関数をセットで用意しておくと、あとで強化できる</li>
					<li>
						<strong>最後の手段。</strong>
						まずリフトアップと合成を試す。使うならアプリ全体で共有するものに限る
					</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
