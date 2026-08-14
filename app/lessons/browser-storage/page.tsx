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
import { LocalStorageDemo } from "./demos/local-storage";

const SLUG = "browser-storage";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{ path: "lessons/browser-storage/demos/local-storage.tsx", label: "local-storage.tsx" },
] as const;

const [STORAGE] = SOURCES.map((source) => source.path);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					前の章で、URL に状態を置きました。
					ですが URL に出したくないものもあります。
				</p>
				<p>
					ダークモードの設定、閉じたお知らせ、入力途中の下書き。
					<strong>その人にだけ残ってほしいもの</strong>です。
				</p>
				<p>
					そういうときは、ブラウザの保存領域を使います。
				</p>
			</LessonHeader>

			<LessonSection id="demo" {...at(STORAGE, "useLocalStorageState(")}>
				<h2>やはり形は同じ</h2>

				<StaticCode
					lang="ts"
					code={`// いつもの
const [name, setName] = useState("");

// 置き場所をブラウザの保存領域にしたもの
const [name, setName] = useLocalStorageState("key-name", { defaultValue: "" });`}
				/>

				<p>
					この Part で 3 つめですが、<strong>また同じ形です</strong>。
					これは偶然ではありません。あとでまとめて扱います。
				</p>

				<DemoCard
					title="ブラウザに保存される入力"
					sourcePath={STORAGE}
					description="入力してからリロードしてみる"
				>
					<LocalStorageDemo />
				</DemoCard>

				<p>
					入力してからページを再読み込みしてください。
					<strong>入力が残っています。</strong>
					タブを閉じて開き直しても残ります。
				</p>
			</LessonSection>

			<LessonSection id="raw" {...at(STORAGE, "const [name, setName]")}>
				<h2>素で書くと、意外と面倒</h2>

				<p>
					ブラウザの保存領域は <code>localStorage</code> という名前で、
					React がなくても使えます。ただ、React から使うと問題が出ます。
				</p>

				<StaticCode
					lang="ts"
					code={`// 素朴に書くとこうなるが、これは動かない
const [name, setName] = useState(localStorage.getItem("name") ?? "");`}
				/>

				<p>面倒なのは次の 3 点です。</p>

				<ul>
					<li>
						<strong>サーバー側では動かない</strong> …{" "}
						Next.js は画面をサーバーでも組み立てます。そこに{" "}
						<code>localStorage</code> は存在しないのでエラーになります
					</li>
					<li>
						<strong>保存し忘れる</strong> …{" "}
						更新のたびに書き込む処理を自分で呼ぶ必要があります
					</li>
					<li>
						<strong>文字列しか入らない</strong> …{" "}
						オブジェクトを入れるには毎回変換が要ります
					</li>
				</ul>

				<p>
					デモで使っている <strong>use-local-storage-state</strong> は、
					これを全部引き受けて <code>useState</code> と同じ形にしてくれます。
				</p>

				<Callout variant="note" title="サーバーとの食い違いについて">
					<p>
						サーバー側では保存領域が読めないため、
						<strong>最初は既定値で描かれ、ブラウザに届いてから本当の値に切り替わります</strong>。
					</p>
					<p>
						一瞬だけ表示が変わることがあるのはこのためです。
						ライブラリはこの切り替えも安全に行ってくれます。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="caution" {...at(STORAGE, "useLocalStorageState(")}>
				<h2>入れてはいけないもの</h2>

				<Callout variant="warn" title="秘密の情報を入れない">
					<p>
						保存領域の中身は、
						<strong>ブラウザの開発者ツールから誰でも見られます</strong>。
						暗号化もされていません。
					</p>
					<p>
						ログイン用のトークンやパスワードを入れてはいけません。
						同じ端末を使う別の人にも見えます。
					</p>
				</Callout>

				<p>そのほか、次のような制約があります。</p>

				<ul>
					<li>
						<strong>容量が小さい</strong>（おおよそ 5MB 程度）。
						大量のデータは入りません
					</li>
					<li>
						<strong>その端末のそのブラウザにしか残らない</strong>。
						スマホで見たら別の状態です
					</li>
					<li>
						ユーザーがいつでも消せる
					</li>
				</ul>

				<Callout variant="point" title="向いているもの">
					<p>
						<strong>消えても致命的でない、その人だけの設定</strong>。
					</p>
					<ul>
						<li>ダークモードなどの表示設定</li>
						<li>「次から表示しない」のチェック</li>
						<li>入力途中の下書き</li>
					</ul>
					<p>
						大事なデータは、サーバーに保存します。次の章の話です。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="quiz" {...at(STORAGE, "useLocalStorageState(")}>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="ログイン用のトークンを localStorage に保存してよい？"
					options={[
						{
							label: "よくない。開発者ツールから誰でも見られる",
							correct: true,
							explanation:
								"暗号化されておらず、同じ端末を使う別の人にも見えます。秘密の情報を置く場所ではありません。",
						},
						{
							label: "よい。ブラウザごとに分かれているので安全",
							explanation:
								"ブラウザごとに分かれてはいますが、そのブラウザを使える人には中身が見えます。",
						},
						{
							label: "よい。React が暗号化してくれる",
							explanation:
								"暗号化はされません。保存されるのはそのままの文字列です。",
						},
					]}
				/>

				<Quiz
					question="localStorage を useState の初期値に直接書くと何が起きる？"
					options={[
						{
							label: "サーバー側で画面を組み立てるときにエラーになる",
							correct: true,
							explanation:
								"サーバーには localStorage が存在しません。ライブラリを使うと、この違いを吸収してくれます。",
						},
						{
							label: "初回だけ値が読めず、2 回目から読める",
							explanation:
								"読めないのではなく、そもそも存在しないためエラーになります。",
						},
						{
							label: "問題なく動く",
							explanation:
								"ブラウザだけで動くアプリなら動きますが、Next.js のようにサーバーでも組み立てる場合は動きません。",
						},
					]}
				/>
			</LessonSection>

			<LessonSection id="summary" {...at(STORAGE, "useLocalStorageState(")}>
				<h2>この章のまとめ</h2>

				<ul>
					<li>
						ブラウザの保存領域に置くと、
						<strong>リロードしても、閉じても残る</strong>
					</li>
					<li>
						素で書くと、サーバー側で動かない・保存し忘れる・型変換が要る
					</li>
					<li>
						<strong>秘密の情報は入れない。</strong>開発者ツールから丸見え
					</li>
					<li>
						向いているのは<strong>消えても致命的でない、その人だけの設定</strong>
					</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
