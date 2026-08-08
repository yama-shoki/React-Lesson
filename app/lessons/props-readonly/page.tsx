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
import { BrokenProps } from "./demos/broken-props";
import { FixedProps } from "./demos/fixed-props";
import { DataFlowFigure } from "./figures/data-flow";

const SLUG = "props-readonly";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/props-readonly/demos/broken-props.tsx", label: "broken-props.tsx" },
  { path: "lessons/props-readonly/demos/fixed-props.tsx", label: "fixed-props.tsx" },
] as const;

const [BROKEN, FIXED] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          props で値を受け取れるようになると、次に必ずこう考えます。
          <strong>「受け取った値を書き換えればいいのでは」</strong>と。
        </p>
        <p>
          これはうまくいきません。しかも<strong>エラーも警告も出ません</strong>。
          ただ、押しても何も起こらないだけです。
        </p>
        <p>
          この章では、なぜそうなるのかと、では何をすればいいのかを見ます。
        </p>
      </LessonHeader>

      <LessonSection id="broken" {...at(BROKEN, "count = count + 1")}>
        <h2>書き換えても、何も起きない</h2>

        <p>
          受け取った <code>count</code> を、ボタンを押したときに 1 増やしています。
          いかにも動きそうですが、押してみてください。
        </p>

        <DemoCard
          title="props を書き換えようとする"
          tone="bad"
          sourcePath={BROKEN}
          description="何度押しても 0 のまま"
        >
          <BrokenProps />
        </DemoCard>

        <p>
          数字は動きません。ただし
          <strong>変数の中身は実際に増えています</strong>。
          ブラウザのコンソールを開くと、増えた値が出力されているのが分かります。
        </p>

        <p>
          つまり計算は成功していて、<strong>画面への反映だけが起きていない</strong>のです。
        </p>
      </LessonSection>

      <LessonSection id="why" {...at(BROKEN, "const increase")}>
        <h2>なぜ反映されないのか</h2>

        <p>
          Part 1 でやったことを思い出してください。React
          は<strong>状態が変わったときに画面を描き直します</strong>。
        </p>

        <p>
          ここで書き換えているのは、関数の中のただの変数です。
          React はその存在すら知りません。
          <strong>知らない値が変わっても、描き直すきっかけになりません。</strong>
        </p>

        <p>
          しかも、仮に描き直されたとしても意味がありません。
          描き直すというのは<strong>関数をもう一度実行する</strong>ことなので、
          <code>count</code> はまた親から渡された 0 に戻ります。
          書き換えた結果はどこにも残りません。
        </p>

        <Callout variant="point" title="props は読み取り専用">
          <p>
            props は<strong>親から借りているもの</strong>です。
            子が勝手に書き換えてよいものではありません。
            React ではこれを「props は読み取り専用」と表現します。
          </p>
        </Callout>

        <Callout variant="note" title="実際には道具が止めてくれる">
          <p>
            この書き方をすると、エディタが
            <code>count cannot be modified</code> と警告を出します。
            React 公式のルールに、
            <strong>受け取った値を書き換えてはいけない</strong>という項目があるためです。
          </p>
          <p>
            右のコードで警告を黙らせる 1 行が入っているのは、
            この教材で<strong>あえて間違った状態を動かして見せている</strong>からです。
            実際に書くときは、警告が出た時点で気づけます。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="fixed" {...at(FIXED, "export function FixedProps")}>
        <h2>値を持っている側が変える</h2>

        <p>
          では、どうすればいいのか。答えは単純です。
          <strong>値を持っている側が変える</strong>。それだけです。
        </p>

        <p>
          子は「押されました」と伝えるだけにして、
          実際に値を変えるのは親の仕事にします。
        </p>

        <DataFlowFigure />

        <p>
          子に渡すものが 2 つになります。
          <strong>表示するための値</strong>と、
          <strong>押されたことを伝えるための関数</strong>です。
        </p>

        <StaticCode
          code={`<Counter count={count} onIncrease={() => setCount(count + 1)} />`}
        />

        <p>
          Part 0 でやった「関数を値として渡す」が、ここで効いてきます。
          <code>onIncrease</code> に渡しているのは関数で、
          子はそれを<strong>いつ呼ぶかを決めるだけ</strong>です。
        </p>

        <DemoCard
          title="親が値を持ち、子は伝えるだけ"
          tone="good"
          sourcePath={FIXED}
          description="今度はちゃんと増える"
        >
          <FixedProps />
        </DemoCard>

        <p>
          子のコードを見ると、<strong>書き換えている場所がどこにもありません</strong>。
          受け取って表示し、押されたら渡された関数を呼ぶ。それだけです。
        </p>
      </LessonSection>

      <LessonSection id="why-good" {...at(FIXED, "function Counter")}>
        <h2>なぜこの形が良いのか</h2>

        <p>
          面倒に見えるかもしれませんが、この形には大きな利点があります。
        </p>

        <p>
          <strong>値の出どころが 1 か所に決まる</strong>ということです。
        </p>

        <p>
          もし子が自由に書き換えられたら、
          その値がどこで変わったのかを探すのに、
          関わっている部品を全部見る必要が出てきます。
          部品が 10 個あれば、容疑者は 10 人です。
        </p>

        <p>
          値を変えられるのが持ち主だけなら、
          <strong>おかしくなったときに見る場所は 1 か所</strong>です。
          React の書き方が窮屈に感じられる部分の多くは、
          この「あとで困らないため」の設計です。
        </p>

        <Callout variant="note">
          <p>
            この章では <code>useState</code>{" "}
            を説明なしで使いました。「値を持って、変わったら描き直してもらう仕組み」
            くらいの理解で、いまは十分です。Part 4 で正面から扱います。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="quiz" {...at(FIXED)}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="子で props を書き換えても画面が変わらないのはなぜ？"
          options={[
            {
              label: "React はその値を知らないので、描き直すきっかけにならないから",
              correct: true,
              explanation:
                "React が描き直すのは状態が変わったときです。関数の中のただの変数が変わっても、React には伝わりません。",
            },
            {
              label: "React が props の書き換えを禁止していて、エラーになるから",
              explanation:
                "エラーにはなりません。書き換え自体は成立してしまうので、かえって原因に気づきにくくなります。",
            },
            {
              label: "書き換えた値が親に届かないから",
              explanation:
                "親に届かないのは事実ですが、根本の理由は「React が描き直すきっかけを得られない」ことです。",
            },
          ]}
        />

        <Quiz
          question="子から値を変えたいとき、親は何を渡す？"
          options={[
            {
              label: "値と、変更を伝えるための関数",
              correct: true,
              explanation:
                "子は関数を呼ぶだけで、実際の変更は親が行います。値の出どころが 1 か所に保たれます。",
            },
            {
              label: "値だけ。子が自分で書き換える",
              explanation:
                "子は props を書き換えられません。書き換えても画面に反映されません。",
            },
            {
              label: "親の state そのもの",
              explanation:
                "state を直接渡しても、子が書き換えられるようにはなりません。渡すのは「変更を依頼する手段」である関数です。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(FIXED)}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            props は<strong>読み取り専用</strong>。子が書き換えても画面は変わらない
          </li>
          <li>
            エラーも警告も出ず、<strong>ただ動かない</strong>ので気づきにくい
          </li>
          <li>
            値は<strong>持っている側が変える</strong>。子は「押された」と伝えるだけ
          </li>
          <li>
            値が下へ、知らせが上へ。この一方向の流れが、
            <strong>おかしくなったときに見る場所を 1 か所に保つ</strong>
          </li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
