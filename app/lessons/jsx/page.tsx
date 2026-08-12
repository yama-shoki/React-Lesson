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
import { JsxExpression } from "./demos/jsx-expression";
import { JsxValue } from "./demos/jsx-value";

const SLUG = "jsx";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/jsx/demos/jsx-expression.tsx", label: "jsx-expression.tsx" },
  { path: "lessons/jsx/demos/jsx-value.tsx", label: "jsx-value.tsx" },
] as const;

const [EXPRESSION, VALUE] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          React のコードを開くと、JavaScript の中に
          いきなり HTML のようなものが書いてあって面食らいます。
        </p>
        <p>
          これは <strong>JSX</strong> と呼ばれる書き方で、
          <strong>HTML ではありません</strong>。
          見た目が似ているだけで、正体は JavaScript です。
        </p>
        <p>
          そこを取り違えると、「なぜ class ではなく className なのか」
          「なぜ波括弧が必要なのか」がずっと腑に落ちないままになります。
        </p>
      </LessonHeader>

      <LessonSection id="what" {...at(EXPRESSION, "return (")}>
        <h2>JSX は JavaScript に変換される</h2>

        <p>
          JSX はそのままブラウザに届くわけではありません。
          <strong>ビルド</strong>（＝書いたコードを、ブラウザが読める形に変換する作業）
          のときに、ふつうの JavaScript の関数呼び出しに書き換えられます。
        </p>

        <StaticCode
          code={`// 書いているもの
<p className="text">こんにちは</p>

// 変換されたもの（イメージ）
jsx("p", { className: "text", children: "こんにちは" })`}
        />

        <p>
          つまり JSX は<strong>「関数呼び出しの見た目を HTML 風にしたもの」</strong>です。
          タグに見えているものは、実際には関数の引数です。
        </p>

        <Callout variant="point" title="ここが分かると全部つながる">
          <p>
            JSX が関数呼び出しなら、その結果は<strong>値</strong>です。
            値なので変数に入れられるし、配列にも入れられるし、
            関数から返すこともできます。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="braces" {...at(EXPRESSION, "{price * 1.1}")}>
        <h2>波括弧で JavaScript に戻る</h2>

        <p>
          JSX の中で <code>{"{ }"}</code> を書くと、そこだけ JavaScript に戻ります。
          中には<strong>式なら何でも</strong>書けます。
        </p>

        <DemoCard
          title="いろいろな式を埋め込む"
          sourcePath={EXPRESSION}
          description="変数・計算・メソッド呼び出し・条件"
        >
          <JsxExpression />
        </DemoCard>

        <p>
          ポイントは<strong>「式」しか書けない</strong>ことです。
          値になるものは書けますが、値にならないものは書けません。
        </p>

        <StaticCode
          code={`{name}                       // OK（値になる）
{price * 1.1}                // OK
{isOpen ? "開" : "閉"}       // OK（三項演算子は式）

{if (isOpen) { ... }}        // NG（if は式ではない）
{for (...) { ... }}          // NG`}
        />

        <p>
          <code>if</code> や <code>for</code>{" "}
          が書けないのは、それらが値にならないからです。
          だから React では、条件分岐に三項演算子や{" "}
          <code>&amp;&amp;</code> を使い、繰り返しに <code>map</code> を使います。
          <strong>どちらも式だからです。</strong>
        </p>
      </LessonSection>

      <LessonSection id="value" {...at(VALUE, "const badge")}>
        <h2>JSX は値なので、持ち回せる</h2>

        <p>
          JSX が値だということを、実際に確かめてみます。
          変数に入れることも、配列に入れることもできます。
        </p>

        <DemoCard
          title="変数に入れる / 配列に入れる"
          sourcePath={VALUE}
          description="badge を 2 か所で使い回している"
        >
          <JsxValue />
        </DemoCard>

        <p>
          <code>map</code> が JSX の配列を作っているのも、これと同じことです。
          Part 0 でやった「map は新しい配列を返す」が、
          そのまま<strong>「JSX の配列を返す」</strong>になっているだけです。
        </p>
      </LessonSection>

      <LessonSection id="rules" {...at(EXPRESSION, "className")}>
        <h2>HTML と違うところ</h2>

        <p>
          JSX は JavaScript なので、HTML の書き方がそのままでは使えない箇所があります。
          数は多くありません。
        </p>

        <h3>class ではなく className</h3>

        <p>
          JSX の属性名は、<strong>ブラウザが持っているプロパティ名にそろえてあります</strong>。
          JavaScript から要素の class を触るときは{" "}
          <code>element.className</code> と書くので、JSX でも{" "}
          <code>className</code> です。同じ理由で <code>for</code> は{" "}
          <code>htmlFor</code>（<code>label.htmlFor</code>）になります。
        </p>

        <p>
          ブラウザ側がこの名前になっているのは、昔の JavaScript で{" "}
          <code>class</code> を<strong>プロパティ名に使えなかった</strong>名残です。
          （<code>class</code> は今も特別な単語で、
          <code>const class = 1</code> とは書けません。
          ですが <code>obj.class</code> のような
          <strong>プロパティ名としてなら使えます</strong>）
          いまは使えるのですが、名前だけが残っています。
        </p>

        <h3>属性はキャメルケース</h3>

        <p>
          <strong>キャメルケース</strong>とは、
          <code>onChange</code> のように
          <strong>単語の切れ目を大文字にする書き方</strong>のことです。
          らくだ（camel）のこぶに見えることからこの名前が付いています。
        </p>

        <StaticCode
          code={`<input onChange={...} maxLength={10} tabIndex={0} />`}
        />

        <p>
          <code>onchange</code> ではなく <code>onChange</code>。
          JavaScript のオブジェクトのキーとして書かれるので、
          JavaScript の命名にそろえてあります。
        </p>

        <p>
          ただし <code>aria-label</code> や <code>data-id</code> は例外で、
          <strong>HTML と同じくハイフンのまま</strong>書きます。
          この 2 種類だけは、そういうものだと覚えてください。
        </p>

        <h3>タグは必ず閉じる</h3>

        <StaticCode
          code={`<br />   // ○ 自分で閉じる
<br>     // ✕ エラーになる`}
        />

        <h3>返せるのはひとつだけ</h3>

        <p>
          関数が返せる値はひとつなので、JSX も一番外側はひとつでなければいけません。
          ただ、そのために余計な <code>div</code> を増やしたくないときは、
          名前のないタグで囲みます。
        </p>

        <StaticCode
          code={`// 余計な div が増えてしまう
<div>
  <p>A</p>
  <p>B</p>
</div>

// 画面には何も出ない、まとめるためだけのタグ
<>
  <p>A</p>
  <p>B</p>
</>`}
        />

        <p>
          <code>{"<> </>"}</code> は Fragment と呼ばれます。
          「まとめたいだけで、要素は増やしたくない」ときに使います。
        </p>

        <Callout variant="note" title="TSX という呼び方">
          <p>
            TypeScript で JSX を書くとき、ファイルの拡張子は{" "}
            <code>.tsx</code> になります。
            中身は JSX と同じで、そこに型が付けられるだけです。
            JSX を含むファイルが <code>.tsx</code>、含まないものは{" "}
            <code>.ts</code> です。Part 0 の右ペインに{" "}
            <code>const-object.ts</code> と出ていたのは後者でした。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="quiz" {...at(EXPRESSION)}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="JSX の中で if 文が書けないのはなぜ？"
          options={[
            {
              label: "波括弧の中には式しか書けず、if は値にならないから",
              correct: true,
              explanation:
                "JSX は最終的に関数の引数になるので、値になるものしか置けません。三項演算子や && が使われるのは、それらが式だからです。",
            },
            {
              label: "React が if を禁止しているから",
              explanation:
                "React の制限ではなく、JavaScript の文法上の性質です。JSX の外側であれば if は自由に書けます。",
            },
            {
              label: "if を書くと動作が遅くなるから",
              explanation:
                "速度の問題ではありません。そもそも文法として書けません。",
            },
          ]}
        />

        <Quiz
          question="class ではなく className と書くのはなぜ？"
          options={[
            {
              label: "ブラウザ側のプロパティ名が element.className だから",
              correct: true,
              explanation:
                "JSX の属性名は、ブラウザが持っているプロパティ名にそろえてあります。同じ理由で for は htmlFor です。",
            },
            {
              label: "class が JavaScript の予約語で、属性名にできないから",
              explanation:
                "JSX の属性名は、予約語でも構文上は問題ありません。className になっているのは、ブラウザ側のプロパティ名に合わせた結果です。",
            },
            {
              label: "CSS のクラスとは別のものを指しているから",
              explanation:
                "指しているものは HTML の class と同じです。名前だけが違います。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(EXPRESSION)}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            JSX は HTML ではなく、<strong>関数呼び出しに変換される JavaScript</strong>
          </li>
          <li>
            結果は<strong>値</strong>なので、変数にも配列にも入れられる
          </li>
          <li>
            <code>{"{ }"}</code> の中には<strong>式</strong>しか書けない。
            だから <code>if</code> ではなく三項演算子、<code>for</code> ではなく <code>map</code>
          </li>
          <li>
            <code>className</code> やキャメルケースは、JavaScript
            の都合に合わせた結果
          </li>
          <li>
            一番外側はひとつだけ。増やしたくないときは <code>{"<> </>"}</code>
          </li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
