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
import { ControlledForm } from "./demos/controlled-form";
import { RhfForm } from "./demos/rhf-form";

const SLUG = "react-hook-form";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{
		path: "lessons/react-hook-form/demos/controlled-form.tsx",
		label: "controlled-form.tsx",
	},
	{ path: "lessons/react-hook-form/demos/rhf-form.tsx", label: "rhf-form.tsx" },
] as const;

const [CONTROLLED, RHF] = SOURCES.map((source) => source.path);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					Part 5 で、制御コンポーネントと入力チェックをやりました。
					そこで「項目が増えたら道具を使う」と書きました。
				</p>
				<p>その道具の話です。</p>
				<p>
					<strong>React Hook Form</strong> は、
					フォームで毎回書くことになる面倒を
					まとめて引き受けてくれるライブラリです。
				</p>
			</LessonHeader>

			<LessonSection
				id="cost"
				{...at(CONTROLLED, "const [name, setName]", "const [age, setAge]")}
			>
				<h2>1 文字ごとに描き直している</h2>

				<p>
					まず、いままでのやり方を見ます。
					<code>useState</code> で 1 項目ずつ持つ、制御コンポーネントです。
				</p>

				<DemoCard
					title="useState で作ったフォーム"
					sourcePath={CONTROLLED}
					showRenderCount
					description="名前を打ちながら、右上の数字を見る"
				>
					<ControlledForm />
				</DemoCard>

				<p>
					<strong>1 文字打つごとに数字が増えます。</strong>
					しかも増えるのは名前の欄だけではありません。
					<strong>フォーム全体が描き直されています</strong>。
				</p>

				<p>
					項目が 3 つならこれでも困りません。
					20 項目のフォームで、1 文字ごとに 20 個の入力欄が描き直されるとどうでしょう。
					<strong>入力が引っかかる感覚</strong>として現れはじめます。
				</p>

				<p>
					加えて、Part 5 で見たとおり、
					エラー文の管理・いつ検査するか・送信中の制御を
					自分で書くことになります。
				</p>
			</LessonSection>

			<LessonSection id="register" {...at(RHF, 'register("name")')}>
				<h2>入力欄を state から切り離す</h2>

				<p>React Hook Form の中心にあるのが、この 1 行です。</p>

				<StaticCode
					lang="ts"
					code={`<Input placeholder="名前" {...register("name")} />`}
				/>

				<p>
					<code>value</code> も <code>onChange</code> も書いていません。
					<code>register</code> が、その両方を含んだ props を
					まとめて返しています。
				</p>

				<Callout variant="point" title="値を state に持たない">
					<p>
						React Hook Form は、
						<strong>入力中の値を state に入れません</strong>。
						ブラウザの入力欄そのものに持たせたままにして、
						必要なときだけ読みに行きます。
					</p>
					<p>
						だから<strong>打っても再レンダリングが起きません</strong>。
						これが「非制御」と呼ばれるやり方です。
					</p>
				</Callout>

				<Callout variant="note" title="入力欄の値は、いつも文字列">
					<p>
						年齢の欄だけ <code>{'register("age", { valueAsNumber: true })'}</code>{" "}
						と書いてあります。
					</p>
					<p>
						HTML の入力欄から取れる値は、
						<strong>数字を打っても文字列の <code>&quot;18&quot;</code></strong> です。
						このひと言を足すと、検査に渡す前に数値へ直してくれます。
					</p>
				</Callout>

				<p>
					Part 4 でやった<strong>「state は最小限にする」</strong>の徹底版です。
					画面に出すのに state が要らないなら、持たない。
				</p>
			</LessonSection>

			<LessonSection id="schema" {...at(RHF, "const schema = z.object({", "});")}>
				<h2>入力の決まりを 1 か所に書く</h2>

				<p>
					検査の内容は <strong>zod</strong> で書きます。
					項目ごとに、条件とエラー文を並べるだけです。
				</p>

				<p>
					Part 5 では、この検査を <code>if</code> で自分で書いていました。
					項目が増えるほど、条件と表示が離れていきます。
					ここでは<strong>決まりが 1 か所にまとまります</strong>。
				</p>

				<StaticCode
					lang="ts"
					code={`type FormValues = z.infer<typeof schema>;`}
				/>

				<p>
					そして<strong>型を別に書く必要がありません</strong>。
					<code>z.infer</code> が、決まりから型を作ってくれます。
				</p>

				<Callout variant="note" title="決まりと型がずれない">
					<p>
						型と検査を別々に書くと、片方だけ直したときにずれます。
						<strong>「型は通るのに検査で落ちる」</strong>という状態です。
					</p>
					<p>
						決まりから型を作れば、そもそもずれようがありません。
						これは <code>lib/code.ts</code> で
						「デモの実ファイルを読む」ようにしているのと同じ考え方です。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection
				id="result"
				{...at(RHF, "formState: { errors, isSubmitting }")}
			>
				<h2>できあがり</h2>

				<DemoCard
					title="React Hook Form + zod"
					tone="good"
					sourcePath={RHF}
					showRenderCount
					description="打っても数字が増えない。空のまま送信するとエラーが出る"
				>
					<RhfForm />
				</DemoCard>

				<p>試してみてください。</p>

				<ul>
					<li>
						<strong>打っても右上の数字が増えません</strong>
						（エラーが出たときだけ増えます）
					</li>
					<li>
						空のまま送信すると、
						<strong>3 つとも同時にエラーが出ます</strong>
					</li>
					<li>
						一度エラーが出た欄は、
						<strong>打ち直すとその場で消えます</strong>
					</li>
					<li>送信中はボタンが「送信中…」になり、押せなくなります</li>
				</ul>

				<p>
					最後の 2 つは <code>mode: &quot;onTouched&quot;</code> と{" "}
					<code>isSubmitting</code> のおかげです（一度エラーを出したあと
					打つたびに再判定するのは、既定でそうなっています）。
					Part 5 で自分で組み立てた「いつエラーを出すか」の作法が、
					<strong>設定 1 つで手に入っています</strong>。
				</p>

				<StaticCode
					lang="ts"
					code={`const onSubmit = handleSubmit(async (values) => {
  // 検査を通ったときだけ、ここが呼ばれる
});`}
				/>

				<p>
					<code>handleSubmit</code> が検査を済ませてから呼ぶので、
					<strong>この中では値が正しいことが保証されています</strong>。
					<code>values</code> には型も付いています。
				</p>
			</LessonSection>

			<LessonSection id="tradeoff" {...at(RHF, "resolver: zodResolver(schema)")}>
				<h3>いつ使うか</h3>

				<p>
					<strong>いつでも使うべき、ではありません。</strong>
					覚えることが増えるからです。
				</p>

				<div className="not-prose my-6 overflow-x-auto">
					<table className="w-full min-w-[32rem] border-collapse text-sm">
						<thead>
							<tr className="border-b">
								<th className="p-3 text-left font-semibold">フォーム</th>
								<th className="p-3 text-left font-semibold">選ぶもの</th>
							</tr>
						</thead>
						<tbody className="text-muted-foreground">
							<tr className="border-b">
								<td className="p-3">検索窓 1 つ、チェックボックス 1 つ</td>
								<td className="p-3 font-mono text-foreground">useState</td>
							</tr>
							<tr className="border-b">
								<td className="p-3">
									打つたびに他の表示が変わる（文字数カウントなど）
								</td>
								<td className="p-3 font-mono text-foreground">useState</td>
							</tr>
							<tr className="border-b">
								<td className="p-3">項目が 3 つ以上あり、検査が要る</td>
								<td className="p-3 font-mono text-foreground">
									React Hook Form
								</td>
							</tr>
							<tr>
								<td className="p-3">項目の追加・削除ができる（動的なフォーム）</td>
								<td className="p-3 font-mono text-foreground">
									React Hook Form
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<p>
					2 行目に注意してください。
					<strong>入力中の値を画面に出したい場合</strong>は、
					結局その値を見張ることになるので、
					非制御の利点が薄れます。
				</p>

				<Callout variant="note" title="zod は単体でも使える">
					<p>
						zod はフォーム専用ではありません。
						<strong>外から来たデータが期待した形か確かめる</strong>道具です。
					</p>
					<p>
						API のレスポンス、URL のパラメータ、環境変数。
						<code>as</code> で型を押し付ける代わりに、
						実際に確かめられます。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="quiz" {...at(RHF, 'register("name")')}>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="React Hook Form で打っても再レンダリングが起きないのはなぜ？"
					options={[
						{
							label: "入力中の値を state に持たず、入力欄そのものに持たせているから",
							correct: true,
							explanation:
								"必要なときだけ読みに行きます。state が変わらないので、描き直しも起きません。",
						},
						{
							label: "内部で memo を使っているから",
							explanation:
								"memo の話ではありません。そもそも state を更新していないので、描き直す理由がありません。",
						},
						{
							label: "onChange を間引いているから",
							explanation:
								"間引いていません。値は毎回入力欄に入っています。React が知らないだけです。",
						},
					]}
				/>

				<Quiz
					question="z.infer<typeof schema> は何をしている？"
					options={[
						{
							label: "検査の決まりから、TypeScript の型を作っている",
							correct: true,
							explanation:
								"型を別に書かずに済みます。決まりと型が別々だと、片方だけ直したときにずれます。",
						},
						{
							label: "型から検査の決まりを作っている",
							explanation:
								"逆です。型は実行時に消えるので、型から検査は作れません。",
						},
						{
							label: "実行時に型を検査している",
							explanation:
								"検査するのは schema です。z.infer は型を取り出すだけで、実行時には何も起きません。",
						},
					]}
				/>

				<Quiz
					question="検索窓 1 つのフォームに React Hook Form を使うべき？"
					options={[
						{
							label: "使わなくてよい。useState で十分",
							correct: true,
							explanation:
								"覚えることが増えるだけです。項目が増えて検査が要るようになってから移せば足ります。",
						},
						{
							label: "使うべき。フォームには必ず使う決まり",
							explanation:
								"そんな決まりはありません。道具は困りごとが出てから使います。",
						},
						{
							label: "使うべき。そのほうが必ず速い",
							explanation:
								"1 項目では体感できる差になりません。",
						},
					]}
				/>
			</LessonSection>

			<LessonSection id="summary" {...at(RHF, "const schema = z.object({")}>
				<h2>この章のまとめ</h2>

				<ul>
					<li>
						制御コンポーネントは、
						<strong>1 文字ごとにフォーム全体を描き直している</strong>
					</li>
					<li>
						React Hook Form は<strong>値を state に持たない</strong>ので、
						打っても描き直されない
					</li>
					<li>
						zod で<strong>決まりを 1 か所に書き</strong>、そこから型も作る
					</li>
					<li>
						<code>handleSubmit</code> の中は、
						<strong>検査を通った値だけが来る</strong>
					</li>
					<li>
						小さいフォームには要らない。
						<strong>項目が増えて検査が要るようになってから</strong>
					</li>
				</ul>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
