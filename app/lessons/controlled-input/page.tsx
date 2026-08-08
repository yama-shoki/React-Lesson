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
import { Controlled } from "./demos/controlled";
import { Uncontrolled } from "./demos/uncontrolled";

const SLUG = "controlled-input";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/controlled-input/demos/uncontrolled.tsx", label: "uncontrolled.tsx" },
  { path: "lessons/controlled-input/demos/controlled.tsx", label: "controlled.tsx" },
] as const;

const [UNCONTROLLED, CONTROLLED] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          Part 3 の「リストと key」で、こう書きました。
        </p>
        <p>
          「入力欄に打った文字は、<strong>React が管理している値ではありません</strong>。
          ブラウザの入力欄そのものが持っている値です」。
        </p>
        <p>
          この章では、それを React の管理下に置きます。
          そうすると<strong>入力に対してできることが一気に増えます</strong>。
        </p>
      </LessonHeader>

      <LessonSection id="uncontrolled" {...at(UNCONTROLLED, "<Input placeholder")}>
        <h2>React が値を知らない状態</h2>

        <p>
          入力欄をただ置くと、値を持っているのはブラウザです。
          React は何が入力されたか知りません。
        </p>

        <DemoCard
          title="値を渡していない入力欄"
          tone="bad"
          sourcePath={UNCONTROLLED}
          description="打てるが、React 側からは中身が分からない"
        >
          <Uncontrolled />
        </DemoCard>

        <p>
          文字は打てます。ですが React
          は値を知らないので、次のようなことが何ひとつできません。
        </p>

        <ul>
          <li>入力が空のときは送信ボタンを押せなくする</li>
          <li>文字数を表示する</li>
          <li>ボタンを押して中身を空にする</li>
          <li>入力に応じて他の場所の表示を変える</li>
        </ul>

        <p>
          Part 1 の言い方をすれば、
          <strong>入力欄の中身が状態になっていない</strong>ということです。
          状態でないものからは、何も決められません。
        </p>
      </LessonSection>

      <LessonSection id="controlled" {...at(CONTROLLED, "value={name}", "onChange={(event)")}>
        <h2>値を React に持たせる</h2>

        <p>やることは 2 つだけです。</p>

        <StaticCode
          code={`<Input
  value={name}                                   // 表示する値は state
  onChange={(e) => setName(e.target.value)}      // 入力があれば state を更新
/>`}
        />

        <ul>
          <li>
            <code>value</code> … 画面に出す値を、React が持っている state にする
          </li>
          <li>
            <code>onChange</code> … 打たれたら、その値で state を更新する
          </li>
        </ul>

        <p>
          この形を<strong>制御コンポーネント</strong>と呼びます。
          入力欄の見た目を React が制御している、という意味です。
        </p>

        <DemoCard
          title="value と onChange をつなぐ"
          tone="good"
          sourcePath={CONTROLLED}
          description="文字数も、ボタンの状態も、クリアもできる"
        >
          <Controlled />
        </DemoCard>

        <p>
          値が state になった途端、Part 4
          でやったことがすべて使えるようになりました。
          文字数は <code>name.length</code> で計算できますし、
          送信できるかどうかも <code>name.trim() !== &quot;&quot;</code>{" "}
          で求まります。<strong>どちらも state にする必要はありません。</strong>
        </p>
      </LessonSection>

      <LessonSection id="loop" {...at(CONTROLLED, "onChange={(event)")}>
        <h2>一周まわって表示されている</h2>

        <p>
          この仕組みは、慣れるまで奇妙に見えます。
          打った文字がそのまま出ているのではなく、
          <strong>一周まわってから表示されている</strong>からです。
        </p>

        <StaticCode
          lang="ts"
          code={`キーを打つ
  → onChange が呼ばれる
  → setName で state が変わる
  → コンポーネントが実行し直される
  → value={name} に新しい値が入る
  → 画面に文字が出る`}
        />

        <p>
          遠回りに見えますが、これがあるおかげで
          <strong>入力を途中で加工できます</strong>。
        </p>

        <StaticCode
          code={`// 数字以外は受け付けない
onChange={(e) => setTel(e.target.value.replace(/[^0-9]/g, ""))}

// 常に大文字にする
onChange={(e) => setCode(e.target.value.toUpperCase())}`}
        />

        <p>
          画面に出る値は最後まで React が決めているので、
          <strong>打った内容と違うものを表示することもできる</strong>わけです。
        </p>

        <Callout variant="warn" title="value だけ渡すと打てなくなる">
          <p>
            <code>value</code> を渡して <code>onChange</code>{" "}
            を書き忘れると、入力欄は<strong>まったく反応しなくなります</strong>。
          </p>
          <p>
            state が更新されないので、何を打っても
            <code>value</code> が最初の値のまま上書きし続けるためです。
            「打てない入力欄ができた」ときは、まずここを疑ってください。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="others" {...at(CONTROLLED, "const [name, setName]")}>
        <h3>他の入力欄でも同じ</h3>

        <StaticCode
          code={`// チェックボックスは checked
<input
  type="checkbox"
  checked={isAgreed}
  onChange={(e) => setIsAgreed(e.target.checked)}
/>

// 選択肢も value
<select value={role} onChange={(e) => setRole(e.target.value)}>
  <option value="admin">管理者</option>
</select>`}
        />

        <p>
          チェックボックスだけ <code>value</code> ではなく{" "}
          <code>checked</code> を使います。
          受け取る側も <code>e.target.checked</code> になります。
          それ以外の考え方は同じです。
        </p>
      </LessonSection>

      <LessonSection id="quiz" {...at(CONTROLLED)}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="制御コンポーネントにすると何ができるようになる？"
          options={[
            {
              label: "入力値をもとに、他の表示やボタンの状態を決められる",
              correct: true,
              explanation:
                "値が state になるので、そこから計算して何でも決められます。文字数の表示も、送信可否の判定もできます。",
            },
            {
              label: "入力が速くなる",
              explanation:
                "速度は変わりません。むしろ一度 state を経由するぶん、処理は増えています。",
            },
            {
              label: "入力欄の見た目を変えられる",
              explanation:
                "見た目は CSS の話で、制御するかどうかとは関係ありません。",
            },
          ]}
        />

        <Quiz
          question="入力欄に文字を打っても何も表示されない。原因は？"
          options={[
            {
              label: "value を渡しているのに onChange を書いていない",
              correct: true,
              explanation:
                "state が更新されないため、value が最初の値のまま上書きし続けます。打っても何も起きません。",
            },
            {
              label: "value に空文字を渡している",
              explanation:
                "初期値が空でも、onChange があれば打つたびに更新されます。問題は更新の欠落です。",
            },
            {
              label: "onChange の型が間違っている",
              explanation:
                "型の間違いはビルド時にエラーになります。無言で打てなくなるのは onChange 自体がない場合です。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(CONTROLLED)}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            入力欄をただ置くと、値を持つのはブラウザ。React は中身を知らない
          </li>
          <li>
            <code>value</code> と <code>onChange</code> をつなぐと、
            値が state になる（<strong>制御コンポーネント</strong>）
          </li>
          <li>
            state になれば、文字数も送信可否も<strong>計算で求められる</strong>
          </li>
          <li>
            打った文字は一周まわって表示される。だから<strong>途中で加工できる</strong>
          </li>
          <li>
            <code>value</code> だけ渡して <code>onChange</code>{" "}
            を忘れると、打てない入力欄になる
          </li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
