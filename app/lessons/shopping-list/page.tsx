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
import { Suspense } from "react";
import { AllInMemory } from "./demos/all-in-memory";
import { ShoppingList } from "./demos/shopping-list";
import { StatePlacementFigure } from "./figures/state-placement";

const SLUG = "shopping-list";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/shopping-list/demos/types.ts", label: "types.ts" },
  {
    path: "lessons/shopping-list/demos/all-in-memory.tsx",
    label: "all-in-memory.tsx",
  },
  {
    path: "lessons/shopping-list/demos/shopping-list.tsx",
    label: "shopping-list.tsx",
  },
  { path: "lessons/shopping-list/demos/filter-bar.tsx", label: "filter-bar.tsx" },
] as const;

const [TYPES, MEMORY, LIST, BAR] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          TODO リストと同じ形のものを、もう 1 つ作ります。
          <strong>新しい道具はほとんど出てきません。</strong>
        </p>
        <p>
          今回のテーマは 1 つだけです。
          <strong>どの値を、どこに置くか。</strong>
          Part 9 で置き場所を 1 つずつ見てきましたが、
          実際の画面では<strong>それらが同時に出てきます</strong>。
        </p>
      </LessonHeader>

      <LessonSection id="types" {...at(TYPES, "export type Item")}>
        <h2>まず、扱うものを決める</h2>

        <p>
          TODO のときと同じ順番です。型から決めます。
        </p>

        <StaticCode
          lang="ts"
          code={`type Category = "野菜" | "肉・魚" | "日用品" | "その他";

type Item = {
  id: number;
  name: string;
  category: Category;
  bought: boolean;
};`}
        />

        <p>
          分類を <code>string</code> にせず 4 つに絞ったのは、
          Part 0「TypeScript のさわり」でやったとおりです。
          打ち間違いがその場で分かります。
        </p>

        <h3>絞り込みは、持たずに計算する</h3>

        <StaticCode
          lang="ts"
          code={`// 表示する分を、そのつど計算して出す
const shown = filterItems(items, keyword, category);`}
        />

        <p>
          絞り込んだ結果を <code>useState</code> で持つと、
          <strong>元のリストと二重管理</strong>になります。
          Part 4「state は最小限にする」でやった形です。
          持つのは<strong>元のリストと、絞り込みの条件</strong>だけです。
        </p>
      </LessonSection>

      <LessonSection id="naive" {...at(MEMORY, "const [items, setItems]")}>
        <h2>まず、全部 useState で書いてみる</h2>

        <p>
          素直に書けばこうなります。3 つとも <code>useState</code> です。
        </p>

        <StaticCode
          lang="ts"
          code={`const [items, setItems] = useState(initialItems);
const [keyword, setKeyword] = useState("");
const [category, setCategory] = useState<Category | null>(null);`}
        />

        <DemoCard
          title="全部 useState に置いた版"
          tone="bad"
          sourcePath={MEMORY}
          showRenderCount
          description="絞り込んで、チェックを付けて、そのあと再読み込みする"
        >
          <AllInMemory />
        </DemoCard>

        <p>
          動きます。ちゃんと絞り込めますし、チェックも付きます。
          問題は<strong>ページを再読み込みしたとき</strong>です。
        </p>

        <ul>
          <li>
            <strong>買うものが最初に戻ります</strong>。
            さっき足したものも、チェックも消えます
          </li>
          <li>
            <strong>絞り込みも戻ります</strong>。
            人に「野菜だけ見せたい」と思っても、URL を送れません
          </li>
          <li>
            <strong>戻るボタンが効きません</strong>。
            絞り込みを間違えても、1 つ前には戻れません
          </li>
        </ul>

        <p>
          どれも「バグ」ではありません。
          <strong>メモリに置いたのだから、そうなって当然</strong>です。
          置き場所を間違えているだけです。
        </p>
      </LessonSection>

      <LessonSection id="placement" {...at(LIST, "const [items, setItems]")}>
        <h2>値ごとに、置き場所を決め直す</h2>

        <p>
          この画面には 3 種類の値があります。
          <strong>3 つとも性質が違います。</strong>
        </p>

        <StatePlacementFigure />

        <p>
          Part 9「状態の置き場所を選ぶ」で使った問いを、そのまま当てます。
        </p>

        <ul>
          <li>
            <strong>買うもの本体</strong> …{" "}
            閉じても残ってほしい。人に見せる必要はない →{" "}
            <strong>ブラウザに保存する</strong>
          </li>
          <li>
            <strong>絞り込みの条件</strong> …{" "}
            人に見せたい。戻るで戻りたい → <strong>URL に置く</strong>
          </li>
          <li>
            <strong>入力途中の品名</strong> …{" "}
            足したら消える。残っていたら邪魔 → <strong>useState</strong>
          </li>
        </ul>

        <StaticCode
          lang="ts"
          code={`// 閉じても残す
const [items, setItems] = useLocalStorageState("...", {
  defaultValue: initialItems,
});

// 人に見せる・戻れるようにする
const [keyword, setKeyword] = useQueryState("q", { defaultValue: "" });

// この画面かぎり
const [draft, setDraft] = useState("");`}
        />

        <p>
          <strong>3 つとも形が同じ</strong>なのが分かると思います。
          Part 9 で「また同じ形です」と繰り返し出てきたのは、
          この日のためです。
          <strong>置き場所を変えるのに、書き方を覚え直す必要はありません。</strong>
        </p>
      </LessonSection>

      <LessonSection id="fixed" {...at(LIST, "const shown = filterItems")}>
        <h2>置き場所を直した版</h2>

        <DemoCard
          title="値ごとに置き場所を決めた版"
          tone="good"
          sourcePath={LIST}
          showRenderCount
          description="絞り込んでから、再読み込み・戻る・URL のコピーを試す"
        >
          <Suspense
            fallback={<p className="text-muted-foreground">読み込み中…</p>}
          >
            <ShoppingList />
          </Suspense>
        </DemoCard>

        <p>試すことは 4 つです。</p>

        <ul>
          <li>
            絞り込んでから<strong>再読み込み</strong> …{" "}
            買うものも絞り込みも、そのまま残ります
          </li>
          <li>
            <strong>戻るボタン</strong> …{" "}
            1 つ前の絞り込みに戻ります
          </li>
          <li>
            アドレス欄を<strong>コピーして新しいタブで開く</strong> …{" "}
            同じ絞り込みの画面が出ます
          </li>
          <li>
            <strong>入力途中の品名</strong>だけは、
            新しいタブで開くと空です。消えてほしい値だからです
          </li>
        </ul>

        <Callout variant="note" title="書きかけの文字が残ることがあります">
          <p>
            再読み込みしたとき、入力途中の文字が残ることがあります。
            これは<strong>ブラウザが入力欄の値を復元する機能</strong>で、
            React とは関係ありません。
            新しいタブで開けば、ちゃんと空から始まります。
          </p>
        </Callout>

        <Callout variant="point" title="直したのは 3 行だけ">
          <p>
            <code>useState</code> を <code>useQueryState</code> と{" "}
            <code>useLocalStorageState</code> に差し替えました。
            <strong>それ以外は 1 行も変えていません。</strong>
          </p>
          <p>
            絞り込みの計算も、チェックの切り替えも、部品の分け方もそのままです。
            置き場所は、あとから変えられます。
            だから<strong>最初は useState で書き始めてよい</strong>のです。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="bar" {...at(BAR, "export function FilterBar")}>
        <h2>置き場所を知っているのは、1 か所だけ</h2>

        <p>
          絞り込みバーは、値が URL にあることを<strong>知りません</strong>。
          受け取っているのは、ただの値とただの関数です。
        </p>

        <StaticCode
          lang="ts"
          code={`function FilterBar({
  keyword,
  onKeywordChange,
  category,
  onCategoryChange,
}: { ... }) {`}
        />

        <p>
          Part 2 でやった<strong>「値は下へ、知らせは上へ」</strong>です。
          この形にしておくと、
          あとで置き場所を URL からサーバーに変えたくなっても、
          <strong>直すのは親だけ</strong>で済みます。
        </p>

        <p>
          描き直しの範囲も見てください。
          絞り込みバーに打つと、
          <strong>バーの箱もリストの箱も光ります</strong>。
          条件が変われば、絞り込んだ結果も変わるので当然です。
          ここは減らすところではありません。
        </p>
      </LessonSection>

      <LessonSection id="quiz" {...at(LIST, "useQueryState")}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="「検索条件を人に送りたい」とき、条件はどこに置く？"
          options={[
            {
              label: "URL",
              correct: true,
              explanation:
                "URL に置いておけば、そのままコピーして送れます。戻るボタンで前の条件に戻れるのも、URL に置いたときだけです。",
            },
            {
              label: "localStorage",
              explanation:
                "その端末のブラウザにしか残りません。送った相手の画面には反映されません。",
            },
            {
              label: "useState",
              explanation:
                "再読み込みで消えるので、そもそも送りようがありません。",
            },
          ]}
        />

        <Quiz
          question="入力途中の品名を localStorage に置くと、何が困る？"
          options={[
            {
              label: "書きかけの文字が、次に開いたときも残ってしまう",
              correct: true,
              explanation:
                "消えてほしい値まで残すと、それはそれで邪魔になります。「残す」は常に正しいわけではありません。置き場所は値ごとに選びます。",
            },
            {
              label: "文字が保存できないので、エラーになる",
              explanation:
                "文字列は問題なく保存できます。困るのは技術的な制約ではなく、使い勝手のほうです。",
            },
            {
              label: "入力するたびに描き直しが増えて重くなる",
              explanation:
                "描き直しの回数は useState のときと変わりません。置き場所が変わるだけです。",
            },
          ]}
        />

        <Quiz
          question="絞り込んだ結果を useState で持たないのはなぜ？"
          options={[
            {
              label: "元のリストと条件があれば計算で出せるから",
              correct: true,
              explanation:
                "計算で出せるものを state にすると、元が変わったときに更新し忘れます。Part 4「state は最小限にする」と同じ判断です。",
            },
            {
              label: "配列は state に入れられないから",
              explanation:
                "配列も state に入れられます。現に買うもの本体は配列です。",
            },
            {
              label: "URL に置くべきだから",
              explanation:
                "URL に置くのは条件のほうです。結果はどこにも置かず、そのつど計算します。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(LIST, "const [draft, setDraft]")}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            置き場所は画面ごとではなく、<strong>値ごとに決まる</strong>
          </li>
          <li>
            <strong>閉じても残す</strong>ならブラウザの保存領域、
            <strong>人に見せる・戻れる</strong>なら URL、
            <strong>この画面かぎり</strong>なら useState
          </li>
          <li>
            3 つとも<strong>使い方の形は同じ</strong>。
            だからあとから差し替えられる
          </li>
          <li>
            計算で出せるものは、<strong>どこにも置かない</strong>
          </li>
          <li>
            置き場所を知っているのは親だけにしておくと、
            <strong>変えるときに直す場所が 1 か所で済む</strong>
          </li>
        </ul>

        <Callout variant="note" title="この章で使った Part">
          <p>
            Part 0（型・配列の filter）、Part 2（値は下へ、知らせは上へ）、
            Part 3（リストと key）、Part 4（最小限の state・新しい配列を作る）、
            Part 9（URL・ブラウザ保存・置き場所の選び方）。
          </p>
        </Callout>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
