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
import { Timer } from "./demos/timer";

const SLUG = "cleanup";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/cleanup/demos/timer.tsx", label: "timer.tsx" },
] as const;

const [TIMER] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          <code>useEffect</code>{" "}
          で外側に働きかけたなら、<strong>やめるときの後片付け</strong>も要ります。
        </p>
        <p>
          タイマーを動かしたら止める。購読したら解除する。
          これを書かないと、画面から消えたあとも
          <strong>動き続けるものが裏に残ります</strong>。
        </p>
      </LessonHeader>

      <LessonSection id="return" {...at(TIMER, "return () => clearInterval(timer)")}>
        <h2>返した関数が、後片付けになる</h2>

        <p>
          <code>useEffect</code>{" "}
          に渡した関数から<strong>関数を返す</strong>と、
          React はそれを後片付けとして扱います。
        </p>

        <StaticCode
          lang="ts"
          code={`useEffect(() => {
  const timer = setInterval(tick, 1000);

  // これが後片付け
  return () => clearInterval(timer);
}, []);`}
        />

        <p>返した関数が呼ばれるのは、次の 2 つのときです。</p>

        <ul>
          <li>コンポーネントが画面から消えるとき</li>
          <li>依存配列の値が変わって、effect をやり直す前</li>
        </ul>

        <DemoCard
          title="表示と連動して動くタイマー"
          sourcePath={TIMER}
          description="隠すとタイマーも止まり、表示すると 0 から始まる"
        >
          <Timer />
        </DemoCard>

        <p>
          「隠す」を押すと、<code>Clock</code>{" "}
          が画面から消えます。このとき後片付けが呼ばれ、
          タイマーが止まります。もう一度表示すると、
          新しく作り直されるので 0 から始まります。
        </p>
      </LessonSection>

      <LessonSection id="without" {...at(TIMER, "const timer = setInterval")}>
        <h2>書かないと何が起きるか</h2>

        <p>
          <code>clearInterval</code> を書かなかったとしましょう。
          画面から消えても、<strong>タイマーは動き続けます</strong>。
        </p>

        <ul>
          <li>
            <strong>裏で動き続ける</strong> …
            見えていない処理が、ずっと CPU を使い続ける
          </li>
          <li>
            <strong>増えていく</strong> …
            表示・非表示を繰り返すたびにタイマーが増え、止まらないまま溜まる
          </li>
          <li>
            <strong>消えたものを更新しようとする</strong> …
            すでにない state を更新しようとして、警告やエラーになる
          </li>
        </ul>

        <p>
          この手の問題は<strong>すぐには表面化しません</strong>。
          しばらく使っているうちに重くなる、という形で出てきます。
          原因を探すのが非常に大変な種類のバグです。
        </p>

        <Callout variant="point" title="対にして書く">
          <p>
            <strong>始めたら、終わらせる。</strong>
          </p>
          <p>
            <code>setInterval</code> には <code>clearInterval</code>、
            <code>addEventListener</code> には{" "}
            <code>removeEventListener</code>。
            片方を書いた時点で、もう片方も書いてしまうのが安全です。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="patterns" {...at(TIMER, "useEffect(() => {")}>
        <h3>よくある後片付け</h3>

        <StaticCode
          lang="ts"
          code={`// タイマー
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}, []);

// ブラウザのイベント
useEffect(() => {
  const onScroll = () => { /* ... */ };
  window.addEventListener("scroll", onScroll);
  return () => window.removeEventListener("scroll", onScroll);
}, []);

// 通信（結果が返る前に消えた場合に備える）
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal });
  return () => controller.abort();
}, [url]);`}
        />

        <p>
          <code>removeEventListener</code> には
          <strong>登録したものと同じ関数</strong>を渡す必要があります。
          だから、その場で書かずに変数に入れておきます。
        </p>

        <h3>やり直す前にも呼ばれる</h3>

        <p>
          依存配列の値が変わったときは、
          <strong>後片付け → 新しい effect</strong> の順で実行されます。
        </p>

        <StaticCode
          lang="ts"
          code={`useEffect(() => {
  const socket = connect(roomId);
  return () => socket.close();
}, [roomId]);`}
        />

        <p>
          <code>roomId</code> が変わると、まず古い接続が閉じられ、
          そのあと新しい接続が作られます。
          <strong>古いものが残ったまま新しいものが増える、ということが起きません。</strong>
        </p>

        <Callout variant="note" title="開発中に 2 回実行されるのは">
          <p>
            開発中、effect が 2 回実行されることがあります。これは不具合ではありません。
          </p>
          <p>
            React が<strong>わざと</strong>「実行 → 後片付け → もう一度実行」を試して、
            <strong>後片付けが正しく書けているかを確かめている</strong>ためです。
            2 回動いて困るなら、後片付けが足りていない合図になります。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="quiz" {...at(TIMER)}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="useEffect から返した関数はいつ呼ばれる？"
          options={[
            {
              label: "画面から消えるときと、依存配列が変わって effect をやり直す前",
              correct: true,
              explanation:
                "やり直す前にも呼ばれるので、古いものが残ったまま新しいものが増えることを防げます。",
            },
            {
              label: "画面から消えるときだけ",
              explanation:
                "依存配列が変わったときにも呼ばれます。これがないと、値が変わるたびに購読が溜まっていきます。",
            },
            {
              label: "エラーが起きたときだけ",
              explanation:
                "エラー処理のための仕組みではありません。始めたものを終わらせるためのものです。",
            },
          ]}
        />

        <Quiz
          question="clearInterval を書き忘れるとどうなる？"
          options={[
            {
              label: "画面から消えてもタイマーが動き続け、繰り返すたびに溜まっていく",
              correct: true,
              explanation:
                "すぐには表面化せず、しばらく使ううちに重くなるという形で出ます。原因を探しにくい種類のバグです。",
            },
            {
              label: "すぐにエラーになるので気づける",
              explanation:
                "多くの場合その場では何も起きません。気づきにくいのが厄介なところです。",
            },
            {
              label: "React が自動で止めてくれる",
              explanation:
                "タイマーは React の管理外です。始めた側が止める必要があります。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(TIMER)}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            <code>useEffect</code> から返した関数が<strong>後片付け</strong>になる
          </li>
          <li>
            呼ばれるのは、<strong>消えるとき</strong>と
            <strong>やり直す前</strong>
          </li>
          <li>
            書かないと、裏で動き続けるものが溜まっていく。
            <strong>すぐには表面化しない</strong>のが厄介
          </li>
          <li>
            <strong>始めたら終わらせる</strong>。片方を書いた時点でもう片方も書く
          </li>
          <li>開発中に 2 回実行されるのは、後片付けの確認のため</li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
