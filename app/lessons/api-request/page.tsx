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
import { DoubleSend } from "./demos/double-send";
import { SendForm } from "./demos/send-form";

const SLUG = "api-request";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{
		path: "lessons/api-request/demos/double-send.tsx",
		label: "double-send.tsx",
	},
	{ path: "lessons/api-request/demos/send-form.tsx", label: "send-form.tsx" },
] as const;

const [DOUBLE, SEND] = SOURCES.map((source) => source.path);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					前の章までは<strong>取ってくる</strong>話でした。
					こんどは<strong>送る</strong>話です。
				</p>
				<p>
					取ってくるのは何度やっても構いません。
					ですが<strong>送るのは、そうはいきません</strong>。
					2 回送れば 2 回注文されます。
				</p>
				<p>この違いが、書き方を変えます。</p>
			</LessonHeader>

			<LessonSection id="post" {...at(SEND, 'method: "POST"')}>
				<h2>送るときに書き足すもの</h2>

				<p>
					Part 0 でやった <code>fetch</code> に、3 つ足すだけです。
				</p>

				<StaticCode
					lang="ts"
					code={`await fetch("/api/messages", {
  method: "POST",                                // 1. 送ると宣言する
  headers: { "Content-Type": "application/json" }, // 2. 形式を伝える
  body: JSON.stringify({ text }),                // 3. 中身を文字列にして積む
});`}
				/>

				<ul>
					<li>
						<strong>method</strong> … 何も書かないと「取ってくる」
						（<code>GET</code>）になります
					</li>
					<li>
						<strong>headers</strong> … 「JSON を送ります」という申告。
						これがないと、サーバーが中身を読めないことがあります
					</li>
					<li>
						<strong>body</strong> … オブジェクトはそのままでは送れません。
						<code>JSON.stringify</code> で文字列に変えます
					</li>
				</ul>

				<Callout variant="note" title="送るときは文字列、受け取るときは元に戻す">
					<StaticCode
						lang="ts"
						code={`JSON.stringify({ text: "こんにちは" })  // → '{"text":"こんにちは"}'
JSON.parse('{"text":"こんにちは"}')      // → { text: "こんにちは" }`}
					/>
					<p>
						通信で運べるのは文字列だけです。
						<code>response.json()</code> がやっているのは、
						<strong>受け取った文字列を元の形に戻す</strong>作業でした。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="status" {...at(SEND, "type Status =")}>
				<h2>送信中を持つ</h2>

				<p>
					送信には時間がかかります。
					その間<strong>何も起きていないように見える</strong>と、
					人はもう一度押します。
				</p>

				<p>
					Part 4 でやった形をそのまま使います。
				</p>

				<StaticCode
					lang="ts"
					code={`type Status = "idle" | "sending" | "done" | "error";`}
				/>

				<p>
					真偽値を並べないのは、
					<strong>「送信中なのに成功と出ている」を作れなくする</strong>ためでした。
					通信のように<strong>途中で失敗しうる処理</strong>では、
					この形がとくに効きます。
				</p>

				<DemoCard
					title="送って、結果を出す"
					tone="good"
					sourcePath={SEND}
					description="「エラー」という文字を入れると失敗します"
				>
					<SendForm />
				</DemoCard>

				<p>3 つ試してみてください。</p>

				<ul>
					<li>
						普通に送る … <strong>ボタンが「送信中…」になって押せなくなります</strong>
					</li>
					<li>
						空のまま送る … サーバーが断ってきます（400）
					</li>
					<li>
						「エラー」と入れて送る … サーバー側で失敗します（500）
					</li>
				</ul>

				<p>
					<strong>どれもアプリは壊れません。</strong>
					失敗も「起こりうること」として最初から書いてあるからです。
				</p>
			</LessonSection>

			<LessonSection id="double" {...at(DOUBLE, "const send = async")}>
				<h2>二重送信を止める</h2>

				<p>
					<code>disabled</code> の 1 行を外すと、どうなるか。
				</p>

				<DemoCard
					title="止めていないと"
					tone="bad"
					sourcePath={DOUBLE}
					description="連打してみる"
				>
					<DoubleSend />
				</DemoCard>

				<p>
					<strong>押した回数だけ送られます。</strong>
					これが注文ボタンなら、そのぶん注文が入ります。
				</p>

				<StaticCode
					lang="ts"
					code={`<Button onClick={send} disabled={status === "sending"}>`}
				/>

				<p>
					<strong>直すのはこの 1 行です。</strong>
					送信中は押せなくする。
					<code>status</code> をきちんと持っていれば、書くのはこれだけです。
				</p>

				<Callout variant="warn" title="画面側の対策は「1 枚目」でしかない">
					<p>
						<code>disabled</code> は<strong>操作しにくくしているだけ</strong>です。
						通信が遅れれば、まだ <code>sending</code> になる前に
						2 回目が入ることもあります。
					</p>
					<p>
						本当に困る処理（注文、決済）では、
						<strong>サーバー側でも重複を弾きます</strong>。
						「同じ注文番号なら 1 回しか受け付けない」という作りです。
					</p>
					<p>
						画面側は<strong>親切のため</strong>、
						サーバー側は<strong>正しさのため</strong>。
						役割が違うので、両方要ります。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="after" {...at(SEND, "setStatus(\"done\");")}>
				<h2>送ったあと、画面をどうするか</h2>

				<p>
					送信が成功したら、たいてい<strong>画面も変わるべき</strong>です。
					投稿したなら一覧に増えているはずです。
				</p>

				<p>ここで、前の章の話が効いてきます。</p>

				<StaticCode
					lang="ts"
					code={`// ✕ 送ったデータを、自分で一覧に足す
setMessages([...messages, newMessage]);

// ◯ サーバーに取り直させる
mutate();`}
				/>

				<p>
					前の章の<strong>「取ってきたデータを state に写さない」</strong>と
					同じ理由です。自分で足すと、
					<strong>サーバーが実際にどう保存したかを知らないまま</strong>
					画面を作ることになります。
				</p>

				<p>
					id の採番、並び順、サーバー側で足された項目。
					<strong>ずれる要素はいくらでもあります。</strong>
					取り直せば、必ず本物と一致します。
				</p>

				<Callout variant="point" title="送ったら、取り直す">
					<StaticCode
						lang="ts"
						code={`const { data, mutate } = useSWR("/api/messages", fetcher);

const send = async () => {
  await fetch("/api/messages", { method: "POST", ... });
  await mutate();   // 一覧を取り直す
};`}
					/>
					<p>
						<code>mutate</code> は前の章で
						「取り直す」として出てきたものです。
						<code>useSWR</code> から受け取ったほうは
						<strong>引数なしで呼びます</strong>
						（キーはもう分かっているからです）。
						<strong>送信のあとに呼ぶ</strong>のが、いちばん多い使い方になります。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="quiz" {...at(SEND, 'method: "POST"')}>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="fetch でデータを送るとき、body に書くのは？"
					options={[
						{
							label: "JSON.stringify でオブジェクトを文字列にしたもの",
							correct: true,
							explanation:
								"通信で運べるのは文字列だけです。オブジェクトをそのまま渡しても送れません。",
						},
						{
							label: "オブジェクトをそのまま",
							explanation:
								"送れません。文字列に変えてから積みます。",
						},
						{
							label: "配列にして渡す",
							explanation:
								"形の問題ではありません。何であれ文字列にする必要があります。",
						},
					]}
				/>

				<Quiz
					question="二重送信を防ぐのに、画面側の disabled だけで十分？"
					options={[
						{
							label: "不十分。困る処理はサーバー側でも重複を弾く",
							correct: true,
							explanation:
								"disabled は操作しにくくしているだけです。画面側は親切のため、サーバー側は正しさのために書きます。",
						},
						{
							label: "十分。押せないなら送られない",
							explanation:
								"通信が遅れれば、sending になる前に 2 回目が入ることがあります。",
						},
						{
							label: "不要。React が自動で防いでくれる",
							explanation:
								"防いでくれません。押した回数だけ送られます。",
						},
					]}
				/>

				<Quiz
					question="投稿が成功したあと、一覧を更新する方法として良いのは？"
					options={[
						{
							label: "サーバーに取り直させる",
							correct: true,
							explanation:
								"id の採番や並び順は、サーバーが決めています。自分で足すと、本物とずれた画面ができます。",
						},
						{
							label: "送ったデータを自分で配列に足す",
							explanation:
								"サーバーが実際にどう保存したかを知らないまま画面を作ることになります。",
						},
						{
							label: "ページ全体を再読み込みする",
							explanation:
								"確実ではありますが、入力途中の内容も消え、体感も悪くなります。",
						},
					]}
				/>
			</LessonSection>

			<LessonSection id="summary" {...at(SEND, "const send = async")}>
				<h2>この章のまとめ</h2>

				<ul>
					<li>
						送るときは <code>method</code> / <code>headers</code> /{" "}
						<code>body</code> の 3 つを足す
					</li>
					<li>
						<strong>送るのは、取ってくるのと違って繰り返せない</strong>
					</li>
					<li>
						<code>status</code> を 1 つ持ち、
						<strong>送信中は押せなくする</strong>
					</li>
					<li>
						画面側の対策は親切のため。
						<strong>正しさはサーバー側で守る</strong>
					</li>
					<li>
						送ったあとは<strong>自分で足さず、取り直す</strong>
					</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
