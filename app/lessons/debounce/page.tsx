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
import { Debounced } from "./demos/debounced";
import { Eager } from "./demos/eager";

const SLUG = "debounce";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{ path: "lessons/debounce/demos/eager.tsx", label: "eager.tsx" },
	{ path: "lessons/debounce/demos/debounced.tsx", label: "debounced.tsx" },
] as const;

const [EAGER, DEBOUNCED] = SOURCES.map((source) => source.path);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					打ちながら検索結果が出てくる画面。よくあります。
				</p>
				<p>
					素直に作ると、
					<strong>1 文字打つたびにサーバーへ問い合わせる</strong>ことになります。
					「reactjs」と打てば 7 回です。
				</p>
				<p>
					欲しかったのは最後の 1 回だけでした。
				</p>
			</LessonHeader>

			<LessonSection id="problem" {...at(EAGER, "useEffect(() => {", "}, [keyword]);")}>
				<h2>回数を数えてみる</h2>

				<p>
					<code>keyword</code> が変わるたびに検索する、
					という素直な書き方です。
				</p>

				<DemoCard
					title="打つたびに検索する"
					tone="bad"
					sourcePath={EAGER}
					showRenderCount
					description="「reactjs」と打ってみる"
				>
					<Eager />
				</DemoCard>

				<p>
					<strong>7 文字打つと、7 回になります。</strong>
					実際のアプリでは、これが 7 回の API 呼び出しです。
				</p>

				<p>問題は 2 つあります。</p>

				<ul>
					<li>
						<strong>むだが多い</strong> …{" "}
						途中の「rea」「reac」の結果は誰も見ていません
					</li>
					<li>
						<strong>順番が入れ替わる</strong> …{" "}
						「rea」の結果が「reactjs」より後に届くと、
						<strong>古い結果で上書きされます</strong>
					</li>
				</ul>

				<p>
					2 つめのほうが厄介です。
					たまにしか起きず、再現しにくく、
					<strong>「たまに検索結果がおかしい」</strong>という形で報告されます。
				</p>
			</LessonSection>

			<LessonSection id="idea" {...at(DEBOUNCED, "const [debouncedKeyword] = useDebounce")}>
				<h2>落ち着くまで待つ</h2>

				<p>
					やりたいのは<strong>「打ち終わってから検索する」</strong>です。
					ですが「打ち終わった」という出来事はありません。
				</p>

				<p>
					そこで、こう考えます。
					<strong>「一定時間、何も打たれなければ、打ち終わったとみなす」</strong>。
					これを <strong>debounce</strong> と呼びます。
				</p>

				<StaticCode
					lang="ts"
					code={`const [debouncedKeyword] = useDebounce(keyword, 500);`}
				/>

				<p>
					<code>keyword</code> はいつもどおり、打つたびに変わります。
					<code>debouncedKeyword</code> のほうは、
					<strong>500ms 止まってから追いつきます</strong>。
				</p>

				<Callout variant="point" title="値を 2 つに分ける">
					<ul>
						<li>
							<strong>入力欄に出す値</strong> … すぐ反映される。
							でないと打った文字が遅れて出てしまう
						</li>
						<li>
							<strong>検索に使う値</strong> … 落ち着いてから追いつく
						</li>
					</ul>
					<p>
						<strong>見た目は速いまま、処理だけ間引く。</strong>
						これが debounce の勘所です。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="result" {...at(DEBOUNCED, "}, [debouncedKeyword]);")}>
				<h2>見張る先を変えるだけ</h2>

				<StaticCode
					lang="ts"
					code={`// 変えたのは、依存配列に書く値だけ
useEffect(() => {
  search(debouncedKeyword);
}, [debouncedKeyword]);`}
				/>

				<p>
					<code>keyword</code> ではなく <code>debouncedKeyword</code> を見張る。
					<strong>変更はこの 1 か所だけです。</strong>
				</p>

				<DemoCard
					title="落ち着いてから検索する"
					tone="good"
					sourcePath={DEBOUNCED}
					showRenderCount
					description="同じように「reactjs」と打ってみる"
				>
					<Debounced />
				</DemoCard>

				<p>
					<strong>普通に打てば 1 回で済みます。</strong>
					入力欄の表示は遅れていません。遅れているのは検索だけです。
				</p>

				<p>
					2 つの値がずれる様子も出してあります。
					打っている間は「検索に使う値」が遅れて追いかけてくるのが見えます。
				</p>
			</LessonSection>

			<LessonSection id="how" {...at(DEBOUNCED, "const [keyword, setKeyword]")}>
				<h3>中で何が起きているか</h3>

				<p>
					<code>useDebounce</code> も、Part 6 で作ったのと同じ
					<strong>カスタムフック</strong>です。中身はこういう形です。
				</p>

				<StaticCode
					lang="ts"
					code={`useEffect(() => {
  const timer = setTimeout(() => setDebounced(value), delay);

  // 次の入力が来たら、前回の予約を取り消す
  return () => clearTimeout(timer);
}, [value, delay]);`}
				/>

				<p>
					<strong>Part 6 のクリーンアップそのものです。</strong>
					打つたびに前回のタイマーを取り消して、新しく予約し直す。
					取り消されずに残ったものだけが実行されます。
				</p>

				<Callout variant="note" title="似た道具: throttle">
					<p>
						<strong>debounce</strong> は「止まるまで待つ」。
						検索、入力チェック、自動保存に向いています。
					</p>
					<p>
						<strong>throttle</strong> は「一定間隔で必ず実行する」。
						スクロール位置の追跡など、
						<strong>止まらないもの</strong>に使います。
						debounce だとスクロールが終わるまで一度も動きません。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="quiz" {...at(DEBOUNCED, "const [debouncedKeyword] = useDebounce")}>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="debounce で入力欄の表示が遅れないのはなぜ？"
					options={[
						{
							label: "入力欄には元の値を、検索には遅らせた値を使っているから",
							correct: true,
							explanation:
								"値を 2 つに分けるのが要点です。見た目は速いまま、処理だけ間引きます。",
						},
						{
							label: "入力欄の描画が優先されているから",
							explanation:
								"優先順位の仕組みではありません。単に別の値を使っているだけです。",
						},
						{
							label: "500ms より速く打てば遅れないから",
							explanation:
								"速さの問題ではありません。どちらの値を表示に使っているかの問題です。",
						},
					]}
				/>

				<Quiz
					question="1 文字ごとに検索して起きる、いちばん厄介な問題は？"
					options={[
						{
							label: "古い結果が後から届いて、新しい結果を上書きすること",
							correct: true,
							explanation:
								"たまにしか起きず、再現しにくいバグになります。「たまに検索結果がおかしい」という形で現れます。",
						},
						{
							label: "通信量が増えること",
							explanation:
								"それも問題ですが、目に見える不具合にはなりません。",
						},
						{
							label: "入力が重くなること",
							explanation:
								"入力自体は重くなりません。問題は結果の順序です。",
						},
					]}
				/>

				<Quiz
					question="スクロール位置を追いかけるのに向いているのは？"
					options={[
						{
							label: "throttle。一定間隔で必ず実行する",
							correct: true,
							explanation:
								"debounce だとスクロールが止まるまで一度も動きません。追従が要るものには向きません。",
						},
						{
							label: "debounce。回数を減らせるから",
							explanation:
								"減りすぎます。止まるまで待つので、スクロール中はまったく更新されません。",
						},
						{
							label: "どちらも要らない",
							explanation:
								"スクロールは毎秒何十回も発生します。そのまま処理すると重くなります。",
						},
					]}
				/>
			</LessonSection>

			<LessonSection id="summary" {...at(DEBOUNCED, "const [debouncedKeyword] = useDebounce")}>
				<h2>この章のまとめ</h2>

				<ul>
					<li>
						1 文字ごとの処理は<strong>むだが多く、順序も入れ替わる</strong>
					</li>
					<li>
						debounce は
						<strong>「一定時間止まったら、打ち終わったとみなす」</strong>
					</li>
					<li>
						<strong>表示用の値と処理用の値を分ける</strong>。
						見た目は速いまま
					</li>
					<li>
						中身は <strong>setTimeout + クリーンアップ</strong>。
						Part 6 でやったこと
					</li>
					<li>
						止まらないものを追うなら <strong>throttle</strong>
					</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
