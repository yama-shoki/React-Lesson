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
import { FalsyList } from "./demos/falsy-view";
import { Operators } from "./demos/operators-view";

const SLUG = "truthy-falsy";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/truthy-falsy/demos/falsy.ts", label: "falsy.ts" },
  { path: "lessons/truthy-falsy/demos/operators.ts", label: "operators.ts" },
] as const;

const [FALSY, OPERATORS] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          React で「件数が 0 のときは何も出さない」と書いたはずなのに、
          画面に <strong>0 だけがぽつんと表示される</strong>。
          これは初心者が必ず一度は遭遇するバグです。
        </p>
        <p>
          原因は <code>&amp;&amp;</code>{" "}
          という記号の性質にあります。これは「かつ」ではなく、
          <strong>値を返す演算子</strong>だからです。
        </p>
        <p>
          この章では、そのからくりを先に潰しておきます。
        </p>
      </LessonHeader>

      <LessonSection id="falsy" {...at(FALSY, "export const falsyValues")}>
        <h2>JavaScript は何でも真偽に変換する</h2>

        <p>
          <code>if</code> の中に <code>true</code> / <code>false</code>{" "}
          以外を書いても、JavaScript は文句を言いません。
          勝手に「真っぽいか、偽っぽいか」に変換して判断します。
        </p>

        <p>
          このとき<strong>偽として扱われる値は 6 つだけ</strong>です。
          これ以外は全部、真として扱われます。
        </p>

        <DemoCard
          title="偽になる値と、間違えやすい値"
          sourcePath={FALSY}
          description="空の配列も空のオブジェクトも「真」になる"
        >
          <FalsyList />
        </DemoCard>

        <Callout variant="warn" title="つまずきやすいところ">
          <p>
            <code>[]</code> や <code>{"{}"}</code>{" "}
            は「空だから偽だろう」と思いがちですが、<strong>真</strong>です。
            配列が空かどうかを調べたいときは、
            <code>list.length === 0</code> のように長さを見ます。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="operators" {...at(OPERATORS, "export const examples")}>
        <h2>&amp;&amp; と || は「値を返す」</h2>

        <p>
          （<strong>演算子</strong>とは、<code>+</code> や{" "}
          <code>&amp;&amp;</code> のような<strong>記号のこと</strong>です）
        </p>

        <p>
          ここが本題です。<code>&amp;&amp;</code> と <code>||</code> は、
          <strong>true か false を返すのではありません</strong>。
          左右どちらかの<strong>値そのもの</strong>を返します。
        </p>

        <ul>
          <li>
            <code>A &amp;&amp; B</code> … A が偽なら <strong>A</strong> を返す。真なら B を返す
          </li>
          <li>
            <code>A || B</code> … A が真なら <strong>A</strong> を返す。偽なら B を返す
          </li>
          <li>
            <code>A ?? B</code> … A が <code>null</code> か <code>undefined</code>{" "}
            のときだけ B を返す
          </li>
        </ul>

        <DemoCard
          title="同じ形でも、返るものが違う"
          sourcePath={OPERATORS}
          description="0 のときの結果に注目"
        >
          <Operators />
        </DemoCard>

        <p>
          <code>count</code> が 0 のとき、
          <code>count &amp;&amp; &quot;あり&quot;</code> の結果は{" "}
          <code>false</code> ではなく <strong>0</strong> です。
          左が偽だったので、そのまま左の値が返っています。
        </p>
      </LessonSection>

      <LessonSection id="react" {...at(OPERATORS, "count && ")}>
        <h2>これが「画面に 0 が出る」の正体</h2>

        <p>
          React では、条件によって表示を出し分けるときにこう書きます。
        </p>

        <StaticCode
          code={`{items.length && <p>{items.length} 件あります</p>}`}
        />

        <p>
          件数が 3 なら、<code>3 &amp;&amp; &lt;p&gt;...&lt;/p&gt;</code> で右側が返り、
          文章が表示されます。ここまでは意図どおりです。
        </p>

        <p>
          ところが<strong>件数が 0 のとき</strong>、この式は{" "}
          <code>0</code> を返します。そして React は、
          <strong>数値の 0 を画面に表示します</strong>。
          非表示にしたかったのに、0 という文字が残るのはこのためです。
        </p>

        <Callout variant="point" title="直し方">
          <p>
            <strong>条件をきちんと true / false にしてから</strong>{" "}
            <code>&amp;&amp;</code> に渡します。
          </p>
        </Callout>

        <StaticCode
          code={`// ✕ 0 が画面に出る
{items.length && <p>{items.length} 件あります</p>}

// ○ 比較して true / false にしてから渡す
{items.length > 0 && <p>{items.length} 件あります</p>}`}
        />

        <p>
          <code>false</code> は React が画面に出さないと決めている値なので、
          何も表示されません。
        </p>

        <Callout variant="note">
          <p>
            React が画面に出さないのは <code>null</code>、
            <code>undefined</code>、そして真偽値（<code>true</code> も{" "}
            <code>false</code> も）です。
          </p>
          <p>
            逆に、falsy なのに<strong>そのまま文字として出てしまう</strong>のが{" "}
            <code>0</code> です。
            <code>&quot;&quot;</code> も出ますが、空なので見えません。
            <strong>事故になるのは実質これだけ</strong>だと思って大丈夫です。
            （<code>NaN</code> も出ますが、
            <code>&amp;&amp;</code> の左に来る場面はまずありません）
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="nullish" {...at(OPERATORS, "count ?? ")}>
        <h3>右側は、実行されないことがある</h3>

        <p>
          <code>&amp;&amp;</code> は、
          <strong>左が偽なら、右をそもそも実行しません</strong>。
          左だけ見て答えが決まってしまうからです。
        </p>

        <StaticCode
          lang="ts"
          code={`user && user.getName()   // user が null なら、getName() は呼ばれない`}
        />

        <p>
          これは<strong>安全装置としてよく使われます</strong>。
          左が空のときに右で落ちるのを、これ 1 つで防げます。
        </p>

        <h3>3 つに分かれる書き方（三項演算子）</h3>

        <p>
          <code>&amp;&amp;</code> は「あるときだけ出す」でした。
          <strong>「A か B のどちらかを出す」</strong>ときは、別の書き方を使います。
        </p>

        <StaticCode
          lang="ts"
          code={`条件 ? 条件が真のとき : 条件が偽のとき

isLoggedIn ? "さとうさん" : "ゲスト"`}
        />

        <p>
          <code>?</code> と <code>:</code> の 3 つの部分に分かれるので
          <strong>三項演算子</strong>と呼びます。
          <code>if</code> と違って<strong>値になる</strong>ので、
          このあと JSX の中でよく使うことになります。
        </p>

        <h2>|| と ?? の使い分け</h2>

        <p>
          初期値を用意したいとき、つい <code>||</code> を使ってしまいますが、
          これも 0 で事故が起きます。
        </p>

        <StaticCode
          lang="ts"
          code={`const count = 0;

count || 10; // 10  ← 0 は偽なので置き換えられてしまう
count ?? 10; // 0   ← null / undefined でないのでそのまま`}
        />

        <p>
          「値が入っていないときだけ初期値を使いたい」のであれば、
          <strong><code>??</code> を使うのが正解</strong>です。
          <code>||</code> は 0 や空文字まで「なかったこと」にしてしまいます。
        </p>
      </LessonSection>

      <LessonSection id="quiz" {...at(OPERATORS)}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="0 && '表示' の結果は？"
          options={[
            {
              label: "0",
              correct: true,
              explanation:
                "&& は左が偽ならその左の値をそのまま返します。false ではなく 0 が返る点が重要です。",
            },
            {
              label: "false",
              explanation:
                "true / false に変換されるわけではありません。返るのは値そのものです。",
            },
            {
              label: '"表示"',
              explanation:
                "右が返るのは左が真のときだけです。0 は偽なので、右は評価されません。",
            },
          ]}
        />

        <Quiz
          question="件数が 0 のときは何も表示したくない。正しい書き方は？"
          options={[
            {
              label: "{items.length > 0 && <p>…</p>}",
              correct: true,
              explanation:
                "比較で true / false にしてから渡しているので、0 件のときは false になり、何も表示されません。",
            },
            {
              label: "{items.length && <p>…</p>}",
              explanation:
                "0 件のとき式全体が 0 になり、React はその 0 を画面に表示します。これがよくあるバグです。",
            },
            {
              label: "{items.length ?? <p>…</p>}",
              explanation:
                "?? は null / undefined のときだけ右を返す演算子です。この場面では常に件数が返ってしまいます。",
            },
          ]}
        />

        <Quiz
          question="const count = 0; のとき、count ?? 10 の結果は？"
          options={[
            {
              label: "0",
              correct: true,
              explanation:
                "?? が右を返すのは null か undefined のときだけです。0 はどちらでもないので、そのまま返ります。",
            },
            {
              label: "10",
              explanation:
                "10 になるのは || を使ったときです。|| は 0 を偽とみなして置き換えてしまいます。",
            },
            {
              label: "エラーになる",
              explanation:
                "?? は数値にも問題なく使えます。むしろ 0 を正しく扱いたいときの選択肢です。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(FALSY)}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            偽として扱われるのは <code>false, 0, &quot;&quot;, null, undefined, NaN</code>{" "}
            の 6 つだけ。空の配列やオブジェクトは<strong>真</strong>
          </li>
          <li>
            <code>&amp;&amp;</code> と <code>||</code> は true / false ではなく
            <strong>値そのもの</strong>を返す
          </li>
          <li>
            <code>{"{count && <p>…</p>}"}</code> は、count が 0 のとき画面に 0 を出す。
            <code>count &gt; 0 &amp;&amp;</code> と書けば防げる
          </li>
          <li>
            初期値を入れたいときは <code>||</code> ではなく <code>??</code>
          </li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
