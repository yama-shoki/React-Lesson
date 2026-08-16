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
import Link from "next/link";
import { EffectDerived } from "./demos/effect-derived";
import { EffectChain, JustCompute } from "./demos/effect-chain";
import { JustCalculate } from "./demos/just-calculate";

const SLUG = "you-might-not-need-effect";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/you-might-not-need-effect/demos/effect-derived.tsx", label: "effect-derived.tsx" },
  { path: "lessons/you-might-not-need-effect/demos/just-calculate.tsx", label: "just-calculate.tsx" },
  {
    path: "lessons/you-might-not-need-effect/demos/effect-chain.tsx",
    label: "effect-chain.tsx",
  },
] as const;

const [EFFECT, CALCULATE, CHAIN] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          前の章で「<code>useEffect</code> は React
          の外側と同期するための道具」と書きました。
        </p>
        <p>
          裏を返すと、<strong>外側が出てこないなら要らない</strong>ということです。
        </p>
        <p>
          ここでは、実際によく書かれてしまう形を 6 つ取り上げて、
          それぞれ<strong>どう書けばよかったのか</strong>を見ます。
        </p>
      </LessonHeader>

      <LessonSection id="derived" {...at(EFFECT, "useEffect(() => {")}>
        <h2>1. 計算できる値を、effect で作っている</h2>

        <p>いちばん多いのがこれです。</p>

        <StaticCode
          lang="ts"
          code={`const [items, setItems] = useState([]);
const [count, setCount] = useState(0);

useEffect(() => {
  setCount(items.length);
}, [items]);`}
        />

        <p>
          動きはします。ですが問題があります。
        </p>

        <DemoCard
          title="effect で件数を合わせる"
          tone="bad"
          sourcePath={EFFECT}
          showRenderCount
          description="動くが、遠回りしている"
        >
          <EffectDerived />
        </DemoCard>

        <ul>
          <li>
            <strong>2 回描き直している</strong> …
            items が変わって 1 回、そのあと effect が setCount してもう 1 回
          </li>
          <li>
            <strong>一瞬ずれた状態が表示される</strong> …
            1 回目の描画では、count はまだ古い値
          </li>
          <li>
            Part 4 の「state は最小限にする」 でやった<strong>二重管理</strong>そのもの
          </li>
        </ul>

        <p>正解は、ずっと単純です。</p>

        <DemoCard
          title="ただ計算する"
          tone="good"
          sourcePath={CALCULATE}
          showRenderCount
          description="useEffect も state も要らない"
        >
          <JustCalculate />
        </DemoCard>

        <Callout variant="point" title="判断のしかた">
          <p>
            effect の中で <code>setState</code> しか呼んでいないなら、
            <strong>それは effect ではありません</strong>。
            ただの計算です。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="props-to-state" {...at(EFFECT, "const [count, setCount]")}>
        <h2>2. props を state に写している</h2>

        <StaticCode
          lang="ts"
          code={`// ✕ props が変わるたびに state を合わせている
const [name, setName] = useState(props.name);

useEffect(() => {
  setName(props.name);
}, [props.name]);`}
        />

        <p>
          これも二重管理です。<code>props.name</code>{" "}
          という正解がすでにあるのに、その写しを持ってしまっています。
        </p>

        <StaticCode
          lang="ts"
          code={`// ○ そのまま使えばよい
<p>{props.name}</p>`}
        />

        <p>
          「編集できるようにしたいから state が必要」という場合もありますが、
          そのときは<strong>編集中の値だけ</strong>を state にします。
          表示用に丸ごと写す必要はありません。
        </p>
      </LessonSection>

      <LessonSection id="event" {...at(CALCULATE, "onClick={() => setItems")}>
        <h2>3. イベントで済むことを effect でやっている</h2>

        <StaticCode
          lang="ts"
          code={`// ✕ 送信されたことを state にして、effect で検知している
const [submitted, setSubmitted] = useState(false);

useEffect(() => {
  if (submitted) {
    sendData();
  }
}, [submitted]);`}
        />

        <p>
          「送信ボタンが押されたら送る」のであれば、
          <strong>押されたその場所に書けば済みます</strong>。
        </p>

        <StaticCode
          lang="ts"
          code={`// ○ 押されたときの処理は、押されたところに書く
const handleSubmit = () => {
  sendData();
};`}
        />

        <Callout variant="point" title="見分け方">
          <p>
            <strong>ユーザーが何かしたから起きること</strong>は、イベントハンドラ。
          </p>
          <p>
            <strong>画面が表示されている限り保っておきたい状態</strong>は、effect。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="reset" {...at(CALCULATE, "const [items, setItems]")}>
        <h2>4. state を初期化するために使っている</h2>

        <StaticCode
          lang="ts"
          code={`// ✕ id が変わったら入力内容を消したい
useEffect(() => {
  setText("");
}, [userId]);`}
        />

        <p>
          これは Part 4「useState の応用」でやった <code>key</code>{" "}
          で解決できます。
        </p>

        <StaticCode
          code={`// ○ key を変えると、React は別物とみなして作り直す
<EditForm key={userId} userId={userId} />`}
        />

        <p>
          「key が変わると state ごと作り直される」という性質は、
          リストと key の章でも触れました。
          <strong>初期化したいなら、作り直させるのがいちばん確実</strong>です。
        </p>
      </LessonSection>

      <LessonSection id="chain" {...at(CHAIN, "// 2 つめ")}>
        <h2>5. effect が、次の effect を呼んでいる</h2>

        <p>
          いちばん見つけにくい形です。
          1 つ 1 つは自然に見えるのに、つなぐと苦しくなります。
        </p>

        <StaticCode
          lang="ts"
          code={`useEffect(() => { setSubtotal(...) }, [items]);      // 品目 → 小計
useEffect(() => { setTax(...) }, [subtotal]);        // 小計 → 税
useEffect(() => { setTotal(...) }, [subtotal, tax]); // 税 → 合計`}
        />

        <DemoCard
          title="effect を数珠つなぎにした版"
          tone="bad"
          sourcePath={CHAIN}
          showRenderCount
          description="1 回押して、render の数字を見る"
        >
          <EffectChain />
        </DemoCard>

        <p>
          <strong>1 回押しただけで、何度も描き直されます。</strong>
          小計が決まってから税、税が決まってから合計、と
          <strong>順番に待っている</strong>ためです。
          画面には一瞬、税がまだ古い状態も映ります。
        </p>

        <DemoCard
          title="その場で計算した版"
          tone="good"
          sourcePath={CHAIN}
          showRenderCount
          description="同じように 1 回押す"
        >
          <JustCompute />
        </DemoCard>

        <p>
          <strong>1 回で終わります。</strong>
          持っているのは品目だけで、
          小計も税も合計も<strong>そのつど計算しているだけ</strong>です。
        </p>

        <Callout variant="point" title="1 と同じ話が、連鎖して見えているだけ">
          <p>
            これは <strong>1 番「計算できる値を effect で作っている」</strong>が
            3 つ並んだものです。
            1 つずつ見ると気づきにくいのに、
            <strong>つながると途中の状態まで画面に出てしまいます</strong>。
          </p>
          <p>
            <code>useEffect</code> の依存配列に
            <strong>自分が更新した state が入っている</strong>のを見つけたら、
            この形を疑ってください。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="notify" {...at(CALCULATE)}>
        <h2>6. 親に知らせるために使っている</h2>

        <StaticCode
          lang="ts"
          code={`// ✕ 選択が変わったら、親に伝えたい
function Child({ onSelect }) {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    onSelect(selected);
  }, [selected]);
}`}
        />

        <p>
          動きはしますが、遠回りです。
          <strong>選ばれた瞬間には、もう分かっている</strong>のに、
          わざわざ描き直しを 1 回はさんでから伝えています。
        </p>

        <StaticCode
          lang="ts"
          code={`// ○ その場で両方やる
function Child({ onSelect }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (value) => {
    setSelected(value);
    onSelect(value);      // 同じイベントの中で伝える
  };
}`}
        />

        <p>
          <strong>3 番と同じ考え方</strong>です。
          「値が変わったから」ではなく、
          <strong>「押されたから」</strong>で書けないかを先に考えます。
        </p>

        <Callout variant="note" title="そもそも子が持たなくてよいことも多い">
          <p>
            親も知りたい値なら、
            <Link href="/lessons/lifting-state">state のリフトアップ</Link>{" "}
            で親に持たせてしまうほうが素直です。
            そうすれば「伝える」こと自体が要らなくなります。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="needed" {...at(CALCULATE, "const count = items.length")}>
        <h2>では、いつ使うのか</h2>

        <p>
          ここまで否定ばかりでしたが、必要な場面はもちろんあります。
          共通しているのは、<strong>相手が React の外側にいる</strong>ことです。
        </p>

        <ul>
          <li>タイマーを動かす / 止める</li>
          <li>ブラウザのイベントを購読する</li>
          <li>ブラウザのタブ名や表示位置を操作する</li>
          <li>React で書かれていないライブラリと接続する</li>
        </ul>

        <Callout variant="note" title="データの取得は？">
          <p>
            サーバーからのデータ取得も外側との通信なので、
            <code>useEffect</code> で書けます。
            ただし現在は、
            <strong>フレームワークやライブラリに任せるのが主流</strong>です。
          </p>
          <p>
            読み込み中・失敗・再取得・重複防止などを自前で正しく書くのは、
            見た目より難しいためです。Part 9 で扱います。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="quiz" {...at(CALCULATE)}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="effect の中で setState しか呼んでいない。これは？"
          options={[
            {
              label: "effect ではなく、ただの計算。state をやめて計算にする",
              correct: true,
              explanation:
                "外側とのやり取りがないので effect の出番ではありません。二重管理になり、描き直しも 2 回になります。",
            },
            {
              label: "正しい使い方。state の更新は effect で行う",
              explanation:
                "state の更新のために effect を使う必要はありません。値から決まるなら計算で出せます。",
            },
            {
              label: "依存配列を正しく書けば問題ない",
              explanation:
                "依存配列の問題ではありません。そもそも effect が不要です。",
            },
          ]}
        />

        <Quiz
          question="userId が変わったら、フォームの入力内容を消したい。どうする？"
          options={[
            {
              label: "コンポーネントに key={userId} を付けて作り直させる",
              correct: true,
              explanation:
                "key が変わると React は別のコンポーネントとみなし、state ごと作り直します。初期化にはこれが確実です。",
            },
            {
              label: "useEffect で userId を監視して setText('') する",
              explanation:
                "動きはしますが、一瞬古い内容が表示されます。項目が増えるほど消し忘れも起きます。",
            },
            {
              label: "userId が変わるたびに、コンポーネントを作り直す処理を自分で書く",
              explanation:
                "それを宣言的に書く方法が key です。自分で処理を書く必要はありません。",
            },
          ]}
        />

        <Quiz
          question="useEffect の依存配列に、自分がその effect で更新している値が入っている。何を疑う？"
          options={[
            {
              label: "計算で出せるものを、わざわざ state にして受け渡している",
              correct: true,
              explanation:
                "effect が次の effect を呼ぶ連鎖になっている合図です。1 回の操作で何度も描き直され、途中の状態まで画面に出ます。その場で計算すれば 1 回で終わります。",
            },
            {
              label: "依存配列に書きすぎている。減らせばよい",
              explanation:
                "減らすと今度は古い値のまま止まります。直すのは依存配列ではなく、state の持ち方のほうです。",
            },
            {
              label: "問題ない。よくある書き方",
              explanation:
                "よく書かれてしまう形ではありますが、問題はあります。1 つずつ見ると自然に見えるぶん、いちばん見つけにくい形です。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(CALCULATE)}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            計算できる値は<strong>計算する</strong>。effect で state に写さない
          </li>
          <li>
            props はそのまま使う。<strong>state に写さない</strong>
          </li>
          <li>
            ユーザーの操作で起きることは<strong>イベントハンドラ</strong>に書く
          </li>
          <li>
            state を初期化したいときは <code>key</code> で作り直させる
          </li>
          <li>
            使うのは<strong>React の外側とやり取りするとき</strong>だけ
          </li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
