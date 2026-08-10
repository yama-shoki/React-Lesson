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
import { FetchDemo } from "./demos/fetch-demo";
import { Order } from "./demos/order";

const SLUG = "async-await";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{ path: "lessons/async-await/demos/order.tsx", label: "order.tsx" },
	{ path: "lessons/async-await/demos/fetch-demo.tsx", label: "fetch-demo.tsx" },
] as const;

const [ORDER, FETCH] = SOURCES.map((source) => source.path);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					ここまでのコードは、
					<strong>書いた順に、上から下へ</strong>実行されていました。
				</p>
				<p>
					ですがサーバーへの問い合わせは違います。
					<strong>返事が来るまで時間がかかります</strong>。
					その間、画面が固まってしまっては困ります。
				</p>
				<p>
					そこで JavaScript には
					<strong>「あとで結果が来るもの」</strong>を扱う仕組みがあります。
					この章はその話です。
				</p>
			</LessonHeader>

			<LessonSection id="order" {...at(ORDER, "const withoutAwait")}>
				<h2>順番が入れ替わるところを見る</h2>

				<p>
					「お茶を注文する」処理を書いてみます。
					お茶が届くまでに 1 秒かかるとします。
				</p>

				<DemoCard
					title="await があるときと、ないとき"
					sourcePath={ORDER}
					showRenderCount
					description="両方押して、出てくる順番を見比べる"
				>
					<Order />
				</DemoCard>

				<p>
					<strong>「await なし」を押すと、2 番が最後に来ます。</strong>
					1 → 3 → 2 の順です。
				</p>

				<StaticCode
					lang="ts"
					code={`add("1. お茶を注文した");
wait(1000).then(() => add("2. お茶が届いた"));
add("3. 席に座った");`}
				/>

				<p>
					<code>wait(1000)</code> は<strong>その場で止まりません</strong>。
					「1 秒たったらこれをやって」と<strong>予約だけして、先に進みます</strong>。
					だから 3 番が先に実行されます。
				</p>

				<Callout variant="point" title="これは不便ではなく、必要なこと">
					<p>
						もし本当にその場で 1 秒止まったら、
						<strong>その間ブラウザは何もできません</strong>。
						ボタンも押せず、スクロールもできない。
					</p>
					<p>
						「待っている間、他のことをする」ために、
						<strong>わざと止まらないようになっています</strong>。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="promise" {...at(ORDER, "const wait =")}>
				<h2>Promise は「引換券」</h2>

				<StaticCode
					lang="ts"
					code={`const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));`}
				/>

				<p>
					<code>wait(1000)</code> が返すのは、お茶ではありません。
					<strong>「1 秒後にお渡しします」という引換券</strong>です。
					この引換券を <strong>Promise</strong> と呼びます。
				</p>

				<p>引換券には 3 つの状態があります。</p>

				<ul>
					<li>
						<strong>待っている</strong>（pending）… まだ結果が出ていない
					</li>
					<li>
						<strong>成功した</strong>（fulfilled）… 値が入った
					</li>
					<li>
						<strong>失敗した</strong>（rejected）… エラーになった
					</li>
				</ul>

				<p>
					そして<strong>受け取り方が 2 通り</strong>あります。
				</p>

				<StaticCode
					lang="ts"
					code={`// 昔ながらの書き方
wait(1000).then(() => add("届いた"));

// いまの書き方
await wait(1000);
add("届いた");`}
				/>

				<p>
					<strong>やっていることは同じ</strong>です。
					下のほうが、上から下に読めるぶん分かりやすい。
					だから <code>await</code> が使えるところでは、そちらを使います。
				</p>
			</LessonSection>

			<LessonSection id="await" {...at(ORDER, "const withAwait")}>
				<h2>await は「ここで待つ」</h2>

				<StaticCode
					lang="ts"
					code={`const withAwait = async () => {
  add("1. お茶を注文した");
  await wait(1000);          // ← ここで待つ
  add("2. お茶が届いた");
  add("3. 席に座った");
};`}
				/>

				<p>
					こう書くと、<strong>1 → 2 → 3 の順になります</strong>。
					デモの「await あり」を押すと確かめられます。
				</p>

				<Callout variant="warn" title="決まりが 2 つ">
					<ol>
						<li>
							<code>await</code> を使う関数には、
							<strong>頭に <code>async</code> を付ける</strong>
						</li>
						<li>
							<code>async</code> を付けた関数は、
							<strong>必ず Promise を返す</strong>ようになる
						</li>
					</ol>
					<p>
						2 つめが効いてきます。
						<code>async</code> な関数を呼ぶ側も、結果が欲しければ
						<code>await</code> することになります。
						<strong>待つ処理は、呼び出し元へ伝染していきます</strong>。
					</p>
				</Callout>

				<Callout variant="note" title="止まっているのはこの関数だけ">
					<p>
						<code>await</code> で止まっているように見えますが、
						<strong>ブラウザ全体は止まっていません</strong>。
					</p>
					<p>
						止まっているのは<strong>この関数の続きだけ</strong>で、
						その間もボタンは押せますし、画面もスクロールできます。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="fetch" {...at(FETCH, "const response = await fetch(path);")}>
				<h2>サーバーからデータを取ってくる</h2>

				<p>
					ここまでが分かると、
					<strong>API との通信が読めるようになります</strong>。
				</p>

				<DemoCard
					title="実際に取ってくる"
					sourcePath={FETCH}
					showRenderCount
					description="両方のボタンを押してみる"
				>
					<FetchDemo />
				</DemoCard>

				<p>
					<code>fetch</code> は、サーバーに問い合わせるための命令です。
					<strong>待つものが 2 回出てきます</strong>。
				</p>

				<StaticCode
					lang="ts"
					code={`const response = await fetch(path);   // 1 回目: 返事を待つ
const data = await response.json();   // 2 回目: 本文を読み終わるのを待つ`}
				/>

				<p>
					1 回目で返ってくるのは<strong>「返事が届いた」という事実</strong>だけで、
					中身はまだ読めていません。
					本文を JavaScript の値に変換するのに、もう一度待ちます。
				</p>
			</LessonSection>

			<LessonSection id="error" {...at(FETCH, "if (!response.ok)")}>
				<h2>失敗したときの書き方</h2>

				<p>
					通信は<strong>失敗するのが普通</strong>です。
					電波が切れる、サーバーが落ちている、URL が間違っている。
				</p>

				<StaticCode
					lang="ts"
					code={`try {
  // うまくいく前提で書く
} catch (error) {
  // 失敗したらここに来る
}`}
				/>

				<p>
					<code>try</code> の中で失敗が起きると、
					<strong>そこから先を飛ばして <code>catch</code> に移ります</strong>。
					成功時のコードに <code>if</code> を挟まなくて済むので、読みやすくなります。
				</p>

				<Callout variant="warn" title="404 でも fetch は「成功」する">
					<p>
						ここが引っかかりやすいところです。
					</p>
					<p>
						<code>fetch</code> が失敗扱いになるのは
						<strong>通信そのものができなかったとき</strong>だけ。
						サーバーが 404 や 500 を返した場合、
						<strong>「ちゃんと返事が返ってきた」ので成功</strong>です。
					</p>
					<StaticCode
						lang="ts"
						code={`if (!response.ok) {
  throw new Error(\`サーバーが \${response.status} を返しました\`);
}`}
					/>
					<p>
						なので<strong>自分で確かめて、自分で失敗にします</strong>。
						デモの「わざと失敗させる」がこれです。
						この 3 行を書き忘れると、
						エラーページの HTML を JSON として読もうとして、
						わけの分からない失敗になります。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="quiz" {...at(ORDER, "await wait(1000);")}>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="await を付けないと、なぜ順番が入れ替わる？"
					options={[
						{
							label: "時間のかかる処理はその場で止まらず、先へ進むから",
							correct: true,
							explanation:
								"「終わったらこれをやって」と予約して先に進みます。止まらないのは、待っている間もブラウザを動かし続けるためです。",
						},
						{
							label: "JavaScript の実行順が毎回変わるから",
							explanation:
								"変わりません。順番は決まっています。待つ処理だけが後回しになります。",
						},
						{
							label: "React が並び替えているから",
							explanation:
								"React は関係ありません。JavaScript そのものの仕組みです。",
						},
					]}
				/>

				<Quiz
					question="await を使う関数に必要なことは？"
					options={[
						{
							label: "関数の頭に async を付ける",
							correct: true,
							explanation:
								"付けると、その関数は必ず Promise を返すようになります。呼ぶ側も待つことになる、という点まで覚えておいてください。",
						},
						{
							label: "try / catch で囲む",
							explanation:
								"失敗に備えるなら書きますが、await を使うための条件ではありません。",
						},
						{
							label: "戻り値の型を Promise と書く",
							explanation:
								"async を付ければ自動的にそうなります。自分で書く必要はありません。",
						},
					]}
				/>

				<Quiz
					question="サーバーが 404 を返したとき、fetch はどうなる？"
					options={[
						{
							label: "成功扱いになる。自分で response.ok を確かめる必要がある",
							correct: true,
							explanation:
								"「返事は返ってきた」ので成功です。確かめないと、エラーページの HTML を JSON として読もうとして混乱します。",
						},
						{
							label: "失敗して catch に移る",
							explanation:
								"移りません。catch に移るのは、通信そのものができなかったときだけです。",
						},
						{
							label: "null が返ってくる",
							explanation:
								"返ってきません。status が 404 の response が返ります。",
						},
					]}
				/>
			</LessonSection>

			<LessonSection id="summary" {...at(FETCH, "const load = async")}>
				<h2>この章のまとめ</h2>

				<ul>
					<li>
						時間のかかる処理は<strong>その場で止まらない</strong>。
						止まったらブラウザ全体が固まるから
					</li>
					<li>
						<strong>Promise は引換券</strong>。
						待っている / 成功した / 失敗した の 3 状態
					</li>
					<li>
						<code>await</code> で<strong>上から下に読める形</strong>になる。
						使う関数には <code>async</code> が要る
					</li>
					<li>
						<code>fetch</code> は<strong>待つところが 2 回</strong>
						（返事、本文）
					</li>
					<li>
						<strong>404 や 500 は成功扱い。</strong>
						<code>response.ok</code> を自分で確かめる
					</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
