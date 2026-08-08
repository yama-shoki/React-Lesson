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
import { MutateArray } from "./demos/mutate-array";
import { NewArray } from "./demos/new-array";

const SLUG = "immutable-state";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/immutable-state/demos/mutate-array.tsx", label: "mutate-array.tsx" },
  { path: "lessons/immutable-state/demos/new-array.tsx", label: "new-array.tsx" },
] as const;

const [MUTATE, NEW] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          Part 0-1 で、こう書きました。
        </p>
        <p>
          「<strong>const なのに中身が変わる</strong>のは、React
          で最もよく起きるバグの原因のひとつ」。
        </p>
        <p>
          その回収をします。state
          がオブジェクトや配列のとき、
          <strong>中身を書き換えても画面は変わりません</strong>。
        </p>
      </LessonHeader>

      <LessonSection id="mutate" {...at(MUTATE, "items.push")}>
        <h2>push しても画面が変わらない</h2>

        <p>
          配列に要素を足すなら <code>push</code>。
          そのあと <code>setItems</code> も呼んでいます。
          動きそうに見えますが、押してみてください。
        </p>

        <DemoCard
          title="push してから setItems する"
          tone="bad"
          sourcePath={MUTATE}
          showRenderCount
          description="何度押しても表示は変わらない"
        >
          <MutateArray />
        </DemoCard>

        <p>
          変わりません。ただし
          <strong>配列の中身は実際に増えています</strong>（コンソールに出ています）。
        </p>

        <Callout variant="point" title="カードが光らない">
          <p>
            押しても<strong>カードは光らず、render の数字も増えません</strong>。
            <code>setItems</code> を呼んでいるのに、です。
          </p>
          <p>
            つまり React は、<strong>変化があったとすら思っていません</strong>。
            なぜそうなるのかを、次の節で見ます。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="why" {...at(MUTATE, "setItems(items)")}>
        <h2>React は「同じものか」だけを見る</h2>

        <p>
          React は <code>setItems</code>{" "}
          を受け取ったとき、新しい値と前の値を比べます。
          このとき<strong>中身を 1 つずつ見比べたりはしません</strong>。
          <strong>同じものかどうか</strong>だけを見ます。
        </p>

        <p>
          <code>push</code> は、配列そのものを別のものに置き換えません。
          <strong>同じ配列の中身が増えるだけ</strong>です。
          Part 0-1 の言い方をすれば、
          箱の中身を変えただけで、箱は同じもののままです。
        </p>

        <p>
          だから React から見ると「前と同じものが渡ってきた」ことになり、
          <strong>描き直す必要なし</strong>と判断されます。
        </p>

        <Callout variant="point" title="なぜ中身まで見ないのか">
          <p>
            毎回すべての中身を見比べていたら、
            要素が 1000 件あるリストでは 1000 回の比較が必要になります。
            state が変わるたびにそれをやると、確実に遅くなります。
          </p>
          <p>
            「同じものか」の判定は一瞬で終わります。
            <strong>速さのために、React はこの判定を選んでいます。</strong>
            その代わり、私たちは<strong>新しく作って渡す</strong>必要があります。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="new" {...at(NEW, "setItems((current) => [...current")}>
        <h2>新しく作って渡す</h2>

        <p>
          Part 0-4 でやったスプレッド構文の出番です。
          元の配列は触らず、<strong>中身を展開した新しい配列</strong>を作ります。
        </p>

        <StaticCode
          lang="ts"
          code={`// ✕ 同じ配列のまま
items.push("みかん");
setItems(items);

// ○ 新しい配列を作って渡す
setItems([...items, "みかん"]);`}
        />

        <DemoCard
          title="新しい配列を渡す"
          tone="good"
          sourcePath={NEW}
          showRenderCount
          description="追加も削除も反映される"
        >
          <NewArray />
        </DemoCard>

        <p>
          これで React は「別のものが来た」と判断し、描き直します。
        </p>
      </LessonSection>

      <LessonSection id="patterns" {...at(NEW, "current.slice(0, -1)")}>
        <h2>よく使う書き換え方</h2>

        <p>
          配列を扱うメソッドには、
          <strong>元を変えるもの</strong>と<strong>新しく返すもの</strong>があります。
          React で使うのは後者です。
        </p>

        <StaticCode
          lang="ts"
          code={`// 使わない（元の配列を変えてしまう）
push  pop  shift  unshift  splice  sort  reverse

// 使う（新しい配列を返す）
map  filter  slice  concat  スプレッド構文`}
        />

        <p>操作ごとの定番はこうなります。</p>

        <StaticCode
          lang="ts"
          code={`// 末尾に足す
setItems([...items, newItem]);

// 先頭に足す
setItems([newItem, ...items]);

// 条件に合うものを消す
setItems(items.filter((item) => item.id !== targetId));

// 特定のものだけ書き換える
setItems(
  items.map((item) =>
    item.id === targetId ? { ...item, done: true } : item
  )
);`}
        />

        <p>
          最後の例では、配列だけでなく
          <strong>中のオブジェクトも新しく作っている</strong>点に注目してください。
          <code>{"{ ...item, done: true }"}</code>{" "}
          がそれです。書き換えたいものは、すべて新しく作ります。
        </p>

        <h3>オブジェクトも同じ</h3>

        <StaticCode
          lang="ts"
          code={`// ✕ 中身を書き換えても、同じオブジェクトのまま
user.name = "すずき";
setUser(user);

// ○ 新しいオブジェクトを作る
setUser({ ...user, name: "すずき" });`}
        />

        <Callout variant="warn" title="入れ子になっている場合">
          <p>
            <code>{"{ ...user }"}</code>{" "}
            がコピーするのは<strong>1 段目だけ</strong>です。
            中にオブジェクトが入っている場合、
            そこは元と同じものが共有されたままになります。
          </p>
          <p>
            深い場所を変えるときは、
            <strong>その道筋にあるものを順に新しく作る</strong>必要があります。
          </p>
        </Callout>

        <StaticCode
          lang="ts"
          code={`// user.address.city を変えたい場合
setUser({
  ...user,
  address: { ...user.address, city: "大阪" },
});`}
        />

        <p>
          入れ子が深くなると、この書き方はつらくなります。
          そうなったら<strong>state の形そのものを見直す</strong>のが先です。
          深い入れ子は、たいてい state の設計に無理がある合図です。
        </p>
      </LessonSection>

      <LessonSection id="quiz" {...at(NEW)}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="items.push(x) のあとに setItems(items) しても画面が変わらないのはなぜ？"
          options={[
            {
              label: "配列そのものは同じもののままなので、React が変化なしと判断するから",
              correct: true,
              explanation:
                "React は中身を見比べず、同じものかどうかだけを見ます。push は中身を変えるだけで、配列自体は置き換わりません。",
            },
            {
              label: "push が失敗しているから",
              explanation:
                "push 自体は成功しています。中身は増えていて、コンソールで確認できます。",
            },
            {
              label: "setItems を 2 回呼ぶ必要があるから",
              explanation:
                "回数の問題ではありません。何度呼んでも、同じものを渡している限り変わりません。",
            },
          ]}
        />

        <Quiz
          question="配列から id が 3 の要素を消したい。正しいのは？"
          options={[
            {
              label: "setItems(items.filter((item) => item.id !== 3))",
              correct: true,
              explanation:
                "filter は条件に合うものだけを集めた新しい配列を返します。元の配列は変わりません。",
            },
            {
              label: "items.splice(index, 1) してから setItems(items)",
              explanation:
                "splice は元の配列を変えてしまいます。配列自体は同じものなので、画面は変わりません。",
            },
            {
              label: "delete items[index] してから setItems(items)",
              explanation:
                "同じく元の配列を変える操作です。加えて要素が空いた穴として残るため、配列では使いません。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(NEW)}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            React は<strong>同じものかどうか</strong>だけを見る。中身は見比べない
          </li>
          <li>
            <code>push</code> などは中身を変えるだけなので、
            <strong>変化として伝わらない</strong>
          </li>
          <li>
            書き換えたいときは<strong>新しく作って渡す</strong>
          </li>
          <li>
            使うのは <code>map</code> / <code>filter</code> /{" "}
            <code>slice</code> / スプレッド構文
          </li>
          <li>
            スプレッドのコピーは 1 段目だけ。
            <strong>入れ子が深くなったら state の形を見直す</strong>
          </li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
