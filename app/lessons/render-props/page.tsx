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
import { Faac } from "./demos/faac";
import { PlainChildren } from "./demos/plain-children";

const SLUG = "render-props";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{
		path: "lessons/render-props/demos/plain-children.tsx",
		label: "plain-children.tsx",
	},
	{ path: "lessons/render-props/demos/faac.tsx", label: "faac.tsx" },
] as const;

const [PLAIN, FAAC] = SOURCES.map((source) => source.path);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					前の章で、<code>children</code> を使って組み合わせる形を見ました。
					包む側は中身を知らなくてよく、使う側は好きなものを入れられる。
				</p>
				<p>
					ですがこの形には、ひとつだけできないことがあります。
				</p>
				<p>
					<strong>包む側が持っている値を、中身に渡すことができません。</strong>
				</p>
			</LessonHeader>

			<LessonSection
				id="limit"
				{...at(PLAIN, "function Panel", "<div className=\"mt-3\">{children}</div>")}
			>
				<h2>できないことを、先に見る</h2>

				<p>
					開閉する入れ物を作りました。
					<code>isOpen</code> という状態を持っているのは <code>Panel</code> です。
				</p>

				<DemoCard
					title="children で中身を受け取る"
					sourcePath={PLAIN}
					description="中身から開閉の状態は見えない"
				>
					<PlainChildren />
				</DemoCard>

				<p>
					ボタンの文字は「開く / 閉じる」と切り替わります。
					<code>Panel</code> の中では <code>isOpen</code> が使えるからです。
					ですが<strong>中身の文は、押しても何も変わりません</strong>。
				</p>

				<p>
					では、<strong>中身の側にも</strong>
					「いま開いています」と出したくなったら？
				</p>

				<StaticCode
					code={`<Panel>
  {/* ここから isOpen は見えない */}
  <p>いま {isOpen ? "開いています" : "閉じています"}</p>
</Panel>`}
				/>

				<p>
					<strong>書けません。</strong>
					<code>isOpen</code> は <code>Panel</code> の中にある値で、
					外側からは触れないからです。
				</p>

				<Callout variant="note" title="なぜ書けないのか">
					<p>
						<code>{"<Panel>...</Panel>"}</code> の中身は、
						<strong><code>Panel</code> に渡す前に、外側で作られています</strong>。
					</p>
					<p>
						渡されるのは完成した要素です。
						<code>Panel</code> はそれを置くことしかできません。
						中に値を注ぎ込む隙間がありません。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection
				id="idea"
				{...at(FAAC, "type PanelProps = {", "};")}
			>
				<h2>作るのを、あとまわしにする</h2>

				<p>
					問題は<strong>「先に作ってしまう」</strong>ことでした。
					なら、作るのを遅らせればいい。
				</p>

				<p>
					Part 0 でやった<strong>「関数は値として渡せる」</strong>を思い出してください。
					<code>map</code> に渡していたのは、まさに
					<strong>「あとで呼んでもらう作り方」</strong>でした。
				</p>

				<StaticCode
					lang="ts"
					code={`// map は「作り方」を受け取って、要素の数だけ呼ぶ
items.map((item) => <li>{item}</li>);`}
				/>

				<p>
					同じことを <code>children</code> でやります。
					<strong>要素そのものではなく、要素の作り方を渡す</strong>のです。
				</p>
			</LessonSection>

			<LessonSection id="how" {...at(FAAC, "typeof children === ")}>
				<h2>children を関数にする</h2>

				<p>
					受け取る側は、<strong>渡されたのが関数なら呼びます</strong>。
					そのとき、自分が持っている値を引数で渡します。
				</p>

				<StaticCode
					lang="ts"
					code={`{typeof children === "function" ? children({ isOpen }) : children}`}
				/>

				<p>
					<code>typeof</code> は
						<strong>「これは何の種類の値か」を調べる書き方</strong>です。
						関数なら <code>&quot;function&quot;</code> が返ります。
					</p>

					<p>
						<strong>仕掛けはこれだけです。</strong>
					React の特別な機能ではありません。
					「関数だったら呼ぶ」という、ただの JavaScript です。
				</p>

				<p>
					三項演算子で分けているので、
					<strong>今までどおり普通の要素を渡してもそのまま動きます</strong>。
					できることが増えただけで、失われたものはありません。
				</p>
			</LessonSection>

			<LessonSection id="result" {...at(FAAC, "{({ isOpen }) => (")}>
				<h2>使う側から見た形</h2>

				<StaticCode
					code={`<Panel>
  {({ isOpen }) => (
    <p>いま {isOpen ? "開いています" : "閉じています"}</p>
  )}
</Panel>`}
				/>

				<p>
					<strong>親の状態が、引数として降りてきました。</strong>
					<code>Panel</code> は <code>{"<p>"}</code> のことを何も知らないのに、
					自分の値をそこに流し込めています。
				</p>

				<DemoCard
					title="children を関数にする"
					tone="good"
					sourcePath={FAAC}
					description="中身が開閉の状態を使えるようになった"
				>
					<Faac />
				</DemoCard>

				<p>
					この書き方を <strong>FaaC</strong>（Function as a Child）
					または <strong>render props</strong> と呼びます。
					名前は仰々しいですが、やっていることは
					<strong>「children に関数を置いただけ」</strong>です。
				</p>

				<Callout variant="point" title="役割の分かれ方">
					<ul>
						<li>
							<strong>包む側</strong> … 状態を持ち、管理する（<em>どう動くか</em>）
						</li>
						<li>
							<strong>使う側</strong> … その状態をどう見せるか決める（<em>どう見えるか</em>）
						</li>
					</ul>
					<p>
						<strong>動きと見た目を分けて持てる</strong>のが、この形の値打ちです。
						同じ <code>Panel</code> を、まったく違う見た目で何度でも使えます。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="when" {...at(FAAC, "children: ReactNode | ((state")}>
				<h3>いつ使うか</h3>

				<p>
					毎回これにする必要はありません。
					<strong>中身が親の状態を必要とするときだけ</strong>です。
				</p>

				<ul>
					<li>
						開閉、選択中の項目、読み込み中かどうかを
						<strong>中身にも使わせたい</strong>
					</li>
					<li>
						一覧の<strong>並べ方は共通</strong>にしつつ、
						1 件の見た目は使う側に任せたい
					</li>
					<li>
						マウス位置や画面幅など、
						<strong>測るのは共通・使い道は自由</strong>なもの
					</li>
				</ul>

				<Callout variant="warn" title="入れ子が深くなりすぎたら">
					<p>
						FaaC を重ねると、こうなります。
					</p>
					<StaticCode
						code={`<A>{(a) => <B>{(b) => <C>{(c) => ...}</C>}</B>}</A>`}
					/>
					<p>
						読みにくくなってきたら、
						<strong>カスタムフック</strong>（Part 6 で扱います）に
						切り出せないかを考えます。
						状態の共有だけが目的なら、そちらのほうが素直なことが多いです。
					</p>
					<p>
						FaaC が向いているのは、
						<strong>状態と一緒に「置き場所」も提供したいとき</strong>です。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="quiz" {...at(FAAC, "typeof children === ")}>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="普通の children では、親の状態を中身から使えないのはなぜ？"
					options={[
						{
							label: "children は親に渡す前に、外側で作り終わっているから",
							correct: true,
							explanation:
								"渡されるのは完成した要素です。親はそれを置くことしかできず、値を注ぎ込む隙間がありません。",
						},
						{
							label: "React が親から子への値渡しを禁止しているから",
							explanation:
								"禁止されていません。props でなら渡せます。children という形だと渡す口がない、という話です。",
						},
						{
							label: "state は他のコンポーネントから読めない決まりだから",
							explanation:
								"props として渡せば読めます。ここでの問題は、渡す手段がないことです。",
						},
					]}
				/>

				<Quiz
					question="FaaC の仕組みは？"
					options={[
						{
							label: "children が関数なら呼ぶ、というだけ",
							correct: true,
							explanation:
								"React の特別な機能ではありません。typeof で判定して呼んでいるだけの、ただの JavaScript です。",
						},
						{
							label: "React が用意した専用の API",
							explanation:
								"専用の API はありません。だから自分で書けます。",
						},
						{
							label: "children を props として親に渡し直す仕組み",
							explanation:
								"渡し直してはいません。受け取った関数を、その場で呼んでいるだけです。",
						},
					]}
				/>

				<Quiz
					question="FaaC にすると、今までの使い方はできなくなる？"
					options={[
						{
							label: "できる。関数でなければそのまま置く分岐が入っている",
							correct: true,
							explanation:
								"できることが増えただけです。普通の要素を渡す使い方はそのまま残ります。",
						},
						{
							label: "できない。全部関数で書き直す必要がある",
							explanation:
								"三項演算子で両方を受けています。書き直しは不要です。",
						},
						{
							label: "できるが、型エラーになる",
							explanation:
								"children の型をunionにしてあるので、どちらでも通ります。",
						},
					]}
				/>
			</LessonSection>

			<LessonSection id="summary" {...at(FAAC, "typeof children === ")}>
				<h2>この章のまとめ</h2>

				<ul>
					<li>
						普通の <code>children</code> は
						<strong>外側で作り終わっている</strong>ので、親の値を使えない
					</li>
					<li>
						<strong>要素ではなく、要素の作り方（関数）を渡す</strong>と解決する
					</li>
					<li>
						仕組みは「関数なら呼ぶ」だけ。
						<strong>React の機能ではない</strong>
					</li>
					<li>
						<strong>動き（包む側）と見た目（使う側）を分けて持てる</strong>
					</li>
					<li>
						入れ子が深くなったら、カスタムフックに切り出せないか考える
					</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
