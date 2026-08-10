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
import { ClickBasic } from "./demos/click-basic";
import { EventObject } from "./demos/event-object";

const SLUG = "events";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/events/demos/click-basic.tsx", label: "click-basic.tsx" },
  { path: "lessons/events/demos/event-object.tsx", label: "event-object.tsx" },
] as const;

const [CLICK, EVENT] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          押されたら何かする。入力されたら何かする。
          アプリを作るというのは、突き詰めればこの繰り返しです。
        </p>
        <p>
          React では、それを <code>onClick</code> や <code>onChange</code>{" "}
          といった props で書きます。
          <strong>渡すのは関数</strong>で、呼ぶタイミングは React が決めます。
        </p>
        <p>
          Part 0 でやった「関数を値として渡す」が、そのまま実物になります。
        </p>
      	<Callout variant="note" title="デモに出てくる useState について">
					<p>
						この Part のデモには <code>useState</code> という見慣れないものが
						出てきます。<strong>Part 4 で正面から扱います</strong>ので、
						いまは<strong>「React が覚えていてくれる値」</strong>
						とだけ思って読み進めてください。
					</p>
				</Callout>
			</LessonHeader>

      <LessonSection id="basic" {...at(CLICK, "onClick={reset}")}>
        <h2>渡すのは関数、括弧は付けない</h2>

        <p>
          <code>onClick</code> には「押されたときに呼んでほしい関数」を渡します。
        </p>

        <StaticCode
          code={`// ○ 関数そのものを渡す
<Button onClick={reset}>リセット</Button>

// ✕ その場で実行され、結果が渡ってしまう
<Button onClick={reset()}>リセット</Button>`}
        />

        <p>
          下の書き方をすると、<strong>描き直されるたびに実行されます</strong>。
          最初に画面が出たときも、そのあと更新されるたびにも動きます。
          ボタンを押す前に動いてしまうわけです。
          Part 0-2 でやった「括弧は今すぐ実行しろの合図」がそのまま当てはまります。
        </p>

        <h3>引数を渡したいときは包む</h3>

        <p>
          「押されたら <code>setSelected(&quot;さとう&quot;)</code> を呼びたい」
          という場合、括弧を付けたら実行されてしまいます。
          そこで、<strong>それを呼ぶだけの関数</strong>を新しく作って渡します。
        </p>

        <StaticCode
          code={`onClick={() => setSelected("さとう")}`}
        />

        <DemoCard
          title="押したボタンによって表示を変える"
          sourcePath={CLICK}
          showRenderCount
          description="引数のある処理は関数で包んで渡している"
        >
          <ClickBasic />
        </DemoCard>

        <p>
          <code>map</code> の中でボタンを作り、それぞれに違う値を渡しています。
          この形は実際のアプリで山ほど出てきます。
        </p>
      </LessonSection>

      <LessonSection id="event" {...at(EVENT, "const handleChange")}>
        <h2>何が起きたかを受け取る</h2>

        <p>
          ハンドラは、呼ばれるときに<strong>何が起きたのかを説明するオブジェクト</strong>{" "}
          を受け取ります。慣習的に <code>event</code> や <code>e</code> と名付けます。
        </p>

        <p>
          いちばんよく使うのは、入力欄の値を取り出す場面です。
        </p>

        <StaticCode
          code={`const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setText(event.target.value);
};`}
        />

        <ul>
          <li>
            <code>event.target</code> … 出来事が起きた要素そのもの（この場合は入力欄）
          </li>
          <li>
            <code>event.target.value</code> … いま入力されている文字
          </li>
        </ul>

        <DemoCard
          title="入力された文字を受け取る"
          sourcePath={EVENT}
          showRenderCount
          description="打つたびにハンドラが呼ばれている"
        >
          <EventObject />
        </DemoCard>

        <Callout variant="note" title="型の書き方">
          <p>
            <code>React.ChangeEvent&lt;HTMLInputElement&gt;</code>{" "}
            は長くて覚えにくいですが、暗記する必要はありません。
            <strong>エディタが教えてくれます。</strong>
          </p>
          <p>
            <code>onChange={"{(e) => ...}"}</code>{" "}
            のように直接書けば、型は自動で決まります。
            関数を外に出したときだけ、明示的に書くことになります。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="names" {...at(CLICK, "onClick={() =>")}>
        <h3>よく使うイベント</h3>

        <StaticCode
          code={`<button onClick={...}>       // 押された
<input onChange={...}>       // 入力が変わった
<form onSubmit={...}>        // 送信された
<input onFocus={...}>        // 入力欄が選ばれた
<input onBlur={...}>         // 入力欄から離れた
<div onMouseEnter={...}>     // マウスが乗った`}
        />

        <p>
          いずれも <strong>on + 出来事</strong> という名前で、
          キャメルケースで書きます。JSX の章でやったとおり、
          JavaScript の命名にそろえてあるためです。
        </p>

        <h3>既定の動きを止める</h3>

        <p>
          フォームの送信ボタンを押すと、ブラウザは既定でページを再読み込みします。
          React で作ったアプリではたいてい困るので、これを止めます。
        </p>

        <StaticCode
          code={`const handleSubmit = (event: React.FormEvent) => {
  event.preventDefault(); // 再読み込みを止める
  // ここで送信の処理を書く
};`}
        />
      </LessonSection>

      <LessonSection id="quiz" {...at(CLICK)}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="onClick={handleClick()} と書くとどうなる？"
          options={[
            {
              label: "画面が表示された時点で実行され、その結果が onClick に渡る",
              correct: true,
              explanation:
                "括弧はその場で実行する合図です。押す前に動いてしまい、onClick には戻り値が渡ります。",
            },
            {
              label: "押したときに実行される",
              explanation:
                "それは括弧を付けなかったときの動きです。括弧を付けると、渡す前に実行されます。",
            },
            {
              label: "必ずエラーになって画面が表示されない",
              explanation:
                "エラーになることもあります（state を更新する関数だと、描き直しが止まらなくなって Too many re-renders と出ます）。ですが、そうならないまま静かに間違って動くこともあります。",
            },
          ]}
        />

        <Quiz
          question="入力欄の値を取り出すには？"
          options={[
            {
              label: "ハンドラが受け取る event の event.target.value",
              correct: true,
              explanation:
                "event.target が出来事の起きた要素で、その value が今の値です。",
            },
            {
              label: "input を id で探して、その value を読む",
              explanation:
                "要素を探しに行くのは命令的なやり方です。React では、渡ってきた event から取り出します。",
            },
            {
              label: "props から受け取る",
              explanation:
                "入力された値は props では届きません。イベントとして渡ってきます。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(CLICK)}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            <code>onClick</code> には<strong>関数を渡す</strong>。括弧を付けない
          </li>
          <li>
            引数が必要なときは <code>{"() => f(引数)"}</code> で包む
          </li>
          <li>
            ハンドラは <strong>event</strong> を受け取る。
            入力値は <code>event.target.value</code>
          </li>
          <li>
            名前は <strong>on + 出来事</strong> のキャメルケース
          </li>
          <li>
            フォームの再読み込みは <code>event.preventDefault()</code> で止める
          </li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
