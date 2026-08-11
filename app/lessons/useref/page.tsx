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
import { FocusInput } from "./demos/focus-input";
import { RefVsState } from "./demos/ref-vs-state";

const SLUG = "useref";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{ path: "lessons/useref/demos/focus-input.tsx", label: "focus-input.tsx" },
	{ path: "lessons/useref/demos/ref-vs-state.tsx", label: "ref-vs-state.tsx" },
] as const;

const [FOCUS, COMPARE] = SOURCES.map((source) => source.path);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					ここまで、覚えておきたい値は全部 <code>useState</code> に入れてきました。
				</p>
				<p>
					ですが<strong>覚えておきたいけれど、画面には関係ない</strong>値
					というものがあります。
					それを <code>useState</code> に入れると、
					<strong>意味のない描き直しが起きます</strong>。
				</p>
				<p>
					そういうときに使うのが <code>useRef</code> です。
					出番は多くありませんが、
					<strong>知らないと既存のコードが読めません</strong>。
				</p>
			</LessonHeader>

			<LessonSection id="dom" {...at(FOCUS, "const inputRef = useRef")}>
				<h2>1. 実物の要素に触りたいとき</h2>

				<p>
					いちばんよく見るのがこれです。
					<strong>入力欄にカーソルを移したい</strong>、というやつです。
				</p>

				<p>
					React では画面を直接いじらないのが原則でした。
					ですが「カーソルを移す」は<strong>画面の見た目ではなく、操作</strong>です。
					state では表現できません。
				</p>

				<StaticCode
					lang="ts"
					code={`const inputRef = useRef<HTMLInputElement>(null);

<input ref={inputRef} />
<button onClick={() => inputRef.current?.focus()}>移す</button>`}
				/>

				<DemoCard
					title="入力欄にカーソルを移す"
					sourcePath={FOCUS}
					showRenderCount
					description="押すと入力欄が光ります。数字は増えません"
				>
					<FocusInput />
				</DemoCard>

				<p>
					<strong>数字が増えていないことに注目してください。</strong>
					カーソルは移ったのに、描き直しは起きていません。
				</p>

				<Callout variant="note" title="なぜ .current が要るのか">
					<p>
						<code>useRef(null)</code> が返すのは値そのものではなく、
						<strong><code>{"{ current: null }"}</code> という入れ物</strong>です。
					</p>
					<p>
						値を直接返してしまうと、書き換えたときに
						<strong>入れ替わったことを誰も知りません</strong>。
						箱ごと渡しておけば、中身を入れ替えても
						箱は同じもののままです。
					</p>
					<p>
						<code>ref={"{inputRef}"}</code> と渡すと、React が
						<strong>実物の要素を <code>.current</code> に入れて</strong>
						おいてくれます。
					</p>
				</Callout>

				<p>
					<code>?.</code> は「中身があれば」という意味です。
					画面に出る前は <code>null</code> なので、この書き方で守ります。
				</p>
			</LessonSection>

			<LessonSection id="memory" {...at(COMPARE, "const refCount = useRef(0);")}>
				<h2>2. 覚えたいけれど、画面には出さないとき</h2>

				<p>
					<code>useRef</code> は要素専用ではありません。
					<strong>ただの値も入れられます</strong>。
				</p>

				<p>
					そして <code>useState</code> との違いは、たったひとつです。
				</p>

				<Callout variant="point" title="違いはこれだけ">
					<ul>
						<li>
							<code>useState</code> …{" "}
							変えると<strong>描き直しが起きる</strong>
						</li>
						<li>
							<code>useRef</code> …{" "}
							変えても<strong>描き直しが起きない</strong>
						</li>
					</ul>
					<p>どちらも、描き直しをまたいで値を覚えている点は同じです。</p>
				</Callout>

				<DemoCard
					title="state と ref を並べる"
					sourcePath={COMPARE}
					showRenderCount
					description="ref 側を連打してから、state 側を 1 回押す"
				>
					<RefVsState />
				</DemoCard>

				<p>
					<strong>「ref を増やす」を何回押しても、表示が変わりません。</strong>
					値は増えているのに、React が描き直していないからです。
				</p>

				<p>
					そのあと「state を増やす」を 1 回押すと、
					<strong>ref のほうもまとめて追いつきます</strong>。
					描き直しのついでに、いまの値が読まれたからです。
				</p>

				<Callout variant="warn" title="だから、画面に出す値を ref に入れない">
					<p>
						いま見たとおり、<strong>表示が古いまま取り残されます</strong>。
						これは React のバグではなく、そういう道具だからです。
					</p>
					<p>
						<strong>画面に出るなら <code>useState</code>。</strong>
						迷ったらこちらで正解です。
					</p>
					<p>
						ちなみにこのデモは、
						<strong>lint に怒られながら書いています</strong>。
						「描き直しの最中に ref を読むな」と正しく止めてくるので、
						この 1 ファイルだけ黙らせてあります。
						<strong>ふだんは黙らせないでください。</strong>
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="when" {...at(COMPARE, "const [stateCount, setStateCount]")}>
				<h3>使いどころ</h3>

				<p>
					<code>useRef</code> の出番は、はっきりしています。
				</p>

				<ul>
					<li>
						<strong>実物の要素に触る</strong> …{" "}
						カーソルを移す、スクロール位置を測る、動画を再生する
					</li>
					<li>
						<strong>片付けるために覚えておく</strong> …{" "}
						タイマーの番号（Part 6 のクリーンアップで使います）
					</li>
					<li>
						<strong>前回の値を覚えておく</strong> …{" "}
						「増えたのか減ったのか」を知りたいとき
					</li>
					<li>
						<strong>数えるだけで、表示しない</strong> …{" "}
						この教材のデモカードが、まさにこれです
					</li>
				</ul>

				<Callout variant="note" title="この教材でも使っています">
					<p>
						デモが光る回数を数えている部分は、
						<code>useRef</code> で作られています。
					</p>
					<p>
						<code>useState</code> で数えると、
						<strong>数えること自体が描き直しを起こして、
						数字が増え続けて止まりません</strong>。
					</p>
				</Callout>

				<p>
					逆に、この 4 つに当てはまらないなら
					<code>useRef</code> は要りません。
					<strong>ふだんは <code>useState</code> だけで足ります。</strong>
				</p>
			</LessonSection>

			<LessonSection id="quiz" {...at(COMPARE, "const refCount = useRef(0);")}>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="useState と useRef のいちばんの違いは？"
					options={[
						{
							label: "ref は変えても描き直しが起きない",
							correct: true,
							explanation:
								"どちらも描き直しをまたいで値を覚えています。違うのは、変えたときに React に伝わるかどうかだけです。",
						},
						{
							label: "ref は値を覚えていられない",
							explanation:
								"覚えています。覚えているけれど、変わったことを React に伝えないだけです。",
						},
						{
							label: "ref は要素にしか使えない",
							explanation:
								"ただの値も入れられます。要素専用ではありません。",
						},
					]}
				/>

				<Quiz
					question="画面に表示する数を useRef で持つとどうなる？"
					options={[
						{
							label: "値は増えるが、表示が古いまま取り残される",
							correct: true,
							explanation:
								"描き直しが起きないためです。他のきっかけで描き直されたとき、突然追いつきます。",
						},
						{
							label: "エラーになる",
							explanation:
								"なりません。動いてしまうので、かえって気づきにくい間違いです。",
						},
						{
							label: "問題なく動く",
							explanation:
								"動きません。デモの「ref を増やす」を押したときと同じことが起きます。",
						},
					]}
				/>

				<Quiz
					question="useRef が返すのが .current という入れ物なのはなぜ？"
					options={[
						{
							label: "中身を入れ替えても、箱そのものは同じものでいられるから",
							correct: true,
							explanation:
								"値を直接返すと、入れ替えたことを誰も知りません。箱ごと渡しておけば、中身だけ差し替えられます。",
						},
						{
							label: "React の書き方の決まりだから",
							explanation:
								"決まりというより、そうしないと成り立たないためです。",
						},
						{
							label: "型を付けるために必要だから",
							explanation: "型のためではありません。",
						},
					]}
				/>
			</LessonSection>

			<LessonSection id="summary" {...at(FOCUS, "const inputRef = useRef")}>
				<h2>この章のまとめ</h2>

				<ul>
					<li>
						<code>useRef</code> は
						<strong>変えても描き直しが起きない入れ物</strong>
					</li>
					<li>
						中身は <code>.current</code> にある。
						箱ごと渡すから、中身を差し替えられる
					</li>
					<li>
						<code>ref={"{...}"}</code> と渡すと、
						<strong>実物の要素が入ってくる</strong>
					</li>
					<li>
						<strong>画面に出す値は入れない。</strong>
						表示が古いまま取り残される
					</li>
					<li>迷ったら <code>useState</code>。ref は必要になってから</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
