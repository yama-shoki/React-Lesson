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
import { AliasView } from "./demos/alias-view";
import { ReferenceView } from "./demos/reference-view";
import { TwoLabelsFigure } from "./figures/two-labels";

const SLUG = "objects-and-references";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  {
    path: "lessons/objects-and-references/demos/object-basics.ts",
    label: "object-basics.ts",
  },
  {
    path: "lessons/objects-and-references/demos/reference.ts",
    label: "reference.ts",
  },
] as const;

const [BASICS, REFERENCE] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          React で扱うデータは、ほとんどが<strong>オブジェクト</strong>です。
          props もオブジェクト、state に入れるデータもたいていオブジェクト、
          画面に並べるリストも<strong>オブジェクトの配列</strong>です。
        </p>
        <p>
          そしてオブジェクトには、数値や文字列とは違う性質があります。
          この性質を知らないままだと、
          <strong>この先ずっと「なぜか動かない」に出会い続けます</strong>。
        </p>
      </LessonHeader>

      <LessonSection id="basics" {...at(BASICS, "export const user = {")}>
        <h2>オブジェクトは、名前の付いた値の集まり</h2>

        <p>
          関連する値をひとまとめにしたものがオブジェクトです。
          <code>{"{ }"}</code> の中に、
          <strong>名前と値の組</strong>を並べて作ります。
        </p>

        <StaticCode
          lang="ts"
          code={`const user = {
  name: "さとう",
  age: 20,
  admin: false,
};`}
        />

        <p>
          この <code>name</code> や <code>age</code> を
          <strong>プロパティ</strong>と呼びます。
          取り出すときは <code>.</code> でつなぎます。
        </p>

        <StaticCode
          lang="ts"
          code={`user.name  // "さとう"
user.age   // 20`}
        />

        <Callout variant="note" title="角かっこの書き方">
          <p>
            <code>user[&quot;age&quot;]</code> という書き方もあります。
            見た目は違いますが、やっていることは同じです。
          </p>
          <p>
            使い分けは単純で、
            <strong>取り出したい名前が変数に入っているときだけ</strong>{" "}
            角かっこを使います。
            それ以外は <code>.</code> のほうが読みやすいです。
          </p>
        </Callout>

        <h3>入れ子にもできる</h3>

        <StaticCode
          lang="ts"
          code={`const member = {
  name: "すずき",
  address: { city: "東京" },
};

member.address.city  // "東京"`}
        />

        <h3>そして、配列に入れる</h3>

        <p>
          React で画面に一覧を出すとき、元になるデータはほぼこの形です。
        </p>

        <StaticCode
          lang="ts"
          code={`const members = [
  { id: 1, name: "さとう" },
  { id: 2, name: "すずき" },
];`}
        />

        <p>
          <strong>オブジェクトの配列</strong>です。
          配列の <code>map</code> の章で「実際のデータはたいていこの形」と
          出てくるのは、これのことです。
        </p>
      </LessonSection>

      <LessonSection id="equality" {...at(REFERENCE, "export const box1")}>
        <h2>見た目が同じでも、同じとはかぎらない</h2>

        <p>
          ここからが本題です。
          <strong>2 つの値が同じかどうか</strong>を調べるとき、
          JavaScript は <code>===</code> を使います。
        </p>

        <DemoCard
          title="いろいろな組み合わせを比べる"
          sourcePath={REFERENCE}
          description="どれが true で、どれが false になると思いますか"
        >
          <ReferenceView />
        </DemoCard>

        <p>
          数値と文字列は、予想どおりだと思います。
          問題は下の 2 つです。
          <strong>まったく同じ見た目なのに false</strong> になりました。
        </p>

        <p>
          数値や文字列は「値そのもの」を比べます。
          ところが<strong>オブジェクトと配列は違います</strong>。
          比べているのは中身ではなく、
          <strong>同じ箱を指しているかどうか</strong>です。
        </p>

        <TwoLabelsFigure />

        <p>
          <code>{`{ name: "さとう" }`}</code> と書くたびに、
          <strong>新しい箱が 1 つ作られます</strong>。
          中身が同じでも、別々に作った以上は別の箱です。
          だから <code>===</code> は false を返します。
        </p>

        <Callout variant="note" title="この「箱を指している」を参照と呼びます">
          <p>
            名札が箱を指している、というこの関係を
            <strong>参照</strong>と呼びます。
            記事や同僚の口からは、
            <strong>「参照が同じ」「参照が変わる」</strong>という言い方で出てきます。
          </p>
          <p>
            この教材では分かりやすさを優先して「箱」「名札」で通しますが、
            <strong>言っていることは同じ</strong>です。
            外で「参照」を見かけたら、この絵を思い出してください。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="alias" {...at(REFERENCE, "export const box3 = box1")}>
        <h2>代入で写されるのは「どの箱か」</h2>

        <p>
          では、オブジェクトを別の名前に入れるとどうなるでしょうか。
        </p>

        <StaticCode
          lang="ts"
          code={`const original = { name: "さとう" };
const copy = original;

copy.name = "すずき";`}
        />

        <p>
          <code>copy</code> の名前を書き換えました。
          <code>original</code> はどうなっていると思いますか。
        </p>

        <DemoCard
          title="写してから、片方を書き換える"
          sourcePath={REFERENCE}
          description="2 つのボタンで結果を見比べる"
        >
          <AliasView />
        </DemoCard>

        <p>
          <strong>両方とも「すずき」になります。</strong>
          <code>copy = original</code> で写されたのは中身ではなく、
          <strong>どの箱を指すか</strong>だけだからです。
          名札が 2 枚になっただけで、箱は 1 つしかありません。
        </p>

        <p>
          右のボタン（新しい箱を作って写す）を押すと、結果が変わります。
          <code>{`{ name: original.name }`}</code> と書いた時点で
          <strong>別の箱が作られている</strong>ので、
          書き換えても元には影響しません。
        </p>

        <Callout variant="warn" title="コピーしたつもりが、していない">
          <p>
            <code>const copy = original</code> は
            <strong>コピーではありません</strong>。
            「同じものに、もう 1 つ名前を付けた」だけです。
          </p>
          <p>
            ここを取り違えたまま書くと、
            「あるはずのないところが書き換わっている」という、
            いちばん追いにくいバグになります。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="react" {...at(REFERENCE, "export const sameLooking")}>
        <h2>なぜ React でこれが効いてくるのか</h2>

        <p>
          React は、何かが変わったかどうかを判断するときに
          <strong>この <code>===</code> と同じ判定</strong>を使います。
          中身を 1 つずつ見比べたりはしません。
          <strong>同じ箱かどうか</strong>だけを見ます。
        </p>

        <p>
          この判定が、これから先ずっと顔を出します。
        </p>

        <ul>
          <li>
            <strong>state を書き換えたのに画面が変わらない</strong> …{" "}
            同じ箱のままだから、React は「変わっていない」と判断する
          </li>
          <li>
            <strong>毎回同じはずの値で、処理が動き続ける</strong> …{" "}
            書くたびに新しい箱ができているから、React は「変わった」と判断する
          </li>
        </ul>

        <p>ぴんと来ないと思うので、形だけ見ておきます。</p>

        <StaticCode
          lang="ts"
          code={`// 1 つめ … 配列に足したのに、画面が変わらない
items.push("みかん");
setItems(items);        // 同じ箱を渡している

// 2 つめ … 中身は毎回同じなのに、処理が止まらない
const options = { unit: "回" };   // 書くたびに新しい箱`}
        />

        <p>
          どちらも Part 4 以降で、実際に動かしながらやります。
          <strong>いまは「同じ箱かどうかで決まる」だけ持っていってください。</strong>
        </p>

        <p>
          どちらも<strong>同じ 1 つの性質</strong>から出ています。
          症状は正反対ですが、原因は同じです。
        </p>

        <Callout variant="point" title="いま覚えるのはこれだけ">
          <p>
            <strong>
              オブジェクトと配列は、中身ではなく「同じ箱か」で比べられる。
            </strong>
          </p>
          <p>
            React 側の話は、Part 4「オブジェクトと配列の更新」から始まります。
            そこに着いたとき、この章を思い出せれば十分です。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="quiz" {...at(REFERENCE, "export const sameBox")}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question={`const a = { x: 1 }; const b = { x: 1 }; のとき a === b は？`}
          options={[
            {
              label: "false。別々に作った箱なので、中身が同じでも別のもの",
              correct: true,
              explanation:
                "{ } と書くたびに新しい箱が作られます。=== が見ているのは中身ではなく、同じ箱を指しているかどうかです。",
            },
            {
              label: "true。中身が同じだから",
              explanation:
                "中身を見比べてくれるのは数値や文字列のときだけです。オブジェクトと配列は、同じ箱かどうかで判定されます。",
            },
            {
              label: "エラーになる。オブジェクトどうしは比べられない",
              explanation:
                "比べること自体はできます。ただし比べているのは中身ではありません。",
            },
          ]}
        />

        <Quiz
          question={`const a = { x: 1 }; const b = a; b.x = 2; のとき a.x は？`}
          options={[
            {
              label: "2。a と b は同じ箱を指している",
              correct: true,
              explanation:
                "const b = a で写されるのは「どの箱か」だけです。名札が 2 枚になっただけで、箱は 1 つしかありません。",
            },
            {
              label: "1。b に写した時点でコピーされている",
              explanation:
                "コピーはされていません。コピーしたければ、新しいオブジェクトを作る必要があります。",
            },
            {
              label: "1。const なので書き換えられない",
              explanation:
                "const が固定するのは名札の付け先だけです。箱の中身は書き換えられます（変数と const の章で見たとおりです）。",
            },
          ]}
        />

        <Quiz
          question="React が「値が変わった」と判断するのは、どんなとき？"
          options={[
            {
              label: "比べた 2 つが、同じ箱を指していないとき",
              correct: true,
              explanation:
                "中身の見比べはしません。だから中身が同じでも新しく作れば「変わった」になり、中身を書き換えても同じ箱なら「変わっていない」になります。",
            },
            {
              label: "中身のどれか 1 つでも違っているとき",
              explanation:
                "毎回すべての中身を見比べるのは重い処理です。React は同じ箱かどうかだけを見ます。",
            },
            {
              label: "画面に出ている文字が変わったとき",
              explanation:
                "React は画面を見て判断しているのではありません。渡された値どうしを比べています。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(REFERENCE)}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            オブジェクトは<strong>名前と値の組</strong>の集まり。
            <code>.</code> で取り出す
          </li>
          <li>
            React で扱うデータは、たいてい
            <strong>オブジェクトの配列</strong>
          </li>
          <li>
            オブジェクトと配列は、
            <strong>中身ではなく「同じ箱か」で比べられる</strong>
          </li>
          <li>
            <code>{"{ }"}</code> と書くたびに<strong>新しい箱</strong>ができる
          </li>
          <li>
            <code>b = a</code> は<strong>コピーではない</strong>。
            名札が 2 枚になるだけ
          </li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
