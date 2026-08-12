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
import { Destructuring } from "./demos/destructuring-view";
import { Spread } from "./demos/spread-view";

const SLUG = "destructuring";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/destructuring/demos/destructuring.ts", label: "destructuring.ts" },
  { path: "lessons/destructuring/demos/spread.ts", label: "spread.ts" },
] as const;

const [PICK, SPREAD] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          React のコードには、見慣れない記号が 2 つよく出てきます。
        </p>
        <p>
          <code>{"const { name } = props"}</code> の波括弧と、
          <code>{"{ ...user, age: 21 }"}</code> の 3 つの点です。
        </p>
        <p>
          どちらも JavaScript の書き方で、React
          の機能ではありません。ただ、この 2 つを知らないと{" "}
          <strong>props も state の更新も読めません</strong>。
          先に片付けておきます。
        </p>
      </LessonHeader>

      <LessonSection id="object" {...at(PICK, "const { name, age }")}>
        <h2>分割代入 — 必要なものだけ取り出す</h2>

        <p>
          オブジェクトから値を取り出すとき、ふつうはこう書きます。
        </p>

        <StaticCode
          lang="ts"
          code={`const name = user.name;
const age = user.age;`}
        />

        <p>これを 1 行で書けるようにしたのが分割代入です。</p>

        <StaticCode lang="ts" code={`const { name, age } = user;`} />

        <p>
          <strong>波括弧の中に書いた名前と同じ項目</strong>を、オブジェクトから探して取り出します。
          順番は関係ありません。名前で見ています。
        </p>

        <DemoCard
          title="オブジェクトと配列から取り出す"
          sourcePath={PICK}
          description="オブジェクトは名前で、配列は順番で取り出す"
        >
          <Destructuring />
        </DemoCard>

        <p>
          配列の場合は角括弧を使い、<strong>書いた順番</strong>で取り出されます。
          配列の要素には名前がないためです。
        </p>

        <Callout variant="point" title="useState の正体">
          <p>
            React でいちばんよく見る <code>const [count, setCount] = useState(0)</code>{" "}
            は、この<strong>配列の分割代入</strong>です。
            <code>useState</code> が 2 つ入った配列を返すので、
            それを順番に受け取っているだけです。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="props" {...at(PICK, "const { name, age }")}>
        <h3>props でよく見る形</h3>

        <p>
          分割代入は、関数の引数のところにも書けます。
          React のコンポーネントはこの形をしていることがほとんどです。
        </p>

        <StaticCode
          code={`// 受け取ってから取り出す
function Hello(props) {
  const { name } = props;
  return <p>{name} さん</p>;
}

// 受け取るところで直接取り出す（こちらが主流）
function Hello({ name }) {
  return <p>{name} さん</p>;
}`}
        />

        <p>
          下の <code>{"{ name }"}</code>{" "}
          は、オブジェクトを受け取ってその場で中身を取り出しています。
          <strong>引数が 1 つのオブジェクトである</strong>という点は変わりません。
        </p>
      </LessonSection>

      <LessonSection id="spread" {...at(SPREAD, "export const updated")}>
        <h3>取り出した残りを、まとめて受け取る</h3>

        <p>
          名前を付けて取り出したあと、
          <strong>残り全部</strong>をひとつにまとめることもできます。
        </p>

        <StaticCode
          lang="ts"
          code={`const user = { name: "さとう", age: 20, city: "福岡" };

const { name, ...rest } = user;
// name → "さとう"
// rest → { age: 20, city: "福岡" }`}
        />

        <p>
          点 3 つ（<code>...</code>）は「残り」という意味です。
          <strong>いくつ残っていても、まとめて 1 つの名前で受け取れます。</strong>
          Part 2 で、部品を作るときにこれを使います。
        </p>

        <h2>スプレッド構文 — 中身を展開する</h2>

        <p>
          <code>...</code> は「中身をその場に展開する」記号です。
          新しいオブジェクトを作るときに使います。
        </p>

        <StaticCode
          lang="ts"
          code={`const original = { name: "さとう", age: 20 };

const copied = { ...original };
// { name: "さとう", age: 20 } と書いたのと同じ

const updated = { ...original, age: 21 };
// 展開したあとに書いたものが勝つ`}
        />

        <p>
          <code>{"{ ...original, age: 21 }"}</code> は
          「original の中身を全部並べて、そのあと age だけ書き直す」という意味です。
          あとに書いたほうが勝つので、age が上書きされます。
        </p>

        <DemoCard
          title="コピーして一部だけ変える"
          sourcePath={SPREAD}
          description="新しいほうだけが変わり、元は残っている"
        >
          <Spread />
        </DemoCard>

        <p>
          大事なのは、<strong>元のオブジェクトが変わっていない</strong>ことです。
          スプレッド構文は書き換えではなく、
          <strong>新しいものを作る</strong>ための道具です。
        </p>

        <Callout variant="point" title="React で state を更新するときの形">
          <p>
            Part 4 で state を扱うようになると、この形が毎回出てきます。
          </p>
          <p>
            <code>setUser({"{ ...user, age: 21 }"})</code>
          </p>
          <p>
            <code>user.age = 21</code> と書き換えるのではなく、
            <strong>新しいオブジェクトを作って渡す</strong>。
            Part 0 の「変数と const」 でやった「const は中身を守らない」と、ここでつながります。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="array-spread" {...at(SPREAD, "export const copied")}>
        <h3>配列でも同じことができる</h3>

        <StaticCode
          lang="ts"
          code={`const members = ["さとう", "すずき"];

// 末尾に足した新しい配列
const added = [...members, "たかはし"];

// 先頭に足した新しい配列
const addedToTop = ["やまだ", ...members];`}
        />

        <p>
          <code>push</code> は元の配列を書き換えてしまいますが、
          この書き方なら元は残ったまま、新しい配列ができます。
          React で配列の state を更新するときは、いつもこちらを使います。
        </p>
      </LessonSection>

      <LessonSection id="quiz" {...at(SPREAD)}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="const [count, setCount] = useState(0) の角括弧は何をしている？"
          options={[
            {
              label: "useState が返した配列から、順番に 2 つ取り出している",
              correct: true,
              explanation:
                "配列の分割代入です。1 つめが現在の値、2 つめが更新用の関数、という順番が決まっています。",
            },
            {
              label: "count と setCount という名前の配列を作っている",
              explanation:
                "逆です。作っているのではなく、返ってきた配列から取り出しています。",
            },
            {
              label: "React の特別な記法で、JavaScript にはない書き方",
              explanation:
                "ふつうの JavaScript の分割代入です。React 専用の記法ではありません。",
            },
          ]}
        />

        <Quiz
          question="const updated = { ...user, age: 21 } を実行したあと、user はどうなっている？"
          options={[
            {
              label: "何も変わっていない",
              correct: true,
              explanation:
                "スプレッド構文は中身を読み取って新しいオブジェクトを組み立てるだけで、元には手を加えません。",
            },
            {
              label: "age が 21 になっている",
              explanation:
                "21 になっているのは updated のほうです。user はそのまま残ります。",
            },
            {
              label: "user と updated が同じものを指すようになる",
              explanation:
                "別のオブジェクトです。片方を書き換えても、もう片方には影響しません。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(SPREAD)}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            <code>{"const { name } = user"}</code> は分割代入。
            オブジェクトは<strong>名前</strong>、配列は<strong>順番</strong>で取り出す
          </li>
          <li>
            <code>useState</code> の <code>[count, setCount]</code> も、ただの配列の分割代入
          </li>
          <li>
            <code>...</code> は中身を展開する記号。あとに書いたものが勝つ
          </li>
          <li>
            スプレッド構文は書き換えではなく<strong>新しく作る</strong>ための道具。
            React の state 更新はこの形で書く
          </li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
