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
import { DerivedState } from "./demos/derived-state";
import { DuplicatedState } from "./demos/duplicated-state";

const SLUG = "minimal-state";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/minimal-state/demos/duplicated-state.tsx", label: "duplicated-state.tsx" },
  { path: "lessons/minimal-state/demos/derived-state.tsx", label: "derived-state.tsx" },
] as const;

const [DUPLICATED, DERIVED] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          <code>useState</code> が使えるようになると、
          画面に出したいものを片っ端から state にしたくなります。
        </p>
        <p>
          ですが state は<strong>増やすほど壊れやすくなります</strong>。
          持つべきものと、持ってはいけないものがあります。
        </p>
        <p>
          判断の基準はひとつだけです。
          <strong>他の state から計算できるなら、state にしない。</strong>
        </p>
      </LessonHeader>

      <LessonSection id="duplicated" {...at(DUPLICATED, "const [count, setCount]")}>
        <h2>同じことを 2 か所で持つと、ずれる</h2>

        <p>
          リストと、その件数を表示する画面を考えます。
          素直に作ると、両方を state にしてしまいがちです。
        </p>

        <StaticCode
          lang="ts"
          code={`const [items, setItems] = useState(["りんご"]);
const [count, setCount] = useState(1);`}
        />

        <p>
          こうすると、<strong>items を変えるたびに count も直す</strong>
          必要が出てきます。下のデモで「空にする」を押してみてください。
        </p>

        <DemoCard
          title="件数も state にした場合"
          tone="bad"
          sourcePath={DUPLICATED}
          showRenderCount
          description="中身は空なのに、件数だけ残る"
        >
          <DuplicatedState />
        </DemoCard>

        <p>
          中身は空なのに、件数は残ったままです。
          <code>clear</code> の中で <code>setCount(0)</code> を書き忘れたためです。
        </p>

        <p>
          これは「うっかり」で片付く話ではありません。
          <strong>2 か所を手で合わせ続けなければならない作り</strong>にした時点で、
          いつか必ず起きます。更新する場所が増えるほど、確率は上がります。
        </p>

        <Callout variant="warn" title="Part 1 のバグが戻ってきている">
          <p>
            「値は正しいのに表示が古い」というのは、Part 1
            で見た素の JavaScript のバグそのものです。
            React を使っていても、<strong>state を二重に持てば同じことが起きます</strong>。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="derived" {...at(DERIVED, "const count = items.length")}>
        <h2>計算できるものは、計算する</h2>

        <p>
          件数は <code>items</code> から必ず求まります。
          なら、持つ必要はありません。
        </p>

        <StaticCode
          lang="ts"
          code={`const [items, setItems] = useState(["りんご"]);

// state ではなく、ただの変数
const count = items.length;`}
        />

        <p>
          コンポーネントは state
          が変わるたびに実行し直されるので、
          <strong>この行も毎回計算し直されます</strong>。
          つまり常に最新です。
        </p>

        <DemoCard
          title="件数を計算で出した場合"
          tone="good"
          sourcePath={DERIVED}
          showRenderCount
          description="更新の書き忘れが起こりえない"
        >
          <DerivedState />
        </DemoCard>

        <p>
          <code>clear</code> のような処理も、
          <code>setItems([])</code> だけで済みます。
          <strong>合わせる相手がいないので、ずれようがありません。</strong>
        </p>

        <Callout variant="point" title="判断の基準">
          <p>
            <strong>他の state から計算できるなら、それは state ではない。</strong>
          </p>
          <p>
            合計・件数・絞り込んだ結果・入力が空かどうか・ボタンを押せるかどうか。
            これらはすべて計算で出せます。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="examples" {...at(DERIVED, "const count = items.length")}>
        <h3>よくある「state にしなくていいもの」</h3>

        <StaticCode
          lang="ts"
          code={`const [items, setItems] = useState<Item[]>([]);
const [keyword, setKeyword] = useState("");

// どれも計算で出せる。state にしない
const count = items.length;
const isEmpty = items.length === 0;
const total = items.reduce((sum, item) => sum + item.price, 0);
const found = items.filter((item) => item.name.includes(keyword));
const canSubmit = keyword.trim() !== "";`}
        />

        <p>
          ここで state なのは <code>items</code> と <code>keyword</code>{" "}
          の 2 つだけです。残りは全部そこから決まります。
        </p>

        <p>
          「この画面の状態は何か」を考えるとき、
          <strong>これ以上減らせない情報は何か</strong>という問い方をすると、
          自然と最小限になります。
        </p>

        <Callout variant="note" title="計算が重いときは">
          <p>
            毎回計算すると重い処理の場合は、
            <code>useMemo</code> という道具で結果を覚えておけます。
            ただし<strong>先回りして使うと読みにくくなるだけ</strong>なので、
            実際に遅くなってから考えます。Part 8 で扱います。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="quiz" {...at(DERIVED)}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="items と、その件数 count を両方 state にすると何が起きる？"
          options={[
            {
              label: "更新のたびに両方を合わせる必要があり、書き忘れるとずれる",
              correct: true,
              explanation:
                "手で同期を取り続ける作りになります。更新箇所が増えるほど、書き忘れは起きやすくなります。",
            },
            {
              label: "メモリを余分に使うだけで、動作に問題はない",
              explanation:
                "問題は容量ではなく整合性です。実際にずれた画面が出てしまいます。",
            },
            {
              label: "React がエラーを出して教えてくれる",
              explanation:
                "React は関知しません。どちらも正当な state なので、ずれていても気づけません。",
            },
          ]}
        />

        <Quiz
          question="次のうち、state にすべきなのはどれ？"
          options={[
            {
              label: "ユーザーが入力した検索キーワード",
              correct: true,
              explanation:
                "他の何かから計算では出せません。ユーザーの操作でしか決まらない情報なので state です。",
            },
            {
              label: "検索結果の件数",
              explanation:
                "検索結果の配列から length で出せます。計算できるものは state にしません。",
            },
            {
              label: "送信ボタンを押せるかどうか",
              explanation:
                "入力が空かどうかなどから計算できます。keyword.trim() !== '' のように毎回求めます。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(DERIVED)}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            <strong>他の state から計算できるものは、state にしない</strong>
          </li>
          <li>
            二重に持つと、更新のたびに手で合わせる必要が生まれ、いつかずれる
          </li>
          <li>
            計算した値はコンポーネントの実行のたびに求め直されるので、常に最新
          </li>
          <li>
            件数・合計・絞り込み結果・押せるかどうかは、たいてい計算で出せる
          </li>
          <li>
            state を決めるときは<strong>「これ以上減らせない情報は何か」</strong>と考える
          </li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
