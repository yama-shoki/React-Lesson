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
import { MemberType } from "./demos/member-type-view";
import { UnionType } from "./demos/union-type-view";

const SLUG = "typescript-basics";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/typescript-basics/demos/member-type.ts", label: "member-type.ts" },
  { path: "lessons/typescript-basics/demos/union-type.ts", label: "union-type.ts" },
] as const;

const [MEMBER, UNION] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          TypeScript は、JavaScript に
          <strong>「この値はこういう形をしている」という説明を書き足せる</strong>
          ようにしたものです。別の言語ではありません。
        </p>
        <p>
          型は書く手間が増えるだけに見えますが、実際は逆です。
          <strong>書く量より、間違いを探す時間のほうがずっと減ります。</strong>
        </p>
        <p>
          この章では、React を読むために最低限必要なところだけをやります。
          全部を覚える必要はありません。
        </p>
      </LessonHeader>

      <LessonSection id="why" {...at(MEMBER, "type Member")}>
        <h2>型があると何が変わるか</h2>

        <p>
          型がないと、間違いは<strong>動かしてみるまで分かりません</strong>。
        </p>

        <StaticCode
          lang="js"
          code={`// JavaScript
const user = { name: "さとう" };

console.log(user.nmae); // undefined（打ち間違いに気づけない）`}
        />

        <p>
          <code>nmae</code> と打ち間違えても、JavaScript
          は何も言わずに <code>undefined</code> を返します。
          画面に何も出ない理由を探して何十分も溶かす、というのがよくある流れです。
        </p>

        <p>型を書いておくと、書いているその場で赤線が引かれます。</p>

        <StaticCode
          lang="ts"
          code={`// TypeScript
type User = { name: string };

const user: User = { name: "さとう" };

user.nmae; // エラー: User に nmae はありません`}
        />

        <Callout variant="point" title="型のいちばんの利点">
          <p>
            間違いを<strong>実行する前に</strong>見つけられること。
            そして、エディタが候補を出してくれるので
            <strong>そもそも打ち間違えなくなる</strong>ことです。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="basics" {...at(MEMBER, "type Member")}>
        <h2>書き方は「値のうしろに : 型」</h2>

        <StaticCode
          lang="ts"
          code={`const name: string = "さとう";
const age: number = 20;
const isAdmin: boolean = false;

// 配列は「何の配列か」を書く
const names: string[] = ["さとう", "すずき"];

// オブジェクトは形をそのまま書く
const user: { name: string; age: number } = { name: "さとう", age: 20 };`}
        />

        <p>
          ただし、ほとんどの場合<strong>型を書く必要はありません</strong>。
          代入した値から自動で判断してくれるからです。
        </p>

        <StaticCode
          lang="ts"
          code={`const name = "さとう"; // string だと分かってくれる`}
        />

        <p>
          型を明示するのは、主に<strong>関数の引数</strong>と
          <strong>データの形を決めるとき</strong>です。
          React では、これが props の型になります。
        </p>

        <h3>type で形に名前をつける</h3>

        <p>
          同じ形を何度も書くのは大変なので、名前をつけて使い回します。
        </p>

        <StaticCode
          lang="ts"
          code={`type Member = {
  id: number;
  name: string;
  nickname?: string; // ? は「なくてもいい」
};`}
        />

        <p>
          <code>?</code> を付けた項目は、あってもなくても構いません。
          その代わり、使うときは<strong>「ないかもしれない」前提</strong>で扱う必要があります。
        </p>

        <DemoCard
          title="あってもなくてもいい項目"
          sourcePath={MEMBER}
          description="nickname がない人は name で表示される"
        >
          <MemberType />
        </DemoCard>

        <p>
          <code>member.nickname ?? member.name</code> の <code>??</code> は前の章でやったものです。
          TypeScript は「nickname は undefined かもしれない」と知っています。
          なので <code>nickname.length</code> のように
          <strong>文字列として扱おうとすると警告してくれます</strong>。
          <strong>型が、書き忘れを防いでくれている</strong>わけです。
        </p>

        <p>
          ただし<strong>画面にそのまま出すだけなら通ってしまいます</strong>。
          何も出ない、という形で気づくことになります。
          <code>??</code> は自分で書く必要があります。
        </p>
      </LessonSection>

      <LessonSection id="union" {...at(UNION, "export type Status")}>
        <h2>取りうる値を決めてしまう</h2>

        <p>
          TypeScript でいちばん便利なのが、
          <strong>「この値はこの 3 つのどれか」</strong>と決められることです。
        </p>

        <StaticCode
          lang="ts"
          code={`type Status = "todo" | "doing" | "done";

const status: Status = "doing"; // OK
const wrong: Status = "yet";    // エラー`}
        />

        <p>
          縦棒（<code>|</code>）で区切って並べるだけです。これを union と呼びます。
          文字列を直接書けるので、ステータスや種類を表すのにぴったりです。
        </p>

        <DemoCard
          title="状態ごとの表示を作る"
          sourcePath={UNION}
          description="status に想定外の値が入る余地がない"
        >
          <UnionType />
        </DemoCard>

        <p>
          <code>Record&lt;Status, string&gt;</code> は
          「Status のすべてに対して文字列を用意する」という意味です。
        </p>

        <p>
          <code>&lt;&gt;</code> が急に出てきましたが、これは
          <strong>型に渡す引数</strong>です。関数が <code>(引数)</code> を取るように、
          型も <code>&lt;型&gt;</code> を取ることがある、とだけ思ってください。
          <code>Record&lt;キーの型, 値の型&gt;</code> と読みます。
          あとから <code>Status</code> に種類を足すと、
          <strong>用意し忘れた場所がエラーで教えてもらえます</strong>。
          これが型のありがたみを最も感じる瞬間です。
        </p>
      </LessonSection>

      <LessonSection id="react" {...at(MEMBER, "type Member")}>
        <h2>React ではこう使う</h2>

        <p>
          型を書く場所は、React ではほぼ 1 か所です。
          <strong>コンポーネントが受け取る値（props）</strong>のところ。
        </p>

        <StaticCode
          code={`type Props = {
  name: string;
  age?: number;
};

function Profile({ name, age }: Props) {
  return <p>{name}（{age ?? "非公開"}）</p>;
}`}
        />

        <p>
          ここには、Part 0 でやったことがすべて出てきています。
        </p>

        <ul>
          <li>
            <code>{"{ name, age }"}</code> … 分割代入
          </li>
          <li>
            <code>: Props</code> … 型注釈
          </li>
          <li>
            <code>age?</code> … あってもなくてもいい項目
          </li>
          <li>
            <code>??</code> … ないときの代わりの値
          </li>
        </ul>

        <p>
          この形が読めるようになれば、React のコンポーネントは
          ほぼすべて読めます。Part 2 でここを本格的に扱います。
        </p>
      </LessonSection>

      <LessonSection id="quiz" {...at(MEMBER)}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="type Member = { name: string; nickname?: string } の ? は何を意味する？"
          options={[
            {
              label: "その項目はなくてもよい（undefined かもしれない）",
              correct: true,
              explanation:
                "任意の項目になります。その代わり、使うときは「ないかもしれない」前提で扱う必要があります。",
            },
            {
              label: "その項目は必ず必要",
              explanation:
                "逆です。? が付いていない項目のほうが必須になります。",
            },
            {
              label: "その項目の型が不明という意味",
              explanation:
                "型は string のままです。不明なのは型ではなく「あるかどうか」です。",
            },
          ]}
        />

        <Quiz
          question="type Status = 'todo' | 'doing' | 'done' の利点は？"
          options={[
            {
              label: "決めた 3 つ以外の値を入れられなくなる",
              correct: true,
              explanation:
                "打ち間違いや想定外の値が入る余地がなくなります。あとから種類を足したとき、対応し忘れた場所も教えてもらえます。",
            },
            {
              label: "文字列を 3 つまでしか使えなくなる",
              explanation:
                "文字列の数に制限がかかるわけではありません。この Status 型の値として許されるものを決めているだけです。",
            },
            {
              label: "実行時に自動で値をチェックしてくれる",
              explanation:
                "型のチェックは書いている最中とビルド時だけです。実行時のチェックが必要な場面では、別の仕組みを使います。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(MEMBER)}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>TypeScript は JavaScript に「値の形の説明」を足したもの</li>
          <li>
            型の利点は、間違いを<strong>実行する前に</strong>見つけられること
          </li>
          <li>
            ほとんどは自動で判断されるので、書くのは
            <strong>関数の引数とデータの形</strong>くらい
          </li>
          <li>
            <code>?</code> は任意の項目、<code>|</code> は「このどれか」
          </li>
          <li>React では props の型として使う。Part 2 で本格的に扱う</li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
