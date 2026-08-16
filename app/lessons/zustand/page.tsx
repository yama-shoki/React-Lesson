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
import { Selector } from "./demos/selector";
import { WholeStore } from "./demos/whole-store";

const SLUG = "zustand";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/zustand/demos/store.ts", label: "store.ts" },
  { path: "lessons/zustand/demos/whole-store.tsx", label: "whole-store.tsx" },
  { path: "lessons/zustand/demos/selector.tsx", label: "selector.tsx" },
] as const;

const [STORE, WHOLE, SELECTOR] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          前の章で、Context には
          <strong>2 つの弱点</strong>があると分かりました。
          項目単位で購読できないこと、
          <code>value</code> を毎回作り直してしまうこと。
        </p>
        <p>
          対処はしましたが、
          <strong>Context を分け、<code>useMemo</code> で包み、
          <code>memo</code> で囲む</strong>という手数が要りました。
        </p>
        <p>
          <strong>実務では、ここで外部のストアを使うことが多い</strong>です。
          よく使われている <strong>Zustand</strong> を見ます。
        </p>
      </LessonHeader>

      <LessonSection id="store" {...at(STORE, "export const useCounterStore")}>
        <h2>ストアは、コンポーネントの外に置く</h2>

        <StaticCode
          lang="ts"
          code={`import { create } from "zustand";

export const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  name: "さとう",

  increase: () => set((state) => ({ count: state.count + 1 })),
}));`}
        />

        <p>
          いちばん大きな違いは、<strong>Provider が要らない</strong>ことです。
          ファイルの外側に作って、使いたいところで呼ぶだけです。
        </p>

        <p>
          値と<strong>更新のしかたを同じ場所に置く</strong>のも特徴です。
          <code>increase</code> は「1 増やす」という
          <strong>出来事の名前</strong>になっています。
          <Link href="/lessons/usereducer">useReducer</Link>{" "}
          でやった「何が起きたかを伝える」と、考え方はそのままです。
        </p>

        <Callout variant="note" title="set の中身は useState と同じ">
          <p>
            <code>set((state) =&gt; ({"{ count: state.count + 1 }"}))</code>{" "}
            は、関数を渡す形の更新そのものです。
            <strong>元を書き換えず、新しい値を返す</strong>という決まりも同じです。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="whole" {...at(WHOLE, "const store = useCounterStore()")}>
        <h2>そのまま呼ぶと、Context と同じことが起きる</h2>

        <p>
          まず、<strong>引数なしで呼んでみます</strong>。
          ストア全体が返ってきます。
        </p>

        <StaticCode lang="ts" code={`const store = useCounterStore();`} />

        <DemoCard
          title="ストア全体を受け取る"
          tone="bad"
          sourcePath={WHOLE}
          description="count を押して、下の 2 つを見る"
        >
          <WholeStore />
        </DemoCard>

        <p>
          <strong>両方とも光ります。</strong>
          前の章で見た「巨大な Context」とまったく同じです。
          <strong>ライブラリを入れただけでは、何も解決しません。</strong>
        </p>

        <Callout variant="note" title="このページにストアが 2 つある理由">
          <p>
            右のコードには、中身の同じストアが 2 つ並んでいます。
            <strong>ふだんは 1 つで足ります。</strong>
            この章では、上のデモと下のデモを
            別々に動かして見比べたいので分けてあります。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="selector" {...at(SELECTOR, "(state) => state.count")}>
        <h2>欲しいものだけを取り出す</h2>

        <p>
          Zustand の本体はここです。
          <strong>関数を渡して、必要な部分だけを取り出します</strong>。
        </p>

        <StaticCode
          lang="ts"
          code={`// ✕ 全部もらう。何が変わっても描き直される
const store = useSelectorStore();

// ○ count だけもらう。count が変わったときだけ描き直される
const count = useSelectorStore((state) => state.count);`}
        />

        <p>
          この関数を<strong>セレクタ</strong>と呼びます。
          Zustand は、セレクタが返した値が
          <strong>前と同じかどうか</strong>を見て、
          違うときだけその部品を描き直します。
        </p>

        <DemoCard
          title="セレクタで絞る"
          tone="good"
          sourcePath={SELECTOR}
          description="同じように count を押してみる"
        >
          <Selector />
        </DemoCard>

        <p>
          <strong>count の箱だけが光ります。</strong>
          <code>name</code> の箱は動きません。
          そして<strong>押すだけの部品も動きません</strong>。
          値を 1 つも読んでいないからです。
        </p>

        <Callout variant="point" title="Context でやったことが、1 行に収まった">
          <p>
            前の章では、これを実現するために
            <strong>Context を 3 つに分け、<code>useMemo</code> で包み、
            <code>memo</code> で囲みました</strong>。
          </p>
          <p>
            Zustand では
            <strong>セレクタを書くだけ</strong>です。
            置き場所を分ける必要も、Provider を重ねる必要もありません。
            <strong>実務でよく使われる理由は、ほぼこれ 1 点</strong>です。
          </p>
        </Callout>

        <h3>更新だけ取り出す</h3>

        <StaticCode
          lang="ts"
          code={`const increase = useSelectorStore((state) => state.increase);`}
        />

        <p>
          関数はストアが作り直さないので、
          <strong>この部品はストアの変化では描き直されません</strong>。
          前の章の「操作だけの Context」と同じことが、
          セレクタ 1 行でできています。
        </p>
        <p>
          ただし Part 7 でやったとおり、
          <strong>親が描き直されれば子も描き直されます</strong>。
          ストアからの変化が届かなくなるだけで、
          上から来る描き直しは別の話です。
        </p>
      </LessonSection>

      <LessonSection id="more" {...at(STORE, "increase:")}>
        <h2>あと 3 つだけ、知っておくと足りる</h2>

        <h3>1. いまの値を読みたいとき（get）</h3>

        <p>
          <code>set</code> と一緒に <code>get</code> も受け取れます。
          <strong>更新ではなく、いまの値を読みたいだけ</strong>のときに使います。
        </p>

        <StaticCode
          lang="ts"
          code={`create((set, get) => ({
  items: [],
  // いまの件数を読んでから、判断したい
  addIfRoom: (item) => {
    if (get().items.length >= 10) return;
    set((state) => ({ items: [...state.items, item] }));
  },
}));`}
        />

        <p>
          <code>set((state) =&gt; ...)</code> でも今の値は読めます。
          <strong><code>get()</code> が要るのは、
          更新の外で値を見たいとき</strong>です。
          上の例のように「条件に合わなければ何もしない」と書ける。
        </p>

        <h3>2. 通信もストアに置ける</h3>

        <StaticCode
          lang="ts"
          code={`create((set, get) => ({
  status: "editing",

  send: async () => {
    set({ status: "sending" });
    try {
      await fetch("/api/...", { body: JSON.stringify(get().form) });
      set({ status: "done" });
    } catch {
      set({ status: "error" });
    }
  },
}));`}
        />

        <p>
          ストアの関数は<strong>ただの関数</strong>なので、
          <code>async</code> にして構いません。
          画面側は <code>send()</code> を呼ぶだけになり、
          <strong>成功・失敗の判断はストアが持ちます</strong>。
        </p>

        <Callout variant="note" title="サーバーのデータは別の話">
          <p>
            ここで言う通信は<strong>「送る」</strong>ほうです。
            <strong>取ってくる</strong>ほうは、
            <Link href="/lessons/server-state">SWR</Link>{" "}
            の担当のままです。
            取ってきたデータをストアに写すと、
            Part 9 でやった<strong>二重管理</strong>になります。
          </p>
        </Callout>

        <h3>3. 閉じても残したいとき（persist）</h3>

        <StaticCode
          lang="ts"
          code={`import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set) => ({ theme: "light", setTheme: (t) => set({ theme: t }) }),
    { name: "app-theme" },   // localStorage のキー
  ),
);`}
        />

        <p>
          <code>persist</code> で包むと、
          <strong>中身がブラウザに保存されます</strong>。
          <Link href="/lessons/browser-storage">ブラウザに保存する</Link>{" "}
          でやったことを、ストア全体に対してやるものです。
        </p>

        <Callout variant="warn" title="保存すると、ちらつきが出る">
          <p>
            サーバーで組み立てた HTML には、保存された値がまだ入っていません。
            ブラウザで読み込んだあとに切り替わるので、
            <strong>一瞬だけ初期値が見えます</strong>。
          </p>
          <p>
            Part 9 の localStorage の章でやった話と同じです。
            <strong>保存すると必ずこれが付いてきます。</strong>
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="pitfall" {...at(STORE, "export const useCounterStore")}>
        <h2>ストアは、画面を離れても消えない</h2>

        <p>
          ストアはコンポーネントの外にあります。
          つまり<strong>その画面から離れても、中身はそのまま残ります</strong>。
        </p>

        <p>
          <code>useState</code> なら、画面から消えた時点で初期化されていました。
          ストアは初期化されません。
        </p>

        <ul>
          <li>
            <strong>利点</strong> …{" "}
            入力の続きができる。別の画面から戻っても状態が保たれる
          </li>
          <li>
            <strong>困る点</strong> …{" "}
            前回の入力が残ったままフォームが開く、
            ログアウトしたのに前の人のデータが見えている
          </li>
        </ul>

        <p>
          <strong>「消したいときは、自分で消す」</strong>と覚えてください。
          初期状態に戻す関数をストアに用意しておくのが定番です。
        </p>

        <StaticCode
          lang="ts"
          code={`const initial = { step: "account", form: null };

create((set) => ({
  ...initial,
  reset: () => set(initial),
}));`}
        />
      </LessonSection>

      <LessonSection id="when" {...at(STORE, "count: 0")}>
        <h2>Context とどう使い分けるか</h2>

        <p>
          Zustand があれば Context が要らなくなる、
          <strong>わけではありません</strong>。
        </p>

        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left font-semibold">向いているもの</th>
                <th className="p-3 text-left font-semibold">道具</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="p-3">
                  ほとんど変わらない値（テーマ、ログイン中の人、言語）
                </td>
                <td className="p-3 font-medium text-foreground">Context</td>
              </tr>
              <tr className="border-b">
                <td className="p-3">
                  同じ形の画面を、別々の中身で何個も出す
                </td>
                <td className="p-3 font-medium text-foreground">Context</td>
              </tr>
              <tr className="border-b">
                <td className="p-3">
                  よく変わる値を、離れた部品どうしで共有する
                </td>
                <td className="p-3 font-medium text-foreground">Zustand</td>
              </tr>
              <tr>
                <td className="p-3">
                  サーバーから取ってきたデータ
                </td>
                <td className="p-3 font-medium text-foreground">
                  どちらでもない（
                  <Link href="/lessons/server-state">SWR</Link> の担当）
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          <strong>1 つのストアが持つ中身は、アプリの中で 1 組だけ</strong>です
          （<code>create()</code> を 2 回呼べばストアは 2 つ作れますが、
          それぞれの中身は 1 組ずつです）。
        </p>
        <p>
          だから「同じ画面を 2 つ並べて、それぞれ別の状態を持たせたい」
          という使い方には向きません。
          Provider を置いた範囲ごとに別々になる Context のほうが向いています。
        </p>

        <Callout variant="warn" title="それでも、まず useState から">
          <p>
            <Link href="/lessons/where-to-put-state">状態の置き場所を選ぶ</Link>{" "}
            で書いたことは変わりません。
            <strong>共有する必要が出てから、ストアに移します。</strong>
          </p>
          <p>
            最初からストアに置くと、
            <strong>どこからでも書き換えられる値</strong>が増えていきます。
            そうなると、値が変わった理由を追うのが難しくなります。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="quiz" {...at(SELECTOR, "const count = useSelectorStore")}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="Zustand を入れれば、無駄な描き直しは自動でなくなる？"
          options={[
            {
              label: "ならない。セレクタで絞って初めて効く",
              correct: true,
              explanation:
                "引数なしで呼ぶとストア全体を購読するので、Context にまとめたときと同じことが起きます。効かせているのはライブラリではなく、セレクタです。",
            },
            {
              label: "なる。ライブラリが賢く判断してくれる",
              explanation:
                "何を使っているかは、こちらが渡した関数からしか分かりません。全部もらえば、全部の変化に反応します。",
            },
            {
              label: "なる。Provider が無いので描き直しが起きない",
              explanation:
                "Provider の有無と描き直しは別の話です。値を購読していれば、変わったときに描き直されます。",
            },
          ]}
        />

        <Quiz
          question="「押すだけで表示はしない」ボタンが、何をしても描き直されないのはなぜ？"
          options={[
            {
              label: "更新用の関数だけを取り出していて、値を 1 つも読んでいないから",
              correct: true,
              explanation:
                "関数はストアが作り直さないので、セレクタの返す値がずっと同じままです。だから購読していても変化が起きません。",
            },
            {
              label: "ボタンは描き直しの対象外だから",
              explanation:
                "ボタンも普通のコンポーネントです。対象外という仕組みはありません。",
            },
            {
              label: "memo で包まれているから",
              explanation:
                "このデモでは memo を使っていません。セレクタだけで止まっています。",
            },
          ]}
        />

        <Quiz
          question="ログイン中のユーザー情報は、Zustand と Context のどちらが向いている？"
          options={[
            {
              label: "Context。ほとんど変わらない値だから",
              correct: true,
              explanation:
                "Context の弱点は「よく変わる値だと巻き込む範囲が広い」ことでした。ほとんど変わらない値なら、その弱点が出ません。Provider で配る形のほうが素直です。",
            },
            {
              label: "Zustand。アプリ全体で使う値だから",
              explanation:
                "全体で使うかどうかではなく、どれくらいの頻度で変わるかで選びます。",
            },
            {
              label: "どちらでもよい。同じもの",
              explanation:
                "1 つのストアの中身はアプリに 1 組、Context は Provider を置いた範囲ごとに別々です。同じ画面を 2 つ並べて別々の状態にしたいときに差が出ます。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(STORE, "increase:")}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            ストアは<strong>コンポーネントの外</strong>に置く。Provider は要らない
          </li>
          <li>
            値と<strong>更新のしかたを一緒に</strong>置く。
            名前は「何が起きたか」で付ける
          </li>
          <li>
            <strong>セレクタで絞って初めて</strong>、描き直しが減る。
            入れただけでは何も変わらない
          </li>
          <li>
            更新用の関数だけ取り出した部品は、<strong>一度も描き直されない</strong>
          </li>
          <li>
            <strong>ほとんど変わらない値は Context</strong>、
            よく変わる共有値は Zustand
          </li>
          <li>
            そして<strong>共有が必要になるまでは useState</strong>
          </li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
