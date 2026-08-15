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
import { StaleDeps } from "./demos/stale-deps";
import { TitleSync } from "./demos/title-sync";

const SLUG = "useeffect";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/useeffect/demos/title-sync.tsx", label: "title-sync.tsx" },
  { path: "lessons/useeffect/demos/stale-deps.tsx", label: "stale-deps.tsx" },
] as const;

const [TITLE, STALE] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          <code>useEffect</code> は、React
          のフックの中で<strong>もっとも誤用されている</strong>ものです。
        </p>
        <p>
          「何かのタイミングで処理を走らせるもの」と覚えてしまうと、
          あらゆる場面で使いたくなり、そのたびにバグを増やします。
        </p>
        <p>
          正しくは、もっと狭い道具です。
          <strong>React の外側にあるものと、React の状態を合わせるためのもの</strong>。
          それ以外の用途では、まず使いません。
        </p>
      </LessonHeader>

      <LessonSection id="outside" {...at(TITLE, "document.title =")}>
        <h2>「React の外側」とは</h2>

        <p>
          React が面倒を見てくれるのは、
          <strong>state から画面が作られるところまで</strong>です。
          それ以外は React の管轄外です。
        </p>

        <ul>
          <li>ブラウザのタブ名やアドレス欄</li>
          <li>タイマー（setInterval など）</li>
          <li>ブラウザのイベント（スクロール、リサイズ）</li>
          <li>サーバーとの通信</li>
          <li>localStorage などの保存領域</li>
          <li>React で書かれていない他のライブラリ</li>
        </ul>

        <p>
          これらと state を合わせたいときに使うのが <code>useEffect</code> です。
        </p>

        <DemoCard
          title="タブ名を state に合わせる"
          sourcePath={TITLE}
          showRenderCount
          description="押すとブラウザのタブ名が変わる"
        >
          <TitleSync />
        </DemoCard>

        <p>
          タブ名は React が管理していません。
          JSX に書いて変えられるものではないので、
          <strong>こちらから外へ働きかける</strong>必要があります。
          これが <code>useEffect</code> の出番です。
        </p>
      </LessonSection>

      <LessonSection id="timing" {...at(TITLE, "}, [count])")}>
        <h2>いつ実行されるか</h2>

        <p>
          <code>useEffect</code> に渡した処理は、
          <strong>画面が表示されたあと</strong>に実行されます。
          コンポーネントの関数を実行している最中ではありません。
        </p>

        <StaticCode
          lang="ts"
          code={`useEffect(() => {
  // 画面が出たあとに実行される
}, [count]);`}
        />

        <p>
          第 2 引数の配列は<strong>依存配列</strong>と呼ばれます。
          ここに書いた値が<strong>前回と変わっていたときだけ</strong>実行されます。
        </p>

        <StaticCode
          lang="ts"
          code={`useEffect(fn, [count]); // count が変わったときだけ
useEffect(fn, []);      // 最初の 1 回だけ
useEffect(fn);          // 毎回（ほとんど使わない）`}
        />

        <p>
          書き忘れると何が起きるのか、実際に見てみます。
          下の 2 つは、どちらも
          <strong>「count が変わったら記録する」</strong>つもりで書いたものです。
        </p>

        <DemoCard
          title="依存配列を書き忘れた効果"
          tone="bad"
          sourcePath={STALE}
          description="count を何度か増やしてみる"
        >
          <StaleDeps />
        </DemoCard>

        <p>
          上の箱は<strong>0 のまま動きません</strong>。
          依存配列が空なので、effect は最初の 1 回しか実行されず、
          そのとき見えていた <code>count</code> の値（0）で止まっています。
        </p>

        <p>
          <strong>エラーは出ません。</strong>
          画面はふつうに動いていて、
          記録された値だけが静かに古いままです。
          これが「書き忘れ」のいやなところです。
        </p>

        <StaticCode
          lang="ts"
          code={`// ✕ count を使っているのに、依存配列に書いていない
useEffect(() => {
  setRecorded(count);
}, []);

// ○ 使っている値は、すべて書く
useEffect(() => {
  setRecorded(count);
}, [count]);`}
        />

        <Callout variant="warn" title="依存配列は省略しない">
          <p>
            処理の中で使っている値は、
            <strong>すべて依存配列に書く</strong>のが原則です。
            書き忘れると、古い値のまま実行され続けます。
          </p>
          <p>
            これも lint が見張ってくれます。
            警告が出たら、まず素直に足してください。
            「足すと無限に実行されてしまう」場合は、
            <strong>そもそも useEffect が不要な合図</strong>です。次の章で扱います。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="mental" {...at(TITLE, "useEffect(() => {")}>
        <h2>「〜したとき」ではなく「〜の状態に合わせる」</h2>

        <p>
          <code>useEffect</code>{" "}
          を誤用しないためのコツは、<strong>言葉の使い方</strong>にあります。
        </p>

        <StaticCode
          lang="ts"
          code={`// ✕ こう考えると誤用しやすい
「ボタンが押されたときに実行したい」
「count が変わったときに実行したい」

// ○ こう考える
「タブ名を、いまの count に合わせておきたい」`}
        />

        <p>
          前者は<strong>タイミングの話</strong>です。
          そしてタイミングの話なら、たいていイベントハンドラに書けます。
          ボタンが押されたときの処理は <code>onClick</code> の中です。
        </p>

        <p>
          後者は<strong>状態を合わせる話</strong>です。
          「どういうきっかけであれ、count がこの値なら、外側もこうなっていてほしい」。
          この形になっているときだけ、<code>useEffect</code> が正しい選択になります。
        </p>

        <Callout variant="point" title="判断の基準">
          <p>
            <strong>React の外側にあるものを、いまの state に合わせにいっているか。</strong>
          </p>
          <p>
            外側が出てこないなら、たいてい useEffect は要りません。
            それが次の章の内容です。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="quiz" {...at(TITLE)}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="useEffect は何のための道具？"
          options={[
            {
              label: "React の外側にあるものと、React の状態を合わせるため",
              correct: true,
              explanation:
                "タブ名・タイマー・通信・保存領域など、React が管理していないものが相手のときに使います。",
            },
            {
              label: "何かが変わったタイミングで処理を走らせるため",
              explanation:
                "この理解が誤用の入り口です。タイミングの話なら、多くはイベントハンドラに書けます。",
            },
            {
              label: "画面が表示される前に準備をするため",
              explanation:
                "useEffect は画面が表示されたあとに実行されます。前ではありません。",
            },
          ]}
        />

        <Quiz
          question="依存配列に書く値を書き忘れるとどうなる？"
          options={[
            {
              label: "古い値のまま実行され続ける",
              correct: true,
              explanation:
                "変化が検知されないので更新されません。lint が警告するので、まず素直に足します。",
            },
            {
              label: "エラーになって実行されない",
              explanation:
                "エラーにはなりません。静かに古い値を使い続けるので、原因が分かりにくくなります。",
            },
            {
              label: "毎回実行されるようになる",
              explanation:
                "毎回実行されるのは、依存配列そのものを省略した場合です。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(TITLE)}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            <code>useEffect</code> は
            <strong>React の外側と状態を合わせる</strong>ための道具
          </li>
          <li>実行されるのは、画面が表示されたあと</li>
          <li>
            依存配列に書いた値が<strong>変わったときだけ</strong>実行される。
            使っている値は全部書く
          </li>
          <li>
            「〜したとき」ではなく<strong>「〜に合わせておきたい」</strong>
            と言えるかで判断する
          </li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
