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
  { path: "lessons/notepad/demos/store.ts", label: "store.ts" },
  { path: "lessons/notepad/demos/notepad.tsx", label: "notepad.tsx" },
] as const;

const [TYPES, BIG, STORE, NOTEPAD] = SOURCES.map((source) => source.path);

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

      <LessonSection id="split" {...at(STORE, "export const useNotepadStore")}>
        <h2>実務では、ここでストアを使う</h2>

        <p>
          Context のままでも直せます。
          <Link href="/lessons/context-performance">Part 9「Context と再レンダリング」</Link>{" "}
          でやったとおり、
          <strong>関心ごとに Context を分け、<code>useMemo</code> で包み、
          <code>memo</code> で囲む</strong>。
        </p>

        <p>
          ただ、部品が 4 つでこの手数です。
          画面が育つほど Provider が増えて、入れ子が深くなっていきます。
          <strong>実務でこの規模になったら、たいていストアを使います。</strong>
        </p>

        <StaticCode
          lang="ts"
          code={`export const useNotepadStore = create((set) => ({
  titles: [...],
  bodies: { ... },
  selectedId: 1,
  palette: "plain",

  select: (id) => set({ selectedId: id }),
  setPalette: (palette) => set({ palette }),
  updateBody: (body) => set((state) => ({ ... })),
}));`}
        />

        <p>
          <strong>Provider は 1 つも出てきません。</strong>
          置き場所は 1 か所のままです。
          <Link href="/lessons/zustand">Zustand の章</Link>{" "}
          でやったとおり、絞るのは<strong>受け取る側</strong>だからです。
        </p>

        <h3>受け取る側で絞る</h3>

        <StaticCode
          lang="ts"
          code={`// ヘッダー … 配色しか読まない
const palette = useNotepadStore((state) => state.palette);

// 本文 … 選ばれている 1 件の本文だけ
const body = useNotepadStore(
  (state) => state.bodies[state.selectedId] ?? "",
);`}
        />

        <p>
          セレクタが返した値が<strong>前と同じかどうか</strong>で決まります。
          配色を読んでいない部品は、
          配色が変わっても<strong>そもそも呼ばれません</strong>。
        </p>

        <h3>ストアの形は、読む側に合わせて決める</h3>

        <p>
          ここで 1 つ、設計の判断が要ります。
          メモを<strong>そのまま 1 つの配列で持つ</strong>と、こうなります。
        </p>

        <StaticCode
          lang="ts"
          code={`// ✕ 本文を打つと、配列ごと作り直される
memos: [{ id: 1, title: "買い物", body: "牛乳とパン" }, ...]

updateBody: (body) => set((state) => ({
  memos: state.memos.map((m) => m.id === id ? { ...m, body } : m),
})),`}
        />

        <p>
          <code>map</code> は<strong>新しい配列を作ります</strong>。
          題名は 1 文字も変わっていないのに、
          <code>memos</code> は別のものになります。
          <strong>題名しか読んでいない一覧まで描き直されます。</strong>
        </p>

        <p>
          セレクタで頑張って絞ることもできますが、
          <strong>ストアの形を変えたほうが素直</strong>です。
        </p>

        <StaticCode
          lang="ts"
          code={`// ○ 変わらないものと、変わるものを分けて持つ
titles: [{ id: 1, title: "買い物" }, ...],   // 動かない
bodies: { 1: "牛乳とパン", 2: "..." },        // 打つたびに変わる

updateBody: (body) => set((state) => ({
  bodies: { ...state.bodies, [state.selectedId]: body },
})),`}
        />

        <p>
          一覧は <code>titles</code> だけを読みます。
          本文をいくら打っても <code>titles</code> は書き換わらないので、
          <strong>一覧はそもそも呼ばれません</strong>。
        </p>

        <Callout variant="point" title="どこを分けるかが変わっただけ">
          <p>
            Context のときは<strong>置き場所</strong>を分けました。
            ストアでは<strong>データの形</strong>を分けています。
          </p>
          <p>
            どちらも狙いは同じで、
            <strong>「一緒に変わらないものを、一緒にしない」</strong>です。
            Part 9 で Context を分ける基準として書いたことが、
            そのまま効いています。
          </p>
        </Callout>

        <Callout variant="note" title="どうしても組み立てて返したいとき">
          <p>
            セレクタの中で配列やオブジェクトを新しく作ると、
            中身が同じでも毎回「別のもの」になります
            （<Link href="/lessons/objects-and-references">Part 0</Link>{" "}
            のとおりです）。そのままでは描き直しが止まりません。
          </p>
          <p>
            それでも組み立てたいときのために、Zustand には{" "}
            <code>useShallow</code> という道具があります。
            <strong>1 段だけ中身を見比べて</strong>くれます。
          </p>
          <p>
            ただ、<strong>まずはストアの形で解けないかを考えるほうが、
            結果として簡単です。</strong>
            この画面も、題名と本文を分けるだけで済みました。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="fixed" {...at(NOTEPAD, "const palette = useNotepadStore")}>
        <h2>書き換えた版</h2>

        <DemoCard
          title="ストアとセレクタで書いた版"
          tone="good"
          sourcePath={NOTEPAD}
          description="同じように、本文に 1 文字打ってみる"
        >
          <Notepad />
        </DemoCard>

        <p>
          <strong>光るのは本文の箱だけになりました。</strong>
          ヘッダーも配色ボタンも、そして<strong>一覧も動きません</strong>。
        </p>

        <p>
          最初に「本文に打ったとき、ヘッダーと配色ボタンには関係がないはず」
          と書きました。実際にはそれ以上で、
          <strong>一覧まで止まっています</strong>。
          題名を持っている <code>titles</code> が
          書き換わっていないからです。
        </p>

        <p>
          今度は<strong>配色を切り替えて</strong>みてください。
          <strong>ヘッダー・本文・配色ボタンが光り、一覧は光りません</strong>。
          一覧は配色を読んでいないからです。
          <strong>読んでいる部品だけが動く</strong>状態になりました。
        </p>

        <p>
          上の ❌ 版と見比べてください。
          あちらは <code>memo</code> で 4 つとも包んでいたのに、全部光りました。
          こちらは <code>memo</code> を 1 つも使わずに、
          <strong>光る範囲がここまで狭まっています</strong>。
        </p>

        <Callout variant="point" title="判定しているものは、最後まで同じ">
          <p>
            <code>memo</code> も、<code>useMemo</code> も、
            Zustand のセレクタも、やっていることは 1 つです。
            <strong>前と同じものかどうかを見て、同じなら何もしない。</strong>
          </p>
          <p>
            Part 0 でやった「見た目が同じでも別のもの」が、
            ここまでずっと効いています。
            道具が変わっても、<strong>判定の中身は変わりません</strong>。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="caution" {...at(STORE, "titles: initialMemos")}>
        <h2>ただし、最初からストアに置かない</h2>

        <p>
          <Link href="/lessons/zustand">Zustand の章</Link>{" "}
          で書いたとおりです。
          <strong>まず <code>useState</code>。共有が必要になってから持ち上げる。
          それでも苦しくなってから、ストア。</strong>
        </p>

        <Callout variant="note" title="この画面も、本当は要らない">
          <p>
            部品が 4 つでは、全部描き直されても体感は変わりません。
            ストアにしたのは、
            <strong>描き直しの範囲が目で見えるようにするため</strong>です。
          </p>
          <p>
            移りどきは、
            <strong>深い場所から同じ値を読み書きしたくなって、
            props で配るのが苦しくなったとき</strong>です。
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
          question="題名と本文を別々に持つと、何が変わる？"
          options={[
            {
              label: "本文を打っても題名のほうは書き換わらないので、一覧が描き直されなくなる",
              correct: true,
              explanation:
                "1 つの配列にまとめていると、本文を直すだけで配列全体が新しくなります。読む側が題名しか要らないなら、持ち方のほうを分けるのがいちばん簡単です。",
            },
            {
              label: "保存する量が減って軽くなる",
              explanation:
                "持っているデータの量は変わりません。変わるのは、何が変わったときに何が動くかです。",
            },
            {
              label: "セレクタを書かなくてよくなる",
              explanation:
                "セレクタは必要です。形を整えるのは、セレクタを楽にするためです。",
            },
          ]}
        />

        <Quiz
          question="この画面くらいの規模なら、本当はストアに置く必要がある？"
          options={[
            {
              label: "ない。まず useState を持ち上げるだけで足りる",
              correct: true,
              explanation:
                "部品が 4 つでは、全部描き直されても体感は変わりません。ストアに置くほど「どこからでも書き換えられる値」が増えるので、必要になってから移します。",
            },
            {
              label: "ある。共有するなら必ずストアに置く",
              explanation:
                "「必ず」はありません。親に持ち上げて props で渡すだけで済むなら、そのほうが追いやすいコードになります。",
            },
            {
              label: "ある。ストアにしないと共有できないから",
              explanation:
                "共有そのものは props でも Context でもできます。ストアは、それが苦しくなったときの選択肢です。",
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
            置き場所ごと分けるしかない
          </li>
          <li>
            ストアなら<strong>置き場所は 1 つのまま</strong>、
            受け取る側のセレクタで絞る
          </li>
          <li>
            <strong>一緒に変わらないものは、一緒に持たない</strong>。
            題名と本文を分ければ、一覧は本文に反応しなくなる
          </li>
          <li>
            セレクタで止まるので、
            <strong><code>memo</code> も <code>useMemo</code> も要らない</strong>
          </li>
          <li>
            そして、<strong>共有が必要になるまでストアに置かない</strong>
          </li>
        </ul>

        <Callout variant="note" title="この章で使った Part">
          <p>
            Part 0（同じものかどうかの判定）、Part 2（部品に分ける）、
            Part 7（描き直しは上から下へ）、
            Part 8（memo・useMemo）、
            Part 9（Context・Context と再レンダリング・Zustand）。
          </p>
        </Callout>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
