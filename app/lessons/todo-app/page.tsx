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
import { BrokenTodo } from "./demos/broken-todo";
import { TodoApp } from "./demos/todo-app";

const SLUG = "todo-app";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/todo-app/demos/types.ts", label: "types.ts" },
  { path: "lessons/todo-app/demos/todo-app.tsx", label: "todo-app.tsx" },
  { path: "lessons/todo-app/demos/todo-item.tsx", label: "todo-item.tsx" },
  { path: "lessons/todo-app/demos/broken-todo.tsx", label: "broken-todo.tsx" },
] as const;

const [TYPES, APP, ITEM, BROKEN] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          ここまで、部品・props・型・state・リストと key を
          ばらばらに見てきました。
        </p>
        <p>
          この章では、それを<strong>1 つの画面にまとめます</strong>。
          題材は TODO リスト。
          <strong>作る・読む・変える・消す</strong>が全部入っていて、
          しかも短いからです。
        </p>
        <p>
          新しい道具は出てきません。
          <strong>すでに習ったものだけで、実物が組み上がる</strong>ことを見てください。
        </p>
      </LessonHeader>

      <LessonSection id="crud" {...at(TYPES, "export type Todo")}>
        <h2>まず、扱うデータの形を決める</h2>

        <p>
          画面から書き始めたくなりますが、<strong>先に型です</strong>。
          何を持つのかが決まっていないと、部品の作りようがありません。
        </p>

        <StaticCode
          lang="ts"
          code={`export type Todo = {
  id: number;    // 見分けるための番号。key にも使う
  text: string;  // やることの内容
  done: boolean; // 済んだかどうか
};`}
        />

        <p>
          <strong>3 つだけです。</strong>
          この 3 つが決まれば、あとは全部これに従って書けます。
        </p>

        <Callout variant="point" title="CRUD という言い方">
          <p>
            データを扱う画面は、突き詰めると
            <strong>この 4 つ</strong>しかしません。
          </p>
          <ul>
            <li>
              <strong>作る</strong>（Create）… 追加する
            </li>
            <li>
              <strong>読む</strong>（Read）… 一覧に並べる
            </li>
            <li>
              <strong>変える</strong>（Update）… 済みにする、文言を直す
            </li>
            <li>
              <strong>消す</strong>（Delete）… 削除する
            </li>
          </ul>
          <p>
            頭文字を取って <strong>CRUD</strong> と呼びます。
            仕事で必ず出てくる言葉なので、ここで覚えてしまってください。
          </p>
        </Callout>

        <p>
          <code>Filter</code> の型も同じファイルに置いてあります。
          Part 4 でやったとおり、
          <strong>とりうる値を並べて書けば、それ以外は書けなくなります</strong>。
        </p>
      </LessonSection>

      <LessonSection id="demo" {...at(APP, "export function TodoApp")}>
        <h2>できあがったもの</h2>

        <p>先に完成品を触ってください。そのあと中を開けます。</p>

        <DemoCard
          title="TODO リスト"
          tone="good"
          sourcePath={APP}
          showRenderCount
          description="追加・完了・編集・削除・絞り込みが動く"
        >
          <TodoApp />
        </DemoCard>

        <p>
          <strong>新しい道具は 1 つも使っていません。</strong>
          <code>useState</code> と <code>map</code> と <code>filter</code>、
          それに props です。
        </p>
      </LessonSection>

      <LessonSection id="where" {...at(APP, "const [todos, setTodos]")}>
        <h2>データはどこに置いたか</h2>

        <p>
          <code>todos</code> を持っているのは
          <strong><code>TodoApp</code> だけ</strong>です。
          1 件ぶんを描く <code>TodoItem</code> は持っていません。
        </p>

        <p>
          Part 4 の「state のリフトアップ」でやった判断です。
          <strong>複数の場所から使うものは、共通の親に置く</strong>。
          追加も削除も絞り込みも、全部この 1 つの配列を見ています。
        </p>

        <Callout variant="note" title="ただし全部を上に置くわけではない">
          <p>
            <code>TodoItem</code> にも state があります。
            <strong>「編集中かどうか」</strong>です。
          </p>
          <p>
            これは<strong>その 1 件の中だけの話</strong>で、
            他の行も、親も、知る必要がありません。
            だから下に置いたままにします。
          </p>
          <p>
            <strong>上に置くほど偉いわけではありません。</strong>
            必要な範囲でいちばん下、が原則です。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="update" {...at(APP, "const toggle = (id: number)")}>
        <h2>作る・変える・消すを、全部同じ形で書く</h2>

        <p>
          ここがこの章の芯です。
          <strong>元の配列には触れません。毎回新しく作ります。</strong>
        </p>

        <StaticCode
          lang="ts"
          code={`// 作る … 後ろに足した新しい配列
setTodos((current) => [...current, newTodo]);

// 変える … 該当の 1 件だけ差し替えた新しい配列
setTodos((current) =>
  current.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
);

// 消す … 残すものだけ集めた新しい配列
setTodos((current) => current.filter((t) => t.id !== id));`}
        />

        <p>
          <strong>3 つとも「新しい配列を作って渡す」形です。</strong>
          Part 4 の「オブジェクトと配列の更新」でやったとおり、
          React は<strong>箱が別物になったか</strong>だけを見ています。
        </p>

        <Callout variant="point" title="変えるときの型">
          <StaticCode
            lang="ts"
            code={`{ ...t, done: !t.done }`}
          />
          <p>
            <strong>元の中身を全部コピーして、1 つだけ上書き</strong>。
            Part 0 でやったスプレッド構文です。
            <code>id</code> や <code>text</code> を書き写す必要はありません。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="derive" {...at(TYPES, "export const filterTodos")}>
        <h2>絞り込みと件数は、持たない</h2>

        <p>
          「絞り込んだ結果」と「残り件数」を state にしたくなります。
          <strong>しません。</strong>
        </p>

        <StaticCode
          lang="ts"
          code={`const shown = filterTodos(todos, filter);
const remaining = todos.filter((todo) => !todo.done).length;`}
        />

        <p>
          どちらも <code>todos</code> と <code>filter</code> から
          <strong>毎回計算できます</strong>。
          state にすると、追加したとき・消したとき・切り替えたときに
          <strong>全部更新して回る必要が出てきます</strong>。
          1 か所忘れれば、そこがずれます。
        </p>

        <p>
          Part 4 の「state は最小限にする」が、実物ではこう効きます。
        </p>
      </LessonSection>

      <LessonSection id="split" {...at(ITEM, "type Props = {", "};")}>
        <h2>部品の分け方と、props の形</h2>

        <p>
          <code>TodoItem</code> が受け取るのは 4 つです。
        </p>

        <StaticCode
          lang="ts"
          code={`type Props = {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, text: string) => void;
};`}
        />

        <p>
          <strong>下に降りるのはデータ 1 件、上に返すのは「何が起きたか」。</strong>
          Part 2 の「props の渡し方いろいろ」でやった形が、そのまま出ています。
        </p>

        <Callout variant="point" title="子は「何をするか」を知らない">
          <p>
            <code>TodoItem</code> の中に、配列を触るコードは
            <strong>1 行もありません</strong>。
            削除ボタンがやるのは <code>onDelete(todo.id)</code> だけです。
          </p>
          <p>
            <strong>どう消すかは親が決めます。</strong>
            だからこの部品は、別の画面にそのまま持っていけます。
          </p>
        </Callout>

        <p>
          <code>key</code> に <code>todo.id</code> を使っているのも、
          Part 3 でやったとおりです。
          <strong>並び替えや削除で行がずれる</strong>のを防ぎます。
          編集中の入力欄を持っているので、ここは実害に直結します。
        </p>
      </LessonSection>

      <LessonSection id="broken" {...at(BROKEN, "todos.push(")}>
        <h2>やりがちな書き方を、3 つ同時に入れてみる</h2>

        <p>
          下のデモには、よくある間違いが 3 つ入っています。
          <strong>まず追加してから、チェックを押してみてください。</strong>
        </p>

        <DemoCard
          title="ときどきしか動かない TODO"
          tone="bad"
          sourcePath={BROKEN}
          showRenderCount
          description="追加してから、チェックを押してみる"
        >
          <BrokenTodo />
        </DemoCard>

        <p>
          <strong>追加は、できてしまいます。</strong>
          ところが<strong>チェックを押しても、打ち消し線が付きません</strong>。
          しかも残り件数は、追加すると増えるのに、チェックしても減りません。
        </p>

        <Callout variant="warn" title="いちばん厄介なのは「たまに動く」こと">
          <p>
            同じ間違い（元の配列を書き換える）をしているのに、
            <strong>片方は動いて、片方は動きません</strong>。理由はこうです。
          </p>
          <ul>
            <li>
              <strong>追加</strong> … 直後に{" "}
              <code>setDraft(&quot;&quot;)</code> で入力欄を空にしています。
              <strong>こちらが本物の更新なので、描き直しが起きます</strong>。
              そのついでに、書き換わった配列が読まれて画面に出ます
            </li>
            <li>
              <strong>チェック</strong> … 更新は <code>setTodos(todos)</code>{" "}
              だけ。<strong>箱が同じなので React は「変わっていない」と判断し</strong>、
              描き直しません
            </li>
          </ul>
          <p>
            <strong>たまたま他の更新が同時に起きたときだけ、まとめて反映される。</strong>
            これが、まったく動かないより厄介な理由です。
            手元では動いたのに、別の画面では動かない。
            原因を突き止めるのに何時間もかかります。
          </p>
        </Callout>

        <p>入っている間違いは 3 つです。</p>

        <ul>
          <li>
            <strong>
              <code>push</code> で元の配列に足している
            </strong>{" "}
            … 箱は同じままなので、React は変化に気づけない
          </li>
          <li>
            <strong>中身のオブジェクトを直接書き換えている</strong>{" "}
            … 同じ理由。<code>target.done = ...</code> では別物になりません
          </li>
          <li>
            <strong>残り件数を state に持っている</strong>{" "}
            … 追加では増やしているのに、チェックでは減らし忘れています。
            <strong>実際にずれています</strong>
          </li>
        </ul>

        <Callout variant="warn" title="この 3 つは、誰も止めてくれません">
          <p>
            ここまで何度か「lint が教えてくれます」と書いてきました。
            <strong>この 3 つは違います。</strong>
          </p>
          <p>
            型も通ります。ビルドも通ります。lint も何も言いません
            （実際に確かめました）。
            <strong>エラーが 1 つも出ないまま、ときどきしか動かない</strong>——
            これが実務でいちばん時間を溶かす壊れ方です。
          </p>
          <p>
            <strong>この章でいちばん覚えて帰ってほしいのはここです。</strong>
            画面が変わらないときは、まず
            <strong>「元のものを書き換えていないか」</strong>を疑ってください。
            道具は助けてくれません。知識だけが助けになります。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="quiz" {...at(APP, "const remove = (id: number)")}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="TODO を 1 件消すとき、正しい書き方は？"
          options={[
            {
              label: "todos.filter((t) => t.id !== id) の結果を渡す",
              correct: true,
              explanation:
                "残すものだけを集めた新しい配列ができます。元の配列には触れていません。",
            },
            {
              label: "todos.splice(index, 1) してから setTodos(todos)",
              explanation:
                "splice は元の配列を変えます。箱が同じままなので、React は変化に気づけません。",
            },
            {
              label: "該当の要素に delete を使う",
              explanation:
                "元の配列を変えるうえ、消したところが穴として残ります。配列には使いません。",
            },
          ]}
        />

        <Quiz
          question="「編集中かどうか」を TodoItem の中に置いたのはなぜ？"
          options={[
            {
              label: "その 1 件の中だけの話で、他の行も親も知る必要がないから",
              correct: true,
              explanation:
                "必要な範囲でいちばん下に置きます。上に置くほど良いわけではありません。",
            },
            {
              label: "state は必ず子に置く決まりだから",
              explanation:
                "そんな決まりはありません。todos のほうは共通の親に置いています。",
            },
            {
              label: "親に置くと動かないから",
              explanation:
                "動きます。ただし全行ぶんの編集状態を親が抱えることになり、無駄に複雑になります。",
            },
          ]}
        />

        <Quiz
          question="残り件数を state にしないのはなぜ？"
          options={[
            {
              label: "todos から毎回計算できるから。持つと更新し忘れでずれる",
              correct: true,
              explanation:
                "追加・削除・切り替えのすべてで更新して回る必要が出ます。1 か所忘れればそこがずれます。",
            },
            {
              label: "数値は state にできないから",
              explanation: "できます。理由は別のところにあります。",
            },
            {
              label: "計算のほうが速いから",
              explanation:
                "速さの話ではありません。ずれないことが理由です。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(APP, "const add = ()")}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            画面より先に<strong>データの形（型）を決める</strong>
          </li>
          <li>
            <strong>作る・変える・消すは、どれも新しい配列を作って渡す</strong>。
            元のものは触らない（読むのは並べるだけなので、更新は要らない）
          </li>
          <li>
            共有するものは<strong>共通の親へ</strong>、
            その場限りのものは<strong>その部品の中へ</strong>
          </li>
          <li>
            <strong>計算できるものは state にしない</strong>（絞り込み、件数）
          </li>
          <li>
            子は<strong>データ 1 件と、起きたことを伝える関数</strong>を受け取る
          </li>
          <li>
            画面が変わらないときは
            <strong>「元のものを書き換えていないか」</strong>を疑う
          </li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
