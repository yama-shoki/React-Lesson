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
import { FunctionValue } from "./demos/function-value-view";
import { PassFunction } from "./demos/pass-function-view";
import { PassVsCallFigure } from "./figures/pass-vs-call";

const SLUG = "functions";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/functions/demos/function-value.ts", label: "function-value.ts" },
  { path: "lessons/functions/demos/pass-function.ts", label: "pass-function.ts" },
] as const;

const [VALUE, PASS] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          React でボタンを作ると、必ずこう書きます。
        </p>
        <p>
          <code>{"<button onClick={handleClick}>"}</code>
        </p>
        <p>
          ここで <code>handleClick</code> のうしろに括弧を付けてしまうと、
          <strong>ボタンを押していないのに勝手に実行されます</strong>。
          初めて React を書く人がほぼ必ず一度は踏む落とし穴です。
        </p>
        <p>
          原因は React ではなく JavaScript
          にあります。この章で、その正体をはっきりさせておきます。
        </p>
      </LessonHeader>

      <LessonSection id="basics" {...at(VALUE, "const greet")}>
        <h2>関数は「まとめた処理」に名前をつけたもの</h2>

        <p>
          何度も使う処理は、まとめて名前をつけておけます。それが関数です。
        </p>

        <StaticCode
          lang="ts"
          code={`// 昔からある書き方
function greet() {
  return "こんにちは";
}

// 同じことを短く書いたもの（アロー関数）
const greet = () => "こんにちは";`}
        />

        <p>
          下の書き方を<strong>アロー関数</strong>と呼びます。
          <code>{"=>"}</code> が矢印に見えることからこの名前が付いています。
          React のコードではこちらが主役なので、見慣れておいてください。
        </p>

        <Callout variant="warn" title="return はどこへ消えたのか">
          <p>
            上には <code>return</code> があるのに、下にはありません。
            ここは必ず引っかかるところです。
          </p>
          <p>
            アロー関数は、
            <strong>
              <code>{"{ }"}</code> を書かずに式をひとつだけ書くと、
              それがそのまま戻り値になります
            </strong>
            。省略しているだけで、返している値は同じです。
          </p>
          <StaticCode
            lang="ts"
            code={`const greet = () => "こんにちは";           // 省略した形
const greet = () => { return "こんにちは"; }; // 省略しない形（同じ意味）`}
          />
        </Callout>

        <p>
          注目してほしいのは、アロー関数が <code>const greet = ...</code>{" "}
          という形をしていることです。これは前の章でやった変数そのものです。
          つまり<strong>関数も、変数に入れられる「値」のひとつ</strong>なのです。
        </p>
      </LessonSection>

      <LessonSection id="paren" {...at(VALUE, "export const theFunction", "export const theResult")}>
        <h2>括弧をつけると「実行」になる</h2>

        <p>
          関数が値だとすると、名前だけ書いたときは何が起きるのでしょうか。
        </p>

        <ul>
          <li>
            <code>greet</code> … 関数そのもの
          </li>
          <li>
            <code>greet()</code> … 関数を実行した結果
          </li>
        </ul>

        <p>
          この 2
          つはまったく別の値です。実際に中身を見てみると、はっきり違います。
        </p>

        <DemoCard
          title="括弧のあるなし"
          sourcePath={VALUE}
          description="片方は関数、もう片方は文字列になっている"
        >
          <FunctionValue />
        </DemoCard>

        <p>
          <code>greet</code> は <code>function</code>、つまり関数そのものです。
          <code>greet()</code> はすでに実行が終わっていて、残っているのは
          その結果である文字列だけです。
        </p>
      </LessonSection>

      <LessonSection id="pass" {...at(PASS, "runTwice(say)")}>
        <h2>関数は、他の関数に渡せる</h2>

        <Callout variant="note" title="引数と戻り値">
          <p>
            <strong>引数</strong>は、関数に<strong>渡す値</strong>。
            <code>greet(&quot;さとう&quot;)</code> の括弧の中に書くものです。
          </p>
          <p>
            <strong>戻り値</strong>は、関数が<strong>返してくる値</strong>。
            <code>return</code> のうしろに書いたものが、呼んだ側に返ります。
          </p>
        </Callout>

        <p>
          関数が値なら、他の関数に引数として渡すこともできます。
          これが React を読むうえで欠かせない感覚です。
        </p>

        <DemoCard
          title="関数を渡して、あとで呼んでもらう"
          sourcePath={PASS}
          description="say を渡しただけなのに、2 回実行されている"
        >
          <PassFunction />
        </DemoCard>

        <p>
          <code>runTwice(say)</code> と書いた時点では、
          <code>say</code> はまだ一度も実行されていません。
          渡した先の <code>runTwice</code> が、好きなタイミングで
          <strong>2 回呼んでいる</strong>だけです。
        </p>

        <p>ここで括弧を付けてしまうと、意味がまるごと変わります。</p>

        <PassVsCallFigure />

        <p>
          <code>runTwice(say())</code> と書くと、<code>say()</code> が
          <strong>その場で 1 回だけ実行され</strong>、その結果
          （この関数は何も返さないので <code>undefined</code>）が渡ります。
          <code>runTwice</code> は関数ではないものを受け取ってしまい、
          呼ぼうとしてエラーになります。
        </p>
      </LessonSection>

      <LessonSection id="react" {...at(PASS, "runTwice(say)")}>
        <h2>これが onClick の正体</h2>

        <p>
          最初に出した React のコードに戻ります。
        </p>

        <StaticCode
          code={`// ○ 関数を渡している。押されたときに React が呼んでくれる
<button onClick={handleClick}>押す</button>

// ✕ その場で実行して、結果を渡している
<button onClick={handleClick()}>押す</button>`}
        />

        <p>
          <code>onClick</code> は「押されたときに呼んでほしい関数」を受け取る場所です。
          <code>runTwice</code> がそうだったのと、まったく同じ仕組みです。
        </p>

        <Callout variant="point" title="括弧は「いま実行しろ」の合図">
          <p>
            括弧を付けるかどうかは、書き方の好みではありません。
            <strong>いま実行するのか、あとで実行してもらうのか</strong>という、
            意味そのものの違いです。
          </p>
        </Callout>

        <h3>引数を渡したいときは</h3>

        <p>
          「押されたときに <code>handleClick(1)</code> を呼びたい」という場合はどうするか。
          括弧を付けたら、その場で実行されてしまいます。
        </p>

        <p>
          こういうときは、<strong>それを実行するだけの新しい関数</strong>を作って渡します。
        </p>

        <StaticCode
          code={`<button onClick={() => handleClick(1)}>押す</button>`}
        />

        <p>
          渡しているのは <code>{"() => handleClick(1)"}</code> という関数です。
          この関数が呼ばれたときに、はじめて <code>handleClick(1)</code> が実行されます。
        </p>
      </LessonSection>

      <LessonSection id="quiz" {...at(VALUE)}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="const greet = () => 'こんにちは'; と書いたとき、greet と greet() の違いは？"
          options={[
            {
              label: "greet は関数そのもの、greet() は実行した結果の文字列",
              correct: true,
              explanation:
                "括弧を付けた時点で実行されます。残るのは戻り値だけで、関数はもうそこにありません。",
            },
            {
              label: "どちらも同じで、書き方が違うだけ",
              explanation:
                "まったく別の値です。片方は関数、もう片方は文字列で、型からして違います。",
            },
            {
              label: "greet はエラーになり、greet() だけが正しい書き方",
              explanation:
                "greet 単体もれっきとした値です。むしろ関数を渡すときは、括弧を付けないほうが正解です。",
            },
          ]}
        />

        <Quiz
          question="ボタンを押したときに handleClick(1) を呼びたい。正しいのはどれ？"
          options={[
            {
              label: "onClick={() => handleClick(1)}",
              correct: true,
              explanation:
                "「handleClick(1) を実行するだけの関数」を新しく作って渡しています。呼ばれるまで実行されません。",
            },
            {
              label: "onClick={handleClick(1)}",
              explanation:
                "描画された瞬間に handleClick(1) が実行され、その結果が onClick に渡ります。押す前に動いてしまいます。",
            },
            {
              label: "onClick={handleClick}",
              explanation:
                "関数を渡せてはいますが、引数の 1 が渡りません。React が呼ぶときに渡してくるのは「何が起きたか」の情報だけで、こちらが決めた値を渡す方法がないためです。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(VALUE)}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>関数も値のひとつで、変数に入れたり他の関数に渡したりできる</li>
          <li>
            <code>greet</code> は関数そのもの、<code>greet()</code> は実行した結果
          </li>
          <li>
            括弧は<strong>「いま実行しろ」の合図</strong>。付けるかどうかで意味が変わる
          </li>
          <li>
            <code>onClick</code> には関数を渡す。引数が必要なら{" "}
            <code>{"() => f(1)"}</code> の形で包む
          </li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
