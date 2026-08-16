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
import { Notepad } from "./demos/notepad";
import { OneBigContext } from "./demos/one-big-context";

const SLUG = "notepad";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/notepad/demos/types.ts", label: "types.ts" },
  {
    path: "lessons/notepad/demos/one-big-context.tsx",
    label: "one-big-context.tsx",
  },
  { path: "lessons/notepad/demos/notepad.tsx", label: "notepad.tsx" },
] as const;

const [TYPES, BIG, NOTEPAD] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          今度は<strong>離れた部品どうしで値を共有する</strong>画面を作ります。
          メモ帳です。一覧・本文・配色の切り替えが、
          それぞれ別の部品になっています。
        </p>
        <p>
          Part 8 と Part 9 でやったことが、ここで 1 つにつながります。
          テーマは<strong>「打つたびに、どこまで描き直されるか」</strong>です。
        </p>
      </LessonHeader>

      <LessonSection id="shape" {...at(TYPES, "export type Memo")}>
        <h2>作るもの</h2>

        <StaticCode
          lang="ts"
          code={`type Memo = {
  id: number;
  title: string;
  body: string;
};

// メモ帳の中だけの配色。アプリ全体のテーマとは別のもの
type Palette = "plain" | "warm" | "cool";`}
        />

        <p>部品は 4 つです。</p>

        <ul>
          <li>
            <strong>ヘッダー</strong> … 配色だけを使う
          </li>
          <li>
            <strong>一覧</strong> … メモの題名と、選ばれている ID を使う
          </li>
          <li>
            <strong>本文</strong> … 選ばれているメモの中身を編集する
          </li>
          <li>
            <strong>配色の切り替え</strong> … 配色を変える
          </li>
        </ul>

        <p>
          本文に 1 文字打ったとき、
          <strong>ヘッダーと配色ボタンには関係がない</strong>はずです。
          配色は変えていないのですから。
          そうなるかどうかを見ていきます。
        </p>
      </LessonSection>

      <LessonSection id="big" {...at(BIG, "const NotepadContext = createContext")}>
        <h2>まず、ひとつの Context にまとめて書く</h2>

        <p>
          共有したい値をぜんぶ 1 つの Context に入れます。
          自然な書き方ですし、実際よく見かけます。
        </p>

        <StaticCode
          lang="ts"
          code={`const NotepadContext = createContext<{
  memos: Memo[];
  selectedId: number;
  palette: Palette;
  select: (id: number) => void;
  updateBody: (body: string) => void;
  setPalette: (palette: Palette) => void;
}>({ ... });`}
        />

        <p>
          さらに、<strong>4 つの部品はすべて <code>memo</code> で
          包んであります</strong>。
          Part 8 でやったとおり、無駄な描き直しを止めるためです。
        </p>

        <DemoCard
          title="ひとつの Context にまとめた版"
          tone="bad"
          sourcePath={BIG}
          description="本文に 1 文字打ってみる"
        >
          <OneBigContext />
        </DemoCard>

        <p>
          <strong>4 つとも光ります。</strong>
          本文に打っただけなのに、ヘッダーも一覧も配色ボタンも
          描き直されています。
          <code>memo</code> で包んだのに、です。
        </p>

        <Callout variant="warn" title="memo は Context を止められない">
          <p>
            <code>memo</code> が見比べるのは <strong>props だけ</strong>です。
            Context から受け取った値は props ではないので、
            <strong>比較の対象になりません</strong>。
          </p>
          <p>
            購読している Context の値が変われば、
            <code>memo</code> で包んでいても描き直されます。
            これは Part 8 で見た「効かない props」より、さらに手前の話です。
          </p>
        </Callout>

        <h3>2 つの原因が重なっている</h3>

        <p>
          Part 9「Context と再レンダリング」でやった 2 つが、
          両方そろっています。
        </p>

        <ul>
          <li>
            <strong>項目単位で購読できない</strong> …{" "}
            配色しか使っていないヘッダーも、
            「NotepadContext を購読している」としか見なされない
          </li>
          <li>
            <strong>value を毎回作り直している</strong> …{" "}
            <code>value=&#123;&#123; ... &#125;&#125;</code> と
            その場で書いているので、
            Provider が描き直されるたびに別のものになる
          </li>
        </ul>
      </LessonSection>

      <LessonSection id="split" {...at(NOTEPAD, "const PaletteContext")}>
        <h2>関心ごとに分ける</h2>

        <p>
          分ける基準は<strong>「一緒に変わるかどうか」</strong>でした。
          この画面では 3 つに分かれます。
        </p>

        <StaticCode
          lang="ts"
          code={`// 配色 … メモとは無関係に変わる
const PaletteContext = createContext(...);

// メモの中身 … 打つたびに変わる
const MemosContext = createContext(...);

// 操作 … 値を持たないので、そもそも変わらない
const ActionsContext = createContext(...);`}
        />

        <h3>3 つめが効いてくる</h3>

        <p>
          <strong>操作だけを別にする</strong>のがこの章の山場です。
          「選ぶ」「本文を書き換える」という関数は、
          <strong>メモの中身が変わっても、中身は同じ</strong>でいられます。
        </p>

        <StaticCode
          lang="ts"
          code={`// 値のほうは、変わるたびに新しくなる
const memosValue = useMemo(() => ({ memos, selectedId }), [memos, selectedId]);

// 操作のほうは、作り直さない
const actionsValue = useMemo(
  () => ({ select: setSelectedId, updateBody }),
  [updateBody],
);`}
        />

        <p>
          <code>useMemo</code> で包んでいるのは、Part 9 でやった
          <strong>原因 2 への対処</strong>です。
          包まなければ、分けた意味が半分になります。
        </p>
      </LessonSection>

      <LessonSection id="fixed" {...at(NOTEPAD, "const actionsValue")}>
        <h2>分けた版</h2>

        <DemoCard
          title="関心ごとに 3 つに分けた版"
          tone="good"
          sourcePath={NOTEPAD}
          description="同じように、本文に 1 文字打ってみる"
        >
          <Notepad />
        </DemoCard>

        <p>
          <strong>ヘッダーと配色ボタンが、光らなくなりました。</strong>
          この 2 つは配色の Context しか購読していないので、
          メモの中身が変わっても届きません。
        </p>

        <p>
          一覧は光ります。メモの配列そのものが変わっているからです
          （題名は変わらないので、見た目は同じままです）。
          ここまで止めたいなら、
          題名だけを別の Context に分けることになりますが、
          <strong>そこまでやる必要はまずありません</strong>。
        </p>

        <p>
          今度は<strong>配色を切り替えて</strong>みてください。
          <strong>ヘッダー・本文・配色ボタンが光り、一覧は光りません</strong>。
          一覧は配色を使っていないからです。
          <strong>使っている部品だけが動く</strong>状態になりました。
        </p>

        <Callout variant="point" title="道具を 3 つ使っている">
          <p>
            <strong>Context を分ける</strong>（購読の単位を細かくする）、
            <strong><code>useMemo</code> で value を包む</strong>
            （毎回作り直さない）、
            <strong><code>memo</code> で部品を包む</strong>
            （props が同じなら止める）。
          </p>
          <p>
            3 つとも「同じものかどうか」の判定を
            <strong>味方につけるための道具</strong>です。
            Part 0 でやった「見た目が同じでも別のもの」が、
            ここまで効いてきます。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="caution" {...at(NOTEPAD, "const ActionsContext")}>
        <h2>ただし、最初からこう書かない</h2>

        <p>
          ここまで読むと、
          Context を最初から細かく分けたくなるかもしれません。
          <strong>やめてください。</strong>
        </p>

        <ul>
          <li>Provider が増えて、入れ子が深くなる</li>
          <li>どの値がどの Context にあるのか、追いにくくなる</li>
          <li>
            <code>useMemo</code> と <code>useCallback</code> が増えて、
            読む量が倍になる
          </li>
        </ul>

        <p>
          <code>memo</code> の章で見た順番と同じです。
          <strong>まずそのまま書く。遅いと分かってから、分ける。</strong>
        </p>

        <Callout variant="note" title="今回はなぜ分けたのか">
          <p>
            この画面は部品が 4 つしかないので、
            <strong>実際には分けなくても困りません</strong>。
            分けたのは、描き直しの範囲が目で見えるようにするためです。
          </p>
          <p>
            部品が数十個になり、打つたびに全部が描き直される、
            という状況になってはじめて必要になります。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="quiz" {...at(BIG, "const Header = memo")}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="memo で包んだ部品が、Context の値が変わると描き直されるのはなぜ？"
          options={[
            {
              label: "memo が見比べるのは props だけで、Context の値は props ではないから",
              correct: true,
              explanation:
                "memo は「渡された props が前と同じか」しか見ません。Context から取ってきた値はその外側にあるので、比較の対象になりません。",
            },
            {
              label: "memo は Context と一緒に使えないから",
              explanation:
                "一緒には使えます。効く範囲が props に限られる、というだけです。",
            },
            {
              label: "Context の値が毎回新しく作られているから",
              explanation:
                "それも原因の 1 つですが、useMemo で包んで固定しても、購読している値そのものが変われば描き直されます。",
            },
          ]}
        />

        <Quiz
          question="「操作だけの Context」を分けると、何が嬉しい？"
          options={[
            {
              label: "更新するだけの部品が、値が変わっても描き直されなくなる",
              correct: true,
              explanation:
                "配色ボタンのように「押すだけで表示はしない」部品は珍しくありません。値のほうを購読しなければ、値がいくら変わっても影響を受けません。",
            },
            {
              label: "更新が速くなる",
              explanation:
                "更新そのものの速さは変わりません。変わるのは、1 回の更新で巻き込まれる部品の数です。",
            },
            {
              label: "useMemo を書かなくてよくなる",
              explanation:
                "むしろ必要です。操作をまとめたオブジェクトも、包まなければ毎回新しくなります。",
            },
          ]}
        />

        <Quiz
          question="この画面くらいの規模なら、本当は分ける必要がある？"
          options={[
            {
              label: "ない。まずそのまま書いて、遅いと分かってから分ける",
              correct: true,
              explanation:
                "部品が 4 つでは、全部描き直されても体感は変わりません。分けるほど Provider が増えて読みにくくなるので、memo の章と同じ順番で判断します。",
            },
            {
              label: "ある。Context を使うなら必ず分ける",
              explanation:
                "「必ず」はありません。分けるほど構造が複雑になるので、必要になってからで間に合います。",
            },
            {
              label: "ある。分けないと動かないから",
              explanation:
                "分けなくても動きます。分けていない版も、ちゃんと動いていました。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(NOTEPAD, "export function Notepad")}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            <code>memo</code> は props しか見ない。
            <strong>Context 経由の値は止められない</strong>
          </li>
          <li>
            Context は<strong>項目単位では購読できない</strong>。
            分けるしかない
          </li>
          <li>
            分ける基準は<strong>「一緒に変わるかどうか」</strong>
          </li>
          <li>
            <strong>操作だけの Context</strong> は、値が変わっても変化しない。
            更新専用の部品を守れる
          </li>
          <li>
            分けたら <code>useMemo</code> もセット。
            <strong>片方だけでは効かない</strong>
          </li>
          <li>
            そして、<strong>必要になるまで分けない</strong>
          </li>
        </ul>

        <Callout variant="note" title="この章で使った Part">
          <p>
            Part 0（同じものかどうかの判定）、Part 2（部品に分ける）、
            Part 7（描き直しは上から下へ）、
            Part 8（memo・useMemo・useCallback）、
            Part 9（Context・Context と再レンダリング）。
          </p>
        </Callout>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
