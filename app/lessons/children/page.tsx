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
import { ChildrenBasic } from "./demos/children-basic";
import { ChildrenSlots } from "./demos/children-slots";

const SLUG = "children";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/children/demos/children-basic.tsx", label: "children-basic.tsx" },
  { path: "lessons/children/demos/children-slots.tsx", label: "children-slots.tsx" },
] as const;

const [BASIC, SLOTS] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          HTML では、タグで何かを囲むのが当たり前でした。
        </p>
        <p>
          <code>{"<div><p>中身</p></div>"}</code>
        </p>
        <p>
          自分で作ったコンポーネントでも、同じことができます。
          そして囲んだ中身は、<strong>props として届きます</strong>。
          その名前が <code>children</code> です。
        </p>
      </LessonHeader>

      <LessonSection id="basic" {...at(BASIC, "function Card")}>
        <h2>囲んだ中身が props になる</h2>

        <p>コンポーネントをタグで囲むと、その中身が渡されます。</p>

        <StaticCode
          code={`<Card>
  <p>タイトル</p>
</Card>

// 届いているもの
{ children: <p>タイトル</p> }`}
        />

        <p>
          特別な仕組みではありません。
          <strong><code>children</code> という名前の props</strong> があるだけです。
          次の 2 つは、まったく同じ意味になります。
        </p>

        <StaticCode
          code={`<Card children={<p>タイトル</p>} />

<Card>
  <p>タイトル</p>
</Card>`}
        />

        <p>
          下の書き方ができるようになっているだけで、届き方は変わりません。
        </p>

        <DemoCard
          title="同じ枠に、違う中身を入れる"
          sourcePath={BASIC}
          description="Card は中身を知らないまま、枠だけを提供している"
        >
          <ChildrenBasic />
        </DemoCard>

        <p>
          <code>Card</code> のコードを見ると、
          <strong>中に何が入るかをいっさい決めていません</strong>。
          枠を用意して、受け取ったものをそこに置くだけです。
        </p>
      </LessonSection>

      <LessonSection id="type" {...at(BASIC, "children: React.ReactNode")}>
        <h3>型は ReactNode</h3>

        <p>
          <code>children</code> の型には <code>React.ReactNode</code> を使います。
          「画面に置けるもの」を表す型で、次のようなものが当てはまります。
        </p>

        <ul>
          <li>JSX（要素）</li>
          <li>文字列、数値</li>
          <li>それらの配列</li>
          <li>
            <code>null</code> や <code>undefined</code>（何も表示されない）
          </li>
        </ul>

        <p>
          ほとんどの場合、これを書いておけば足ります。
          迷ったら <code>ReactNode</code> と覚えてしまって構いません。
        </p>
      </LessonSection>

      <LessonSection id="slots" {...at(SLOTS, "function Panel")}>
        <h2>差し込む場所は増やせる</h2>

        <p>
          <code>children</code> は「特別扱いされた名前」というだけで、
          仕組みとしてはただの props です。
          ということは、<strong>JSX を受け取る props はいくつでも作れます</strong>。
        </p>

        <StaticCode
          code={`<Panel
  title="メンバー"
  action={<span>3 名</span>}
>
  <p>中身</p>
</Panel>`}
        />

        <p>
          <code>title</code> と <code>action</code> は属性として、
          中身は <code>children</code> として届きます。
          差し込める場所を、枠のほうで好きに用意できるわけです。
        </p>

        <DemoCard
          title="複数の差し込み口を持つ枠"
          sourcePath={SLOTS}
          description="ヘッダーの右と、中身が別々"
        >
          <ChildrenSlots />
        </DemoCard>

        <Callout variant="point" title="children を使うと何が良いか">
          <p>
            枠を作る側が<strong>中身を知らなくて済む</strong>ことです。
          </p>
          <p>
            もし <code>children</code> を使わずに作ろうとすると、
            <code>Card</code> は「テキストを表示する場合」「画像も出す場合」
            「ボタンが要る場合」と、あらゆるパターンを props
            で受け取って自分で組み立てることになります。
            使う人が増えるほど、props も増えていきます。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="pattern" {...at(SLOTS, "children: ReactNode")}>
        <h3>この教材自身も使っている</h3>

        <p>
          いま読んでいるこのページも、同じ仕組みでできています。
          解説を囲んでいる枠は、中身が何かを知りません。
        </p>

        <StaticCode
          code={`<LessonShell snippets={snippets}>
  {/* ここに書いた解説が children として届く */}
</LessonShell>`}
        />

        <p>
          この形は React のいたるところで出てきます。
          レイアウト、モーダル、カード、リストの枠。
          <strong>「外側だけ用意して、中身は呼ぶ側が決める」</strong>
          が必要になったら、<code>children</code> の出番です。
        </p>
      </LessonSection>

      <LessonSection id="quiz" {...at(BASIC)}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="children とは何？"
          options={[
            {
              label: "タグで囲んだ中身が入る、children という名前の props",
              correct: true,
              explanation:
                "特別な仕組みではありません。children={...} と書いても同じ意味になります。",
            },
            {
              label: "子コンポーネントを自動で探して渡す React の機能",
              explanation:
                "探しているわけではありません。囲んだものがそのまま props として渡されるだけです。",
            },
            {
              label: "HTML のタグの中身を文字列で受け取るもの",
              explanation:
                "文字列とは限りません。JSX でも配列でも数値でも受け取れます。型は ReactNode です。",
            },
          ]}
        />

        <Quiz
          question="children を使う利点は？"
          options={[
            {
              label: "枠を作る側が、中身を知らなくて済む",
              correct: true,
              explanation:
                "中身のパターンを props で受け取る必要がなくなります。使い道が増えても props が増えません。",
            },
            {
              label: "props より速く値を渡せる",
              explanation:
                "children も props のひとつなので、速度の違いはありません。",
            },
            {
              label: "子から親の値を書き換えられるようになる",
              explanation:
                "書き換えの話とは関係ありません。props が読み取り専用であることは変わりません。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(BASIC)}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            タグで囲んだ中身は、<code>children</code> という
            <strong>props として届く</strong>
          </li>
          <li>
            <code>{"<Card children={...} />"}</code> と書いても同じ。特別な仕組みではない
          </li>
          <li>
            型は <code>ReactNode</code>。JSX・文字列・配列などを受け取れる
          </li>
          <li>
            JSX を受け取る props は<strong>いくつでも作れる</strong>
          </li>
          <li>
            利点は、<strong>枠を作る側が中身を知らなくて済む</strong>こと
          </li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
