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
import { CallbackProp } from "./demos/callback-prop";
import { SpreadProp } from "./demos/spread-prop";
import { VariantProp } from "./demos/variant-prop";

const SLUG = "props-patterns";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{
		path: "lessons/props-patterns/demos/callback-prop.tsx",
		label: "callback-prop.tsx",
	},
	{
		path: "lessons/props-patterns/demos/variant-prop.tsx",
		label: "variant-prop.tsx",
	},
	{
		path: "lessons/props-patterns/demos/spread-prop.tsx",
		label: "spread-prop.tsx",
	},
] as const;

const [CALLBACK, VARIANT, SPREAD] = SOURCES.map((source) => source.path);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					前の章で、props の渡し方と型の付け方を見ました。
					文字列や数値を渡す、という形です。
				</p>
				<p>
					ですが props に渡せるのは、それだけではありません。
					<strong>JavaScript の値なら何でも渡せます</strong>。
				</p>
				<p>
					実際のアプリでよく出てくる渡し方を、3 つ見ていきます。
				</p>
			</LessonHeader>

			<LessonSection id="callback" {...at(CALLBACK, "onLike: () => void;")}>
				<h2>1. 関数を渡す（いちばん重要）</h2>

				<p>
					Part 0 でやった<strong>「関数は値である」</strong>を思い出してください。
					値なら、props で渡せます。
				</p>

				<StaticCode
					lang="ts"
					code={`function LikeButton({ count, onLike }: {
  count: number;
  onLike: () => void;   // 引数なし・戻り値なしの関数
}) {
  return <button onClick={onLike}>いいね {count}</button>;
}`}
				/>

				<p>
					<code>LikeButton</code> は
					<strong>「押されたら何が起きるか」を知りません</strong>。
					押されたことを伝えるだけです。
					何をするかは、使う側が決めます。
				</p>

				<DemoCard
					title="押されたことを、上に伝える"
					sourcePath={CALLBACK}
					showRenderCount
					description="ボタン自身は数え方を知らない"
				>
					<CallbackProp />
				</DemoCard>

				<Callout variant="point" title="値は下へ、知らせは上へ">
					<ul>
						<li>
							<strong>下へ</strong> … <code>count</code>（表示する値）
						</li>
						<li>
							<strong>上へ</strong> … <code>onLike</code>（起きたことの知らせ）
						</li>
					</ul>
					<p>
						この 2 本立てが、React のほぼすべての部品の形です。
						前の章「props は書き換えられない」を思い出してください。
						子は受け取った値を書き換えられません。だからこそ、
						<strong>持っている側にお願いするしかない</strong>のです。
						その「お願い」を運ぶのが、この関数です。
					</p>
				</Callout>

				<h3>名前は on〜 にする</h3>

				<p>
					<code>onLike</code>、<code>onSelect</code>、<code>onClose</code>。
					<strong><code>on</code> + 起きたこと</strong>で名前を付けます。
				</p>

				<StaticCode
					lang="ts"
					code={`// ◯ 起きたことを伝えている
onLike, onSelect, onClose

// ✕ 何をするかを名前に入れてしまっている
increaseCount, openModal`}
				/>

				<p>
					後者だと、<strong>子が使い道を決めてしまっています</strong>。
					同じボタンを別の場面で使い回せなくなります。
				</p>

				<Callout variant="warn" title="括弧を付けない">
					<StaticCode
						lang="ts"
						code={`<LikeButton onLike={handleLike} />     // ◯ 関数を渡す
<LikeButton onLike={handleLike()} />   // ✕ 呼んだ結果を渡す`}
					/>
					<p>
						Part 0 の「関数を値として扱う」でやった話です。
						<strong>括弧は「今すぐ実行しろ」の合図</strong>でした。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="variant" {...at(VARIANT, "type Tone =")}>
				<h2>2. 見た目の種類を、決まった言葉で受け取る</h2>

				<p>
					同じ部品を、色違いで何度も使いたい。よくあります。
				</p>

				<StaticCode
					lang="ts"
					code={`type Tone = "info" | "success" | "danger";`}
				/>

				<p>
					文字列なら何でも受け取れる（<code>tone: string</code>）ようにすると、
					<code>tone=&quot;succes&quot;</code> のような打ち間違いが通ってしまいます。
					<strong>3 つに絞れば、打ち間違いはその場で赤線になります。</strong>
				</p>

				<DemoCard
					title="tone で見た目を切り替える"
					sourcePath={VARIANT}
					showRenderCount
					description="同じ部品、3 つの見た目"
				>
					<VariantProp />
				</DemoCard>

				<h3>省略できるようにする</h3>

				<StaticCode
					lang="ts"
					code={`function Notice({ tone = "info", compact = false, children }) { ... }`}
				/>

				<p>
					<code>= &quot;info&quot;</code> と書いておくと、
					<strong>渡されなかったときの値</strong>になります。
					よく使うものを既定にしておけば、多くの場面で <code>tone</code> を
					書かずに済みます。
				</p>

				<Callout variant="note" title="真偽値は名前だけで true">
					<StaticCode
						code={`<Notice compact />          // compact={true} と同じ
<Notice compact={true} />   // こう書いてもよいが、冗長`}
					/>
					<p>
						HTML の <code>&lt;input disabled&gt;</code> と同じ書き方です。
						<strong>名前だけ書けば true</strong>、書かなければ既定値。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="spread" {...at(SPREAD, "function Field(")}>
				<h2>3. 残りをまとめて受け取る</h2>

				<p>
					入力欄を作ったとします。
					そのうち <code>placeholder</code> を渡したくなり、
					<code>maxLength</code> も渡したくなり、
					<code>type</code> も…と続きます。
				</p>

				<p>
					そのたびに props を 1 つ増やすのは、際限がありません。
				</p>

				<StaticCode
					lang="ts"
					code={`function Field({ label, hint, className, ...rest }: FieldProps) {
  return (
    <label>
      <span>{label}</span>
      <input className={...} {...rest} />
    </label>
  );
}`}
				/>

				<p>
					<code>...rest</code> は Part 0 でやった
					<strong>分割代入の「残り全部」</strong>です。
					受け取った props のうち、自分が使うものだけ名前を付けて取り出し、
					<strong>残りはまとめて <code>input</code> に流します</strong>。
				</p>

				<DemoCard
					title="使う側が自由に足せる入力欄"
					tone="good"
					sourcePath={SPREAD}
					showRenderCount
					description="Field 側は placeholder も maxLength も知らない"
				>
					<SpreadProp />
				</DemoCard>

				<StaticCode
					lang="ts"
					code={`} & ComponentProps<"input">;`}
				/>

				<p>
					型のほうも、1 つずつ書く必要はありません。
					<code>ComponentProps&lt;&quot;input&quot;&gt;</code> と書けば
					<strong>「input タグが受け取れるもの全部」</strong>という意味になります。
					打ち間違いはちゃんと止めてくれます。
				</p>

				<Callout variant="note" title="要素そのものも渡せる">
					<StaticCode
						code={`hint={<>通知に使います（<strong>公開されません</strong>）</>}`}
					/>
					<p>
						<code>hint</code> には文字列ではなく
						<strong>JSX を渡しています</strong>。
						型は <code>ReactNode</code>。
						「画面に出せるものなら何でも」という意味です。
					</p>
					<p>
						children が 1 つしか使えないのに対して、
						<strong>この形なら「差し込み口」を何個でも作れます</strong>。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="quiz" {...at(CALLBACK, "onLike: () => void;")}>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="ボタン部品に渡す props の名前として適切なのは？"
					options={[
						{
							label: "onSelect（起きたことを伝える名前）",
							correct: true,
							explanation:
								"部品は「何が起きたか」を伝えるだけにします。何をするかは使う側が決めるので、別の場面でも使い回せます。",
						},
						{
							label: "openModal（何をするかを表す名前）",
							explanation:
								"子が使い道を決めてしまっています。モーダルを開かない場面では、この名前が嘘になります。",
						},
						{
							label: "setCount（親の更新関数の名前をそのまま）",
							explanation:
								"親の実装が子の props 名に漏れています。親の作りを変えると、子の名前も直すことになります。",
						},
					]}
				/>

				<Quiz
					question="tone の型を string ではなく 3 つの文字列の union にする理由は？"
					options={[
						{
							label: "打ち間違いが、その場で赤線になるから",
							correct: true,
							explanation:
								'tone: string だと "succes" のような打ち間違いが通ってしまい、画面が崩れて初めて気づきます。',
						},
						{
							label: "そのほうが動作が速くなるから",
							explanation:
								"型は実行時には消えるので、速さには関係ありません。",
						},
						{
							label: "string だと日本語が渡せないから",
							explanation: "渡せます。制限とは関係ありません。",
						},
					]}
				/>

				<Quiz
					question="{...rest} を使うと何が良い？"
					options={[
						{
							label: "使う側が必要な属性を自由に足せる。部品側は増やさなくてよい",
							correct: true,
							explanation:
								"placeholder が欲しくなるたびに props を 1 つ増やす、という作業がなくなります。",
						},
						{
							label: "props の受け渡しが速くなる",
							explanation: "速さの話ではありません。書く量の話です。",
						},
						{
							label: "型を書かなくてよくなる",
							explanation:
								"型は必要です。ComponentProps を使うと、まとめて書けるというだけです。",
						},
					]}
				/>
			</LessonSection>

			<LessonSection id="summary" {...at(CALLBACK, "onLike: () => void;")}>
				<h2>この章のまとめ</h2>

				<ul>
					<li>
						props には<strong>関数も要素も渡せる</strong>。
						JavaScript の値なら何でも
					</li>
					<li>
						<strong>値は下へ、知らせは上へ。</strong>
						知らせを運ぶのが <code>on〜</code> の関数
					</li>
					<li>
						見た目の種類は<strong>union で絞る</strong>と、
						打ち間違いが赤線になる
					</li>
					<li>
						既定値を書いておけば省略できる。
						真偽値は<strong>名前だけで true</strong>
					</li>
					<li>
						<code>{"{...rest}"}</code> で
						<strong>残りをまとめて流せる</strong>
					</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
