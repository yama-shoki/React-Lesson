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
import { ParentRerendersChild } from "./demos/parent-re-renders-child";

const SLUG = "render-triggers";

export const metadata: Metadata = {
	title: findLesson(SLUG)?.title,
};

const SOURCES = [
	{
		path: "lessons/render-triggers/demos/parent-re-renders-child.tsx",
		label: "parent-re-renders-child.tsx",
	},
] as const;

const [PARENT] = SOURCES.map((source) => source.path);

export default async function Page() {
	const snippets = await loadSnippets(SOURCES);

	const at = (id: string, from?: string, to?: string) =>
		focus(snippets, id, from, to);

	return (
		<LessonShell snippets={snippets}>
			<LessonHeader slug={SLUG}>
				<p>
					再レンダリングが起きる理由は 2 つだけです。 自分の state
					が変わったときと、親がもう一度描き直されたときです。
				</p>
				<p>
					ここで大切なのは、<strong>props が変わったから</strong>
					ではないということです。
					親が再レンダリングされると、子も再レンダリングされます。
				</p>
			</LessonHeader>

			<LessonSection
				id="parent"
				{...at(
					PARENT,
					"useTrackDemoRender();",
					"function ParentRerendersChild",
				)}
			>
				<h2>子が props を受け取っていなくても再レンダリングされる</h2>

				<p>
					下のデモでは、子コンポーネントに props を渡していません。
					それでも親のボタンを押すと、子の render 回数が増えます。
				</p>

				<DemoCard
					title="親の更新で子も再レンダリング"
					sourcePath={PARENT}
					showRenderCount
					tone="neutral"
					description="親の state を更新すると、子も再び実行される"
				>
					<ParentRerendersChild />
				</DemoCard>

				<p>
					React は子の関数をもう一度実行して、その結果を比べます。 props
					が同じでも、親が再び描き直されるときは子も動きます。
				</p>
			</LessonSection>

			<LessonSection
				id="why"
				{...at(
					PARENT,
					"onClick={() => setCount((current) => current + 1)}",
					"<Child />",
				)}
			>
				<h2>props の変化はきっかけではない</h2>

				<StaticCode
					lang="ts"
					code={`function Child() {
  useTrackDemoRender();
  return <p>私は props を受け取っていません。</p>;
}

function Parent() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount((current) => current + 1)}>
        親を更新する
      </button>
      <Child />
    </div>
  );
}`}
				/>

				<p>
					この例では、子が受け取る値はありません。
					それでも親が更新されれば、子の関数は再び呼ばれます。
				</p>

				<Callout variant="warn" title="props が変わることだけが原因ではない">
					<p>
						親が再レンダリングされたとき、React は子の結果を再び計算します。
					</p>
					<p>
						そのとき props が同じかどうかは、React が次に決めることです。 props
						が同じでも、子の関数は実行されます。
					</p>
				</Callout>
			</LessonSection>

			<LessonSection id="quiz" {...at(PARENT, "function Child")}>
				<h2>理解できたか確かめる</h2>

				<Quiz
					question="子コンポーネントの props が同じでも再レンダリングされるのはどちらの場合？"
					options={[
						{
							label: "親が再レンダリングされたとき",
							correct: true,
							explanation:
								"親が再レンダリングされると、React は子も再び実行します。props が同じでもです。",
						},
						{
							label: "props が変わったときだけ",
							explanation:
								"props はきっかけのひとつではありますが、親の再レンダリング自体も再レンダリングの理由になります。",
						},
						{
							label: "子に state があるときだけ",
							explanation:
								"子に state があっても、親が再レンダリングされれば子も再レンダリングされます。",
						},
					]}
				/>

				<Quiz
					question="親が再レンダリングするとき、子はどうなりますか？"
					options={[
						{
							label: "子の関数ももう一度実行される",
							correct: true,
							explanation:
								"React は親の結果だけでなく、子の結果も再計算します。props が変わっていなくても実行されます。",
						},
						{
							label: "子は前の結果をそのまま使い続ける",
							explanation:
								"React は子の結果を再確認するため、子の関数をもう一度呼びます。",
						},
						{
							label: "親が更新されると、子の画面は必ず消える",
							explanation:
								"子の画面は消えません。再レンダリングは表示を再計算するだけです。",
						},
					]}
				/>
			</LessonSection>

			<LessonFooter slug={SLUG} />
		</LessonShell>
	);
}
