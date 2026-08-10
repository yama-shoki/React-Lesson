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
import { ReactCounter } from "./demos/react-counter";

const SLUG = "why-react";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/why-react/demos/vanilla-counter.ts", label: "vanilla-counter.ts" },
  { path: "lessons/why-react/demos/react-counter.tsx", label: "react-counter.tsx" },
] as const;

const [VANILLA, REACT] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          Web ページに動きをつけるだけなら、React
          は必要ありません。JavaScript だけでもボタンは押せますし、文字も書き換えられます。
        </p>
        <p>
          では、なぜみんな React を使うのか。
          その理由は<strong>画面が複雑になったときに何が起きるか</strong>を見ると分かります。
        </p>
        <p>
          この章では、同じものを 2 通りの方法で作って比べます。
        </p>
      </LessonHeader>

      <LessonSection id="vanilla" {...at(VANILLA, "increment?.addEventListener", "});")}>
        <h2>React を使わずに作ると</h2>

        <p>
          数字があって、ボタンで増やせて、リセットもできる。
          それだけのカウンターを素の JavaScript で書くと、右のようになります。
        </p>

        <p>
          注目してほしいのは <code>render()</code> という行です。
          <strong>値を変えたあと、毎回これを呼んでいます。</strong>
        </p>

        <StaticCode
          lang="ts"
          code={`increment?.addEventListener("click", () => {
  count = count + 1;
  render(); // ← これを忘れると画面が変わらない
});`}
        />

        <p>
          JavaScript は「count が変わったから画面も直そう」とは考えてくれません。
          <strong>値の変更と画面の更新は、まったく別の作業</strong>です。
          だから人間が、変えるたびに手で呼ぶ必要があります。
        </p>

        <h3>これが破綻していく</h3>

        <p>
          カウンターひとつなら問題ありません。問題は、画面が現実的な規模になったときです。
        </p>

        <ul>
          <li>数字を表示する場所が 3 か所に増えた</li>
          <li>0 のときはリセットボタンを消したくなった</li>
          <li>10 を超えたら色を変えたくなった</li>
          <li>合計を別の場所にも出したくなった</li>
        </ul>

        <p>
          そのたびに「値が変わる場所」を全部探し出して、
          <strong>更新の処理を書き足していく</strong>ことになります。
          1 か所でも書き忘れると、
          <strong>そこだけ古い表示が残ります</strong>。
        </p>

        <Callout variant="warn" title="いちばんつらいバグ">
          <p>
            「値は正しいのに、画面だけが古い」というバグは、
            原因が見た目に現れないので探すのが非常に大変です。
            そして書き忘れは、機能を足せば足すほど増えていきます。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="react" {...at(REACT, "const [count, setCount]", "</div>")}>
        <h2>React で作ると</h2>

        <p>同じものを React で書くと、右のようになります。</p>

        <DemoCard
          title="React のカウンター"
          sourcePath={REACT}
          showRenderCount
          description="更新のための処理はどこにも書いていない"
        >
          <ReactCounter />
        </DemoCard>

        <p>
          コードの中を探しても、<code>render()</code>{" "}
          にあたるものがありません。<code>setCount(count + 1)</code>{" "}
          と書いてあるだけです。
        </p>

        <p>
          それでも画面は更新されます。React
          が<strong>「値が変わった」ことを検知して、勝手に描き直している</strong>からです。
        </p>

        <Callout variant="point" title="React が肩代わりしていること">
          <p>
            値が変わったときに<strong>画面のどこを直すか</strong>という作業を、
            まるごと引き受けてくれます。
            人間が書くのは「値をこう変える」という部分だけになります。
          </p>
        </Callout>

        <p>
          さきほど挙げた「表示場所が 3 か所に増えた」「0 のときはボタンを消したい」も、
          React なら<strong>表示のしかたを書くだけ</strong>です。
          更新の処理を足す必要はありません。
          書き忘れようがないので、あのバグ自体が起きなくなります。
        </p>
      </LessonSection>

      <LessonSection id="tradeoff" {...at(REACT, "onClick={() => setCount")}>
        <h2>その代わりに払うもの</h2>

        <p>
          React はただの魔法ではありません。得るものがある代わりに、
          いくつか引き受けなければならないことがあります。
        </p>

        <ul>
          <li>
            React の作法（この教材でやること）を覚える必要がある
          </li>
          <li>
            「いつ描き直されるか」を意識しないと、遅くなることがある（Part 7 以降）
          </li>
          <li>
            値を書き換えるのではなく<strong>新しく作る</strong>という書き方に慣れる必要がある（Part 4）
          </li>
        </ul>

        <p>
          小さなページなら、素の JavaScript のほうが手っ取り早いこともあります。
          React が効いてくるのは、
          <strong>画面の状態が増えて、表示との対応が人間の手に負えなくなってから</strong>です。
        </p>
      </LessonSection>

      <LessonSection id="quiz" {...at(REACT)}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="素の JavaScript で画面を作るときにいちばん大変なのは？"
          options={[
            {
              label: "値が変わるたびに、画面のどこを更新するかを自分で書くこと",
              correct: true,
              explanation:
                "書き忘れると「値は正しいのに表示だけ古い」という、原因の見えにくいバグになります。機能が増えるほど書き忘れも増えます。",
            },
            {
              label: "ボタンのクリックを受け取ること",
              explanation:
                "クリックを受け取るだけなら addEventListener で十分で、これは React でも大差ありません。",
            },
            {
              label: "変数を用意すること",
              explanation:
                "値を持つこと自体は簡単です。難しいのは、その値と画面を一致させ続けることです。",
            },
          ]}
        />

        <Quiz
          question="React を使うと何がなくなる？"
          options={[
            {
              label: "「値が変わったら画面を直す」という処理を人間が書く作業",
              correct: true,
              explanation:
                "React がその対応を引き受けます。人間は「値をどう変えるか」と「その値をどう表示するか」だけを書きます。",
            },
            {
              label: "JavaScript を書く必要そのもの",
              explanation:
                "React は JavaScript のライブラリなので、書くのは JavaScript（TypeScript）のままです。",
            },
            {
              label: "画面が遅くなる問題",
              explanation:
                "むしろ React 特有の速度の問題があり、Part 7 以降で扱います。React は速さのための道具ではありません。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(REACT)}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            素の JavaScript では、値の変更と画面の更新が
            <strong>別々の作業</strong>になる
          </li>
          <li>
            そのため「値は合っているのに表示が古い」というバグが起きやすく、
            画面が複雑になるほど増える
          </li>
          <li>
            React は<strong>その対応づけを肩代わりする</strong>。
            人間は値と表示のしかただけを書けばよくなる
          </li>
          <li>代わりに React の作法を覚える必要がある。それがこの教材</li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
