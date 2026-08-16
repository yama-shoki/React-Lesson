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
import { Bubbling, SubmitForm } from "./demos/submit-bubble";

const SLUG = "events";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/events/demos/click-basic.tsx", label: "click-basic.tsx" },
  { path: "lessons/events/demos/event-object.tsx", label: "event-object.tsx" },
  { path: "lessons/events/demos/submit-bubble.tsx", label: "submit-bubble.tsx" },
] as const;

const [CLICK, EVENT, SUBMIT] = SOURCES.map((source) => source.path);

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
          Part 0 でやった「関数を値として扱う」が、そのまま実物になります。
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
          Part 0 の「関数を値として扱う」 でやった「括弧は今すぐ実行しろの合図」がそのまま当てはまります。
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
          イベントが起きたときに呼ばれる関数を
          <strong>ハンドラ</strong>（取り扱い係）と呼びます。
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

        <DemoCard
          title="送信を受け止める"
          sourcePath={SUBMIT}
          description="入力して Enter を押してみる"
        >
          <SubmitForm />
        </DemoCard>

        <p>
          <strong>入力欄で Enter を押しても送信されます。</strong>
          ボタンだけに <code>onClick</code> を付けていると、
          Enter で送信したときに何も起きません。
          <strong>送信を受け取るのはボタンではなく <code>form</code></strong>
          だと覚えてください。
        </p>

        <Callout variant="warn" title="button の type に気をつける">
          <p>
            <code>form</code> の中のボタンは、
            <code>type</code> を書かないと<strong>送信ボタンになります</strong>。
            送信させたくないボタン（「戻る」など）には、
            <code>type=&quot;button&quot;</code> を書きます。
          </p>
          <p>
            これを忘れると、押した瞬間にページが再読み込みされて
            「なぜか画面が真っ白に戻る」という現象になります。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="bubbling" {...at(SUBMIT, "event.stopPropagation()")}>
        <h2>クリックは、親にも伝わる</h2>

        <p>
          押した場所だけで話が終わるとはかぎりません。
          <strong>イベントは、内側から外側へ順に伝わっていきます</strong>。
        </p>

        <p>
          よくあるのが、こういう形です。
          <strong>行全体が押せて、その中に削除ボタンがある。</strong>
        </p>

        <DemoCard
          title="行の中のボタンを押す"
          sourcePath={SUBMIT}
          description="「消す」を押して、記録を見る"
        >
          <Bubbling />
        </DemoCard>

        <p>
          「消す」を押しただけなのに、
          <strong>行のほうも押されたことになっています</strong>。
          消したいだけなのに、行を開く処理まで走ってしまう、
          という不具合になります。
        </p>

        <p>
          止めるには、<code>stopPropagation</code> を呼びます。
          上のトグルを「する」に変えて、もう一度押してみてください。
        </p>

        <StaticCode
          lang="ts"
          code={`<button
  onClick={(event) => {
    event.stopPropagation(); // 親に伝えない
    remove(id);
  }}
>`}
        />

        <Callout variant="note" title="2 つは別のもの">
          <p>
            <code>preventDefault</code> は
            <strong>ブラウザの決まった動きを止める</strong>
            （送信、リンクの移動など）。
          </p>
          <p>
            <code>stopPropagation</code> は
            <strong>外側へ伝わるのを止める</strong>。
          </p>
          <p>
            名前が似ていますが、止めているものが違います。
          </p>
        </Callout>
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
                "エラーになることもあります（描き直しが止まらなくなる場合）。ですが、そうならないまま静かに間違って動くこともあります。押す前に動いてしまう、という点はどちらでも同じです。",
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

        <Quiz
          question="form の中の「戻る」ボタンを押すと、なぜかページが再読み込みされる。原因は？"
          options={[
            {
              label: "type を書いていないので、送信ボタンとして扱われている",
              correct: true,
              explanation:
                "form の中の button は、type を書かないと submit になります。送信させたくないボタンには type=\"button\" を書きます。",
            },
            {
              label: "onClick の中で preventDefault を呼んでいないから",
              explanation:
                "呼べば止まりますが、そもそも送信させる必要がありません。type を直すほうが素直です。",
            },
            {
              label: "戻るボタンはブラウザの履歴を操作するから",
              explanation:
                "ここでの「戻る」はただのボタンです。ブラウザの戻る機能とは関係ありません。",
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
