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
import { ConstArray } from "./demos/const-array-view";
import { ConstObject } from "./demos/const-object-view";
import { ConstBoxFigure } from "./figures/const-box";

const SLUG = "variables";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

/*
  Part 0 はまだ JSX を扱っていないので、右のコードには「動きの部分」だけを出す。
  画面に結果を出す JSX は同名の -view.tsx に置いてあり、そちらは読者に見せない。
*/
const SOURCES = [
  { path: "lessons/variables/demos/const-object.ts", label: "const-object.ts" },
  { path: "lessons/variables/demos/const-array.ts", label: "const-array.ts" },
] as const;

const [OBJECT, ARRAY] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          React のコードを開くと、いちばん最初に目に入るのが <code>const</code>{" "}
          です。ほとんどの行がこれで始まっていると言ってもいいくらいです。
        </p>
        <p>
          <code>const</code> は「変わらない値」だと説明されることが多いのですが、
          それだけだと<strong>あとで必ずつまずきます</strong>。
          const で作ったはずのデータが、いつのまにか書き換わっているからです。
        </p>
        <p>
          この章では、const が実際には何を守っているのかをはっきりさせます。
        </p>
      </LessonHeader>

      <LessonSection id="what" {...at(OBJECT, "export const user")}>
        <h2>変数は、値につけた名前</h2>

        <p>
          プログラムでは、あとで使いたい値に名前をつけておきます。これが変数です。
        </p>

        <StaticCode
          lang="ts"
          code={`const name = "さとう";

console.log(name); // "さとう"`}
        />

        <p>
          これで「<code>name</code> と書いたら <code>&quot;さとう&quot;</code>{" "}
          のこと」という約束ができました。
          名前をつけておくと、同じ値を何度も書かずに済みますし、
          その値が何を表しているのかが読む人に伝わります。
        </p>
      </LessonSection>

      <LessonSection id="const-let" {...at(OBJECT, "// user = {")}>
        <Callout variant="note" title="文字列に変数を混ぜる書き方">
          <p>
            この先のコードに、見慣れない引用符が出てきます。
          </p>
          <StaticCode
            lang="ts"
            code={`const name = "さとう";

"こんにちは、" + name + " さん"     // つなげて書く
\`こんにちは、\${name} さん\`         // 同じ意味。こちらが今の主流`}
          />
          <p>
            囲んでいるのは <strong>バッククォート</strong>（Shift + @）です。
            中で <code>{"${ }"}</code> と書くと、そこに変数の中身が入ります。
          </p>
          <p>
            あとで出てくる JSX の <code>{"{ }"}</code> とは
            <strong>別物</strong>です。こちらは文字列の中でだけ使います。
          </p>
        </Callout>

        <h2>const と let</h2>

        <p>変数を作る方法は、いまは 2 つだけ覚えれば十分です。</p>

        <StaticCode
          lang="ts"
          code={`const name = "さとう";
name = "すずき"; // エラー。あとから入れ直せない

let count = 0;
count = 1; // これは通る`}
        />

        <ul>
          <li>
            <code>const</code> … あとから別の値を入れ直せない
          </li>
          <li>
            <code>let</code> … 入れ直せる
          </li>
        </ul>

        <p>
          <code>var</code> という古い書き方もありますが、
          いま新しく書くコードでは使いません。見かけたら「古いコードだ」と思って大丈夫です。
        </p>

        <h3>React ではほとんど const</h3>

        <p>
          React のコードを見ると、変数がほぼ全部 <code>const</code> です。
          これは行儀の問題ではなく、React の考え方がそうなっているからです。
        </p>

        <p>
          React では、値を書き換えて画面を変える、ということをしません。
          <strong>新しい値を作って React に渡す</strong>と、React が画面を描き直します。
          書き換えないので、入れ直せる必要がないのです。
        </p>

        <Callout variant="note">
          <p>
            この「書き換えずに新しく作る」という考え方は、Part 4
            の state のところで本格的に出てきます。
            いまは「const が基本、どうしても必要なときだけ let」とだけ覚えておいてください。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="not-frozen" {...at(OBJECT, "user.name =")}>
        <h2>const が守るのは「名札」だけ</h2>

        <p>
          ここが、この章でいちばん大事なところです。
        </p>

        <p>
          <code>const</code> は「値を変えられなくするもの」ではありません。
          <strong>「その名前に、別の値を入れ直せなくするもの」</strong>です。
          名前と値の結びつきを固定しているだけで、値そのものには手を出していません。
        </p>

        <ConstBoxFigure />

        <p>
          文字列や数値のような単純な値なら、この違いは表に出てきません。
          「入れ直せない」＝「変えられない」と考えても、結果は同じだからです。
        </p>

        <p>
          問題はオブジェクトと配列です。これらは<strong>中身を持っています</strong>。
          そして中身の書き換えは、名札の付け替えではありません。
        </p>

        <DemoCard
          title="const のオブジェクト"
          sourcePath={OBJECT}
          description="入れ替えていないので、const でも止められない"
        >
          <ConstObject />
        </DemoCard>

        <p>
          <code>user = ...</code> なら「名札の付け替え」なのでエラーになりますが、
          <code>user.name = ...</code> は「箱の中身の書き換え」なので通ってしまいます。
        </p>
      </LessonSection>

      <LessonSection id="array" {...at(ARRAY, "members.push")}>
        <h3>配列も同じ</h3>

        <p>
          配列も中身を持っているので、同じことが起きます。
          <code>push</code> は「配列を入れ替える」操作ではなく
          「配列の中に足す」操作なので、const でも通ります。
        </p>

        <DemoCard
          title="const の配列"
          sourcePath={ARRAY}
          description="要素が 3 つに増えている"
        >
          <ConstArray />
        </DemoCard>

        <Callout variant="warn" title="React でいちばん多いバグの原因">
          <p>
            この「const なのに中身が変わる」は、React
            で最もよく起きるバグの原因のひとつです。
            配列に <code>push</code> したのに画面が変わらない、という現象がその代表です。
          </p>
          <p>
            なぜそうなるのかは Part 4 で扱います。
            ここでは<strong>「const は中身までは守ってくれない」</strong>とだけ覚えてください。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="quiz" {...at(OBJECT)}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="const で作った変数について、正しいのはどれ？"
          options={[
            {
              label: "別の値を入れ直せないが、オブジェクトの中身は書き換えられる",
              correct: true,
              explanation:
                "const が固定するのは名前と値の結びつきだけです。オブジェクトや配列の中身には関与しません。",
            },
            {
              label: "中身を含めて、いっさい変更できない",
              explanation:
                "これがよくある誤解です。中身の書き換えは止められません。完全に凍らせたい場合は Object.freeze という別の仕組みが必要です。",
            },
            {
              label: "数値には使えるが、オブジェクトには使えない",
              explanation:
                "オブジェクトにも使えます。むしろ React ではオブジェクトや配列を const で置くことのほうが多いです。",
            },
          ]}
        />

        <Quiz
          question="次のうち、エラーになるのはどれ？"
          options={[
            {
              label: 'const user = { name: "さとう" }; のあとに user = { name: "すずき" };',
              correct: true,
              explanation:
                "user という名前に別のオブジェクトを入れ直そうとしているので、エラーになります。",
            },
            {
              label: 'const user = { name: "さとう" }; のあとに user.name = "すずき";',
              explanation:
                "これは通ります。名札はそのままで、箱の中身だけを書き換えているためです。",
            },
            {
              label: "const list = []; のあとに list.push(1);",
              explanation:
                "これも通ります。push は配列の中身を変える操作で、list という名前の付け先は変わっていません。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(OBJECT)}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>変数は、値につけた名前</li>
          <li>
            <code>const</code> は<strong>名前と値の結びつき</strong>を固定する
          </li>
          <li>
            固定されるのは名札だけで、オブジェクトや配列の
            <strong>中身は書き換えられてしまう</strong>
          </li>
          <li>React では基本的に const を使い、let はほとんど出てこない</li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
