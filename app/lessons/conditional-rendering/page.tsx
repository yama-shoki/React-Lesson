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
import { BrokenCondition } from "./demos/broken-condition";
import { FixedCondition } from "./demos/fixed-condition";
import { Patterns } from "./demos/patterns";

const SLUG = "conditional-rendering";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/conditional-rendering/demos/broken-condition.tsx", label: "broken-condition.tsx" },
  { path: "lessons/conditional-rendering/demos/fixed-condition.tsx", label: "fixed-condition.tsx" },
  { path: "lessons/conditional-rendering/demos/patterns.tsx", label: "patterns.tsx" },
] as const;

const [BROKEN, FIXED, PATTERNS] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          ログインしていたら名前を出す。0 件なら何も出さない。読み込み中はぐるぐるを出す。
          画面には必ず「場合によって変わる部分」があります。
        </p>
        <p>
          JSX の中では <code>if</code> が書けません（Part 1 でやったとおり、
          波括弧の中には式しか置けないため）。
          その代わりに使う書き方が 3 つあります。
        </p>
        <p>
          そして<strong>そのうちのひとつには、有名な落とし穴があります</strong>。
        </p>
      </LessonHeader>

      <LessonSection id="ternary" {...at(PATTERNS, "status === value ?")}>
        <h2>2 つのうちどちらかなら、三項演算子</h2>

        <p>
          「A か B のどちらかを出す」なら、三項演算子が素直です。
        </p>

        <StaticCode
          code={`<span>{isLoggedIn ? "さとうさん" : "ゲスト"}</span>`}
        />

        <p>
          <code>条件 ? 真のとき : 偽のとき</code> という形です。
          これは式なので、JSX の波括弧の中に置けます。
        </p>

        <p>
          ただし、入れ子にすると一気に読めなくなります。
        </p>

        <StaticCode
          code={`// 読めたものではない
{isLoading ? <Spinner /> : isEmpty ? <Empty /> : <List />}`}
        />

        <p>
          2 段以上になったら、次に出てくる早期 return に切り替えます。
        </p>
      </LessonSection>

      <LessonSection id="broken" {...at(BROKEN, "{items.length &&")}>
        <h2>「あるときだけ出す」の落とし穴</h2>

        <p>
          「条件を満たすときだけ出す。そうでなければ何も出さない」場合、
          <code>&amp;&amp;</code> を使います。
        </p>

        <StaticCode
          code={`{items.length && <p>{items.length} 件あります</p>}`}
        />

        <p>
          一見よさそうですが、これは<strong>壊れています</strong>。
          下のデモで「空にする」を押してみてください。
        </p>

        <DemoCard
          title="件数がないときの表示"
          tone="bad"
          sourcePath={BROKEN}
          showRenderCount
          description="空にすると 0 が残る"
        >
          <BrokenCondition />
        </DemoCard>

        <p>
          何も出ないはずが、<strong>0 という文字が表示されました</strong>。
        </p>

        <p>
          理由は Part 0 の「truthy / falsy」 でやったとおりです。
          <code>&amp;&amp;</code> は true / false を返すのではなく、
          <strong>左が偽ならその左の値をそのまま返します</strong>。
          件数が 0 のとき、この式は <code>0</code> になります。
        </p>

        <p>
          そして React は、<strong>数値を画面に表示します</strong>。
          <code>false</code> なら消えてくれるのに、
          <code>0</code> は表示対象なので残ってしまうのです。
        </p>
      </LessonSection>

      <LessonSection id="fixed" {...at(FIXED, "{items.length > 0 &&")}>
        <h2>直し方</h2>

        <p>
          <code>&amp;&amp;</code> の左を、<strong>必ず true / false にしてから</strong>渡します。
        </p>

        <StaticCode
          code={`// ✕ 0 が画面に出る
{items.length && <p>…</p>}

// ○ 比較して true / false にする
{items.length > 0 && <p>…</p>}`}
        />

        <DemoCard
          title="比較してから渡す"
          tone="good"
          sourcePath={FIXED}
          showRenderCount
          description="空にしても何も出ない"
        >
          <FixedCondition />
        </DemoCard>

        <Callout variant="point" title="React が表示しないもの">
          <p>
            <code>false</code>、<code>null</code>、<code>undefined</code>{" "}
            は画面に出ません。
            一方 <code>0</code> は falsy ですが
            <strong>そのまま数字として表示されます</strong>。
            この章のバグの正体はこれです。
          </p>
          <p>
            （<code>&quot;&quot;</code> も出ますが、空なので見えません。
            目に見える形で残るのは <code>0</code> だけだと思って大丈夫です）
          </p>
          <p>
            <strong>数値を <code>&amp;&amp;</code> の左に置かない。</strong>
            これだけ覚えておけば防げます。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="early-return" {...at(PATTERNS, "function Result")}>
        <h2>場合が増えたら、早めに返す</h2>

        <p>
          出し分けが 3 つ以上になったら、三項演算子を重ねるより
          <strong>先に返してしまう</strong>ほうが読みやすくなります。
        </p>

        <StaticCode
          code={`function Result({ status }: { status: Status }) {
  if (status === "loading") {
    return <p>読み込み中…</p>;
  }

  if (status === "empty") {
    return <p>データがありません</p>;
  }

  return <p>3 件のデータがあります</p>;
}`}
        />

        <p>
          コンポーネントはただの関数なので、
          <strong>JSX の外側では <code>if</code> が自由に使えます</strong>。
          書けないのは JSX の波括弧の中だけです。
        </p>

        <DemoCard
          title="状態ごとに表示を変える"
          sourcePath={PATTERNS}
          showRenderCount
          description="ボタンで状態を切り替えられる"
        >
          <Patterns />
        </DemoCard>

        <p>
          この形の良いところは、
          <strong>それぞれの場合が独立して読める</strong>ことです。
          「読み込み中はこれ」で話が終わり、次の行に進めます。
        </p>

        <h3>何も出したくないときは null</h3>

        <StaticCode
          code={`function Banner({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) return null;

  return <div>お知らせ</div>;
}`}
        />

        <p>
          <code>null</code> を返すと、何も表示されません。
          「条件を満たさないときは、そもそも何も描かない」を
          はっきり書けます。
        </p>
      </LessonSection>

      <LessonSection id="quiz" {...at(BROKEN, "{items.length &&")}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="{items.length && <p>…</p>} で、items が空のとき何が起きる？"
          options={[
            {
              label: "画面に 0 が表示される",
              correct: true,
              explanation:
                "&& は左が偽ならその値を返すので式全体が 0 になり、React は数値の 0 を表示します。",
            },
            {
              label: "何も表示されない",
              explanation:
                "false であれば表示されませんが、返っているのは 0 です。0 は表示対象です。",
            },
            {
              label: "エラーになる",
              explanation:
                "エラーにはなりません。静かに 0 が表示されるので、かえって原因に気づきにくい問題です。",
            },
          ]}
        />

        <Quiz
          question="JSX の中で if が書けないのに、コンポーネントの中では if が書けるのはなぜ？"
          options={[
            {
              label: "書けないのは JSX の波括弧の中だけで、関数の中はふつうの JavaScript だから",
              correct: true,
              explanation:
                "コンポーネントはただの関数です。return より前では if も for も自由に使えます。",
            },
            {
              label: "React が特別に許可しているから",
              explanation:
                "特別扱いはありません。JSX の外側は、もともとふつうの JavaScript です。",
            },
            {
              label: "早期 return のときだけ例外的に使えるから",
              explanation:
                "例外ではありません。関数の中であれば、どんな使い方でも問題ありません。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(FIXED)}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            2 択なら<strong>三項演算子</strong>。入れ子にしない
          </li>
          <li>
            あるときだけ出すなら <code>&amp;&amp;</code>。ただし
            <strong>左は必ず true / false にする</strong>
          </li>
          <li>
            <code>0</code> は falsy だが<strong>画面に表示される</strong>。
            <code>length &gt; 0</code> のように比較を挟む
          </li>
          <li>
            場合が 3 つ以上なら<strong>早期 return</strong>。JSX の外なら if が使える
          </li>
          <li>
            何も出したくないときは <code>null</code> を返す
          </li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
