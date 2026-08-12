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
import { UrlState } from "./demos/url-state";

const SLUG = "url-state";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{ path: "lessons/url-state/demos/url-state.tsx", label: "url-state.tsx" },
] as const;

const [URL_STATE] = SOURCES.map((source) => source.path);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					状態を置く場所は、<code>useState</code> だけではありません。
				</p>
				<p>
					検索条件や、選んでいるタブ。
					こういうものを <code>useState</code> に入れると、
					<strong>リロードで消え、URL を送っても相手には伝わりません</strong>。
				</p>
				<p>
					置き場所を<strong>URL</strong> にすると、それが全部解決します。
				</p>
			</LessonHeader>

			<LessonSection id="demo" {...at(URL_STATE, "useQueryState(")}>
				<h2>書き方は useState とほぼ同じ</h2>

				<StaticCode
					lang="ts"
					code={`// いつもの
const [keyword, setKeyword] = useState("");

// 置き場所を URL にしたもの
const [keyword, setKeyword] = useQueryState("keyword", { defaultValue: "" });`}
				/>

				<p>
					<strong>形はまったく同じ</strong>です。
					受け取るものも、更新のしかたも変わりません。
					変わったのは、値がどこに保管されているかだけです。
				</p>

				<DemoCard
					title="URL に置いた検索条件"
					sourcePath={URL_STATE}
					description="打つたびにアドレス欄が変わる"
				>
					{/* URL を読む部品は Suspense で包む必要がある（この章の最後で説明） */}
					<Suspense
						fallback={<p className="text-muted-foreground">読み込み中…</p>}
					>
						<UrlState />
					</Suspense>
				</DemoCard>

				<p>入力して、次の 3 つを試してみてください。</p>

				<ul>
					<li>
						<strong>アドレス欄を見る</strong> …{" "}
						<code>?keyword=…</code> が付いています
					</li>
					<li>
						<strong>リロードする</strong> … 入力が残っています
					</li>
					<li>
						<strong>URL をコピーして別のタブで開く</strong> …{" "}
							同じ絞り込みの状態で開きます
						</li>
				</ul>
			</LessonSection>

			<LessonSection id="why" {...at(URL_STATE, "const [keyword, setKeyword]")}>
				<h2>URL に置くと何が起きるか</h2>

				<p>
					URL は<strong>ブラウザが元から持っている状態の置き場所</strong>です。
					そこに乗せるだけで、ブラウザの機能がそのまま使えるようになります。
				</p>

				<ul>
					<li>
						<strong>リロードしても消えない</strong>
					</li>
					<li>
						<strong>URL を送れば、同じ画面を相手に見せられる</strong>
					</li>
					<li>
						<strong>戻る / 進むボタンを効かせることもできる</strong>（後述）
					</li>
					<li>
						<strong>お気に入りに登録できる</strong>
					</li>
				</ul>

				<p>
					とくに 2 つめが大きい。「この検索結果を見てほしい」というとき、
					<strong>URL を貼るだけで済みます</strong>。
					<code>useState</code> ではこうはいきません。
				</p>

				<Callout variant="point" title="URL に置くべきもの">
					<p>
						<strong>あとでその画面をもう一度開きたくなるもの</strong>。
					</p>
					<ul>
						<li>検索キーワード、絞り込み条件</li>
						<li>並び順、ページ番号</li>
						<li>選択中のタブ</li>
					</ul>
					<p>
						逆に、入力途中の下書きや、開閉しているだけのメニューは URL に要りません。
						<strong>他人に見せて意味があるか</strong>が判断の目安です。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="nuqs" {...at(URL_STATE, "useQueryState(")}>
				<h3>素で書くと面倒なので、道具を使う</h3>

				<p>
					URL の読み書きは、自分でやると意外と手間がかかります。
				</p>

				<ul>
					<li>文字列なので、数値や真偽値は自分で変換する</li>
					<li>値がないときの既定値を毎回書く</li>
					<li>更新するときに他のパラメータを壊さないよう気をつける</li>
				</ul>

				<p>
					デモで使っている <strong>nuqs</strong> は、これを
					<code>useState</code> と同じ形に包んでくれるライブラリです。
					型変換も面倒を見てくれます。
				</p>

				<StaticCode
					lang="ts"
					code={`// 数値として扱う
const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

// 真偽値として扱う
const [open, setOpen] = useQueryState("open", parseAsBoolean.withDefault(false));`}
				/>

				<Callout variant="note">
					<p>
						既定では、値が変わっても<strong>履歴には残りません</strong>
						（上書きされます）。このデモで戻るボタンを押すと、
						検索前ではなく<strong>前のページに戻ります</strong>。
					</p>
					<StaticCode
						lang="ts"
						code={`// 戻るボタンで 1 つ前の値に戻したいとき
useQueryState("tab", { defaultValue: "profile", history: "push" });`}
					/>
					<p>
						検索窓のように<strong>1 文字ごとに変わるもの</strong>は既定のままにします。
						履歴が文字数ぶん積まれて、戻るボタンが使いものにならなくなるからです。
						タブや並び順のように<strong>ぽんと切り替わるもの</strong>には{" "}
						<code>history: &quot;push&quot;</code> が向いています。
					</p>
				</Callout>

				<h3>Suspense で包む必要がある（Next.js 固有の話）</h3>

				<p>
					Next.js でこれを使うと、ビルド時にエラーが出ることがあります。
				</p>

				<StaticCode
					lang="bash"
					code={`Error occurred prerendering page "/lessons/url-state"`}
				/>

				<p>
					Next.js は、ページをあらかじめ組み立てておくことがあります。
					ですが<strong>その時点では URL がまだ決まっていません</strong>。
					クエリ文字列は、実際にアクセスされて初めて分かるものだからです。
				</p>

				<p>
					そこで、URL を読む部品を <code>Suspense</code> で包み、
					<strong>「ここは後から埋まる」と React に伝えます</strong>。
				</p>

				<StaticCode
					code={`<Suspense fallback={<p>読み込み中…</p>}>
  <SearchBox />
</Suspense>`}
				/>

				<p>
					このデモも、そうやって包んであります。
					<code>useSearchParams</code> を直接使う場合も同じ対処が必要です。
				</p>
			</LessonSection>

			<LessonSection id="quiz" {...at(URL_STATE, "useQueryState(")}>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="検索キーワードを URL に置く利点は？"
					options={[
						{
							label: "リロードしても消えず、URL を送れば同じ画面を相手に見せられる",
							correct: true,
							explanation:
								"ブラウザが元から持っている仕組みに乗せているためです。設定しだいで戻るボタンも効かせられます。",
						},
						{
							label: "描き直しが減って速くなる",
							explanation:
								"速度は変わりません。むしろ URL の更新という処理が増えます。",
						},
						{
							label: "サーバーに保存されるので安全",
							explanation:
								"URL はブラウザ側の情報です。サーバーへの保存とは別の話です。",
						},
					]}
				/>

				<Quiz
					question="次のうち、URL に置くべきなのはどれ？"
					options={[
						{
							label: "一覧の絞り込み条件",
							correct: true,
							explanation:
								"あとでその画面をもう一度開きたくなる情報です。URL を送れば相手にも同じ結果を見せられます。",
						},
						{
							label: "入力途中のコメント本文",
							explanation:
								"他人に見せて意味のある情報ではありません。URL に出ると読まれてしまう点でも不向きです。",
						},
						{
							label: "メニューが開いているかどうか",
							explanation:
								"その画面をもう一度開きたい理由になりません。useState で十分です。",
						},
					]}
				/>
			</LessonSection>

			<LessonSection id="summary" {...at(URL_STATE, "useQueryState(")}>
				<h2>この章のまとめ</h2>

				<ul>
					<li>
						状態の置き場所は <code>useState</code> だけではない
					</li>
					<li>
						URL に置くと、<strong>リロードで消えず、URL を送れば共有できる</strong>
					</li>
					<li>
						判断の目安は<strong>「他人に見せて意味があるか」</strong>
					</li>
					<li>
						nuqs のような道具を使えば、書き方は <code>useState</code> と同じ形になる
					</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
