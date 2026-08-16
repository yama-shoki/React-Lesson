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
import { MapBasic } from "./demos/map-basic-view";
import { MapFriends } from "./demos/map-friends-view";
import { MapObject } from "./demos/map-object-view";
import { MapFlowFigure } from "./figures/map-flow";

const SLUG = "array-map";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/array-map/demos/map-basic.ts", label: "map-basic.ts" },
  { path: "lessons/array-map/demos/map-object.ts", label: "map-object.ts" },
  { path: "lessons/array-map/demos/map-friends.ts", label: "map-friends.ts" },
] as const;

const [BASIC, OBJECT, FRIENDS] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          React の画面は、そのほとんどが「配列を並べたもの」でできています。
          商品の一覧、コメント、検索結果、メニュー。
          データの中身が違うだけで、やっていることは全部同じです。
        </p>
        <p>
          そして React でそれを書くとき、必ず出てくるのが{" "}
          <strong>
            <code>map</code>
          </strong>{" "}
          です。
        </p>
        <p>
          ここが曖昧なままだと、React のコードが一生読めません。
          逆にここさえ押さえれば、リスト表示は全部同じ形に見えてきます。
        </p>
      </LessonHeader>

      <LessonSection id="what" {...at(BASIC, "export const doubled")}>
        <h2>map は「ひとつずつ作り変える」</h2>

        <p>
          <code>map</code> は配列の<strong>メソッド</strong>
          （＝配列が最初から持っている関数）で、やることはひとつだけです。
        </p>

        <Callout variant="point" title="map がやっていること">
          <p>
            配列の要素を<strong>ひとつずつ関数に通して</strong>、
            その結果を集めた<strong>新しい配列</strong>を返す。
          </p>
        </Callout>

        <MapFlowFigure />

        <p>
          <code>map</code> に渡しているのは関数です。前の章でやった
          「関数を他の関数に渡す」が、さっそくここで出てきます。
        </p>

        <DemoCard
          title="数値をひとつずつ 2 倍にする"
          sourcePath={BASIC}
          description="元の配列は変わらず、新しい配列が返ってくる"
        >
          <MapBasic />
        </DemoCard>

        <p>
          注目してほしいのは、<strong>元の <code>numbers</code> が変わっていない</strong>
          ことです。<code>map</code> は元の配列に手を加えません。
          別の配列を新しく作って返すだけです。
        </p>

        <p>
          <strong>「変数と const」</strong>の章で
          「React では値を書き換えず、新しく作る」と書きました。
          <code>map</code> はまさにその考え方でできています。
          React と相性がいいのはそのためです。
        </p>
      </LessonSection>

      <LessonSection id="object" {...at(OBJECT, "export const names")}>
        <h2>オブジェクトの配列から取り出す</h2>

        <p>
          実際のデータは、たいていオブジェクトの配列です。
          そこから必要なものだけを取り出したり、別の形に整えたりするのにも{" "}
          <code>map</code> を使います。
        </p>

        <DemoCard
          title="名前だけを取り出す / 表示用の文字列を作る"
          sourcePath={OBJECT}
          description="渡す関数を変えれば、作られるものも変わる"
        >
          <MapObject />
        </DemoCard>

        <p>
          <code>map</code> が返すものは、渡した関数が何を返すかで決まります。
          数値を返せば数値の配列、文字列を返せば文字列の配列になります。
        </p>
      </LessonSection>

      <LessonSection id="react" {...at(OBJECT, "export const names")}>
        <h2>React では JSX を返す</h2>

        <Callout variant="note" title="ここから先の &lt; &gt; について">
          <p>
            <code>&lt;li&gt;</code> や <code>{"{ }"}</code> が出てきますが、
            <strong>読み方は Part 1 でやります</strong>。
          </p>
          <p>
            いまは<strong>「map の結果が、そのまま画面の部品になる」</strong>
            とだけ見てください。
          </p>
        </Callout>

        <p>
          ここまでくれば、React のリスト表示はもう読めます。
          返すものを<strong>画面の部品</strong>にするだけです。
        </p>

        <StaticCode
          code={`{members.map((member) => (
  <li key={member.id}>{member.name}</li>
))}`}
        />

        <p>
          <code>map</code>{" "}
          が返しているのは「画面の部品が入った配列」です。React
          はそれを受け取って、順番に並べて表示します。
        </p>

        <p>
          <code>for</code> 文を書いて 1 行ずつ追加していく、という手順は登場しません。
          「この配列を、この形に変えたものを表示したい」と書くだけです。
        </p>

        <Callout variant="note">
          <p>
            上のコードに出てくる <code>key</code> は、Part 3
            の「リストと key」で詳しく扱います。
            いまは「map で並べるときに必要なもの」とだけ思っておいてください。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="friends" {...at(FRIENDS, "export const big")}>
        <h2>map の兄弟たち</h2>

        <p>
          <code>map</code> と同じ形で使える仲間がいます。
          <strong>この 3 つは、React でも map と同じくらい出てきます。</strong>
          いま覚えなくても構いませんが、
          <strong>何が返るか</strong>だけ見ておいてください。
        </p>

        <DemoCard
          title="同じ配列に、4 つを当ててみる"
          sourcePath={FRIENDS}
          description="返ってきたものの形に注目"
        >
          <MapFriends />
        </DemoCard>

        <p>違いは<strong>「何が返るか」</strong>です。</p>

        <ul>
          <li>
            <code>map</code> … <strong>同じ数の配列</strong>。作り変える
          </li>
          <li>
            <code>filter</code> … <strong>減った配列</strong>。選び出す
          </li>
          <li>
            <code>find</code> … <strong>配列ではなく 1 つの値</strong>。探す
          </li>
          <li>
            <code>reduce</code> … <strong>1 つにまとめた値</strong>。畳む
          </li>
        </ul>

        <Callout variant="point" title="どこで使うことになるか">
          <p>
            <code>filter</code> は「完了したものを除く」「検索で絞る」で、
            <code>find</code> は「id からその 1 件を取り出す」で、
            <code>reduce</code> は「合計を出す」で使います。
          </p>
          <p>
            どれも<strong>Part 4 の「state は最小限にする」</strong>で
            効いてきます。持たずに計算する、というときの計算がこれです。
          </p>
        </Callout>

        <p>
          どれも<strong>関数を受け取る</strong>という点で共通しています。
          やはり「関数を値として渡せる」ことが土台になっています。
        </p>
      </LessonSection>

      <LessonSection id="quiz" {...at(BASIC)}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="const doubled = numbers.map((n) => n * 2); を実行したあと、numbers はどうなっている？"
          options={[
            {
              label: "何も変わっていない",
              correct: true,
              explanation:
                "map は元の配列に手を加えません。新しい配列を作って返すだけです。",
            },
            {
              label: "中身が 2 倍になっている",
              explanation:
                "2 倍になった配列は doubled のほうです。numbers はそのまま残ります。",
            },
            {
              label: "空になっている",
              explanation:
                "要素が取り出されて消える、ということは起きません。元の配列はそのままです。",
            },
          ]}
        />

        <Quiz
          question="members.map((member) => member.name) が返すのは？"
          options={[
            {
              label: "名前だけが入った、新しい配列",
              correct: true,
              explanation:
                "渡した関数が name を返しているので、name を集めた配列ができます。",
            },
            {
              label: "最初の 1 人の名前",
              explanation:
                "1 つだけ取り出したいときは find を使います。map は必ず全要素を処理して配列を返します。",
            },
            {
              label: "元の members と同じもの",
              explanation:
                "返ってくるのは関数が返した値の集まりです。この場合は文字列の配列になります。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(BASIC)}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            <code>map</code> は、要素をひとつずつ関数に通して
            <strong>新しい配列を返す</strong>
          </li>
          <li>元の配列は変わらない</li>
          <li>返ってくるものの中身は、渡した関数が何を返すかで決まる</li>
          <li>
            React では、関数が<strong>画面の部品</strong>を返すようにする。
            これがリスト表示の正体
          </li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
