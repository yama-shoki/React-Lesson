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
import { LeakingTimer } from "./demos/leaking-timer";
import { Race } from "./demos/race";
import { Timer } from "./demos/timer";

const SLUG = "cleanup";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/cleanup/demos/leaking-timer.tsx", label: "leaking-timer.tsx" },
  { path: "lessons/cleanup/demos/timer.tsx", label: "timer.tsx" },
  { path: "lessons/cleanup/demos/race.tsx", label: "race.tsx" },
] as const;

const [LEAKING, TIMER, RACE] = SOURCES.map((source) => source.path);

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
          タイマーを動かしたら止める。<strong>購読</strong>したら解除する
          （「購読」は<strong>「これが起きたら教えて」と登録しておくこと</strong>。
          新聞の定期購読と同じで、いらなくなったら止める必要があります）。
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

        <DemoCard
          title="後片付けを書かなかった時計"
          tone="bad"
          sourcePath={LEAKING}
          description="「隠す」「表示する」を何度か往復してから、数えてみる"
        >
          <LeakingTimer />
        </DemoCard>

        <p>
          隠しても、<strong>タイマーは止まっていません</strong>。
          そして往復するたびに<strong>新しいタイマーが増えます</strong>。
          「動いているタイマーを数える」を押すと、いま動いている本数が出ます。
        </p>

        <p>
          もう一度表示したときに秒数が 0 から始まるので、
          <strong>画面の上では何も壊れていないように見えます</strong>。
          これがこの不具合のいやなところです。
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
            すでにない state を更新しようとする。
            昔は警告が出ましたが、<strong>いまは何も言われずに黙って無視されます</strong>
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

      <LessonSection id="race" {...at(RACE, "let ignore = false")}>
        <h2>後片付けは、通信でも要る</h2>

        <p>
          後片付けはタイマーだけの話ではありません。
          <strong>通信でこそ効いてきます</strong>。
        </p>

        <p>
          こういう画面を考えます。
          ボタンで表示する人を切り替えると、その人のデータを取りにいく。
          素直に書くと、こうなります。
        </p>

        <StaticCode
          lang="ts"
          code={`useEffect(() => {
  fetch(\`/api/profile?id=\${id}\`)
    .then((response) => response.json())
    .then((data) => setProfile(data));
}, [id]);`}
        />

        <p>
          動いているように見えます。ですが、
          <strong>通信にかかる時間は毎回ちがいます</strong>。
          先に頼んだほうが先に返ってくるとはかぎりません。
        </p>

        <DemoCard
          title="1 番 → 2 番と続けて切り替える"
          sourcePath={RACE}
          description="1 番だけ、わざと返事が遅くなるようにしてあります"
        >
          <Race />
        </DemoCard>

        <p>
          ボタンを押すと、1 番を選んだ直後に 2 番へ切り替わります。
          上の箱は、いったん 2 番（すずき）を表示したあと、
          <strong>あとから届いた 1 番（さとう）に上書きされます</strong>。
          選んでいるのは 2 番なのに、画面には 1 番が出ている状態です。
        </p>

        <Callout variant="warn" title="順番が入れ替わる">
          <p>
            これは<strong>競合状態</strong>と呼ばれます。
            速い返事が先に着き、
            <strong>遅い返事があとから上書きしてしまう</strong>ことで起きます。
          </p>
          <p>
            通信が速い開発環境では<strong>ほとんど再現しません</strong>。
            そして本番の遅い回線でだけ、
            「たまに違う人が出る」という形で現れます。
          </p>
        </Callout>

        <h3>直し方は、後片付けと同じ</h3>

        <p>
          新しい effect が始まる前に、
          <strong>古い effect の結果を無効にしておきます</strong>。
        </p>

        <StaticCode
          lang="ts"
          code={`useEffect(() => {
  // この effect が「まだ有効か」の目印
  let ignore = false;

  fetch(\`/api/profile?id=\${id}\`)
    .then((response) => response.json())
    .then((data) => {
      // 古くなっていたら、返ってきた結果を捨てる
      if (!ignore) setProfile(data);
    });

  return () => {
    ignore = true;
  };
}, [id]);`}
        />

        <p>
          <code>id</code> が変わると、React はまず後片付けを呼びます。
          そこで <code>ignore</code> を立てておけば、
          あとから届いた古い返事は<strong>捨てられます</strong>。
          下の箱が上書きされないのは、これが理由です。
        </p>

        <Callout variant="note" title="通信そのものを取り消したいときは">
          <p>
            <code>ignore</code> は<strong>結果を捨てるだけ</strong>で、
            通信自体は最後まで走ります。
            通信そのものを止めたいときは <code>AbortController</code> を使います
            （次の節のコード例にあります）。
          </p>
          <p>
            ふだんは <code>ignore</code>{" "}
            で十分です。<strong>画面が嘘をつかないこと</strong>が目的なので。
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
// AbortController は「あとから通信を取り消すためのリモコン」。
// signal を fetch に渡しておくと、abort() で取り消せる
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

        <Callout variant="note" title="開発中に 2 回実行されるのは（StrictMode）">
          <p>
            開発中、effect が 2 回実行されます。これは不具合ではありません。
            <strong>StrictMode</strong> という開発用の仕組みが働いています。
          </p>
          <p>
            React が<strong>わざと</strong>「実行 → 後片付け → もう一度実行」を試して、
            <strong>後片付けが正しく書けているかを確かめている</strong>ためです。
            2 回動いて困るなら、後片付けが足りていない合図になります。
          </p>
          <p>
            <strong>本番では 1 回だけ</strong>です。
            開発中にだけ現れるので、
            「本番でも 2 回動くのでは」と心配しなくて大丈夫です。
          </p>
          <p>
            この名前は覚えておいてください。
            記事やエラー文で <code>StrictMode</code> を見かけたとき、
            この話だと分かります。
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

        <Quiz
          question="通信の結果が入れ替わる（古い返事が新しい表示を上書きする）のを防ぐには？"
          options={[
            {
              label: "後片付けで目印を立てて、古い effect の結果を捨てる",
              correct: true,
              explanation:
                "依存が変わると、新しい effect が始まる前に後片付けが呼ばれます。そこで ignore を立てておけば、あとから届いた古い返事を無視できます。",
            },
            {
              label: "通信が終わるまで、次の入力を受け付けないようにする",
              explanation:
                "打つたびに固まる画面になってしまいます。入力は自由にさせたまま、古い結果だけを捨てるのが筋です。",
            },
            {
              label: "通信を速くする",
              explanation:
                "速さは相手や回線しだいで、こちらでは決められません。速くても順番が入れ替わる可能性は残ります。",
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
