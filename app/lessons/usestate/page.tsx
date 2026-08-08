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
import { PlainVariable } from "./demos/plain-variable";
import { WithState } from "./demos/with-state";
import { StateCycleFigure } from "./figures/state-cycle";

const SLUG = "usestate";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/usestate/demos/plain-variable.tsx", label: "plain-variable.tsx" },
  { path: "lessons/usestate/demos/with-state.tsx", label: "with-state.tsx" },
] as const;

const [PLAIN, STATE] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          ここからが React の中心です。
        </p>
        <p>
          Part 1 で「画面は状態から決まる」と書きました。
          その<strong>状態を持つための道具</strong>が <code>useState</code> です。
        </p>
        <p>
          まずは「なぜ、ふつうの変数ではダメなのか」から始めます。
          ここを飛ばすと、useState がただのおまじないになってしまいます。
        </p>
      </LessonHeader>

      <LessonSection id="plain" {...at(PLAIN, "let count = 0")}>
        <h2>ふつうの変数では動かない</h2>

        <p>
          数を持って、ボタンで増やす。<code>let</code>{" "}
          で変数を作れば済みそうに見えます。
        </p>

        <DemoCard
          title="ふつうの変数で作ったカウンター"
          tone="bad"
          sourcePath={PLAIN}
          description="押しても 0 のまま"
        >
          <PlainVariable />
        </DemoCard>

        <p>
          動きません。Part 2 の props のときと同じで、
          <strong>変数の中身は実際に増えています</strong>（コンソールに出ています）。
          画面に反映されないだけです。
        </p>

        <h3>理由は 2 つある</h3>

        <p>
          ひとつめ。React
          は<strong>その変数のことを知りません</strong>。
          知らない値が変わっても、画面を描き直すきっかけになりません。
        </p>

        <p>
          ふたつめ。こちらのほうが重要です。
          <strong>仮に描き直されても、値は 0 に戻ります。</strong>
        </p>

        <p>
          描き直すというのは、<strong>この関数をもう一度実行する</strong>ことです。
          関数が実行されれば <code>let count = 0</code> がまた走ります。
          増やした結果はどこにも残りません。
        </p>

        <Callout variant="point" title="必要なのは 2 つのこと">
          <p>
            画面を更新するには、次の 2 つが同時に必要です。
          </p>
          <ul>
            <li>値が<strong>実行のたびに消えない</strong>こと</li>
            <li>値が変わったことを<strong>React が知る</strong>こと</li>
          </ul>
          <p>この 2 つを引き受けてくれるのが useState です。</p>
        </Callout>
      </LessonSection>

      <LessonSection id="usestate" {...at(STATE, "const [count, setCount]")}>
        <h2>useState に預ける</h2>

        <StaticCode
          lang="ts"
          code={`const [count, setCount] = useState(0);`}
        />

        <p>
          この 1 行がやっていることは、こうです。
        </p>

        <ul>
          <li>
            <code>useState(0)</code> … React に「0 から始まる値を覚えておいて」と頼む
          </li>
          <li>
            <code>count</code> … いまの値
          </li>
          <li>
            <code>setCount</code> … 変更を React に伝えるための関数
          </li>
        </ul>

        <p>
          角括弧は、Part 0-4 でやった<strong>配列の分割代入</strong>です。
          <code>useState</code> が 2 つ入った配列を返すので、
          それを順番に受け取っているだけです。React 専用の記法ではありません。
        </p>

        <DemoCard
          title="useState で作ったカウンター"
          tone="good"
          sourcePath={STATE}
          description="今度はちゃんと増える"
        >
          <WithState />
        </DemoCard>

        <p>
          値は React が保管しているので、関数が何度実行されても消えません。
          そして <code>setCount</code>{" "}
          を呼ぶと、React は「値が変わった」と知ることができます。
        </p>
      </LessonSection>

      <LessonSection id="cycle" {...at(STATE, "setCount(count + 1)")}>
        <h2>setCount は画面を書き換えていない</h2>

        <p>
          ここが誤解されやすいところです。
          <code>setCount</code> は、画面のどこかを直接書き換えているわけではありません。
        </p>

        <StateCycleFigure />

        <p>
          <code>setCount(1)</code> は React への<strong>依頼</strong>です。
          依頼を受けた React は、<strong>この関数をもう一度実行します</strong>。
          そのとき <code>useState</code> が返す値が 1 になっているので、
          新しい JSX には 1 が入り、結果として画面が変わります。
        </p>

        <Callout variant="point" title="コンポーネントは何度も実行される">
          <p>
            コンポーネントの関数は、<strong>state が変わるたびに実行し直されます</strong>。
            1 回書いて終わりではありません。
          </p>
          <p>
            この感覚は最初つかみにくいのですが、
            ここが分かると Part 7 以降の話がすべてつながります。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="rules" {...at(STATE, "const [count, setCount]")}>
        <h3>useState の決まりごと</h3>

        <p>
          <code>useState</code> のような <code>use</code>{" "}
          で始まる関数を<strong>フック</strong>と呼びます。
          フックには、守らなければいけない決まりが 2 つあります。
        </p>

        <StaticCode
          code={`// ○ コンポーネントの一番上に書く
function Counter() {
  const [count, setCount] = useState(0);
  ...
}

// ✕ 条件の中に書いてはいけない
function Counter() {
  if (isReady) {
    const [count, setCount] = useState(0);
  }
  ...
}`}
        />

        <ul>
          <li>
            <strong>コンポーネントの一番上で呼ぶ</strong>。
            if や for、関数の中に入れない
          </li>
          <li>
            <strong>呼べるのはコンポーネントの中だけ</strong>。
            ふつうの関数の中では使えない
          </li>
        </ul>

        <p>
          React は<strong>呼ばれた順番</strong>で state を管理しているため、
          実行のたびに順番が変わると対応づけが崩れてしまうからです。
          この決まりも lint が見張ってくれます。
        </p>
      </LessonSection>

      <LessonSection id="quiz" {...at(STATE)}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="ふつうの変数を書き換えても画面が変わらないのはなぜ？"
          options={[
            {
              label: "React が知らない値であり、描き直されても初期値に戻るから",
              correct: true,
              explanation:
                "描き直しは関数の再実行です。let count = 0 がまた走るので、増やした結果は残りません。",
            },
            {
              label: "let で宣言しているから。const にすれば動く",
              explanation:
                "const にしても同じです。問題は宣言の仕方ではなく、値が React の管理下にないことです。",
            },
            {
              label: "変数の書き換えに失敗しているから",
              explanation:
                "書き換え自体は成功しています。コンソールを見ると値は増えています。",
            },
          ]}
        />

        <Quiz
          question="setCount(1) を呼ぶと何が起きる？"
          options={[
            {
              label: "React がコンポーネントをもう一度実行し、新しい画面ができる",
              correct: true,
              explanation:
                "画面を直接書き換えているのではありません。関数が呼び直され、そのときの useState が新しい値を返します。",
            },
            {
              label: "画面の該当箇所だけを直接書き換える",
              explanation:
                "それは素の JavaScript のやり方です。React ではコンポーネントを実行し直して、結果の差分を反映します。",
            },
            {
              label: "count 変数の中身がその場で 1 になる",
              explanation:
                "その行の直後では count はまだ古い値のままです。この性質は次の章で詳しく扱います。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(STATE)}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            ふつうの変数では、<strong>再実行のたびに初期値へ戻る</strong>ので画面は変わらない
          </li>
          <li>
            <code>useState</code> は「値を覚えておく」「変更を知らせる」を引き受ける
          </li>
          <li>
            <code>[count, setCount]</code> は<strong>配列の分割代入</strong>。特別な記法ではない
          </li>
          <li>
            <code>setCount</code> は画面を書き換えるのではなく、
            <strong>コンポーネントを実行し直させる</strong>
          </li>
          <li>フックはコンポーネントの一番上で、条件の外で呼ぶ</li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
