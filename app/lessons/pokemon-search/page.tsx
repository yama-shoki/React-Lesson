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
import { NaiveSearch } from "./demos/naive-search";
import { PokemonSearch } from "./demos/pokemon-search";

const SLUG = "pokemon-search";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  {
    path: "lessons/pokemon-search/demos/naive-search.tsx",
    label: "naive-search.tsx",
  },
  {
    path: "lessons/pokemon-search/demos/pokemon-search.tsx",
    label: "pokemon-search.tsx",
  },
  { path: "lessons/pokemon-search/demos/types.ts", label: "types.ts" },
  {
    path: "lessons/pokemon-search/demos/pokemon-card.tsx",
    label: "pokemon-card.tsx",
  },
] as const;

const [NAIVE, SEARCH, TYPES, CARD] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          仕事で React を書くとき、
          <strong>ほぼ必ず外の API からデータを取ってきます</strong>。
          そして通信は、ここまでのどの話よりも
          <strong>思いどおりにならないもの</strong>です。
        </p>
        <p>
          時間がかかる。失敗する。順番が入れ替わる。
          <strong>この 3 つを、実物で 1 つずつ潰します。</strong>
        </p>
        <p>
          題材は<strong>ポケモンを日本語で検索する画面</strong>。
          本物の PokeAPI を使います。
        </p>
      </LessonHeader>

      <LessonSection id="naive" {...at(NAIVE, "fetch(`/api/pokemon?q=")}>
        <h2>まず、素直に書いてみる</h2>

        <p>
          Part 6 でやったとおり、<code>useEffect</code> の中で
          <code>fetch</code> する。それだけです。
        </p>

        <DemoCard
          title="打つたびに問い合わせる"
          tone="bad"
          sourcePath={NAIVE}
          showRenderCount
          description="「ピカチュウ」とゆっくり打って、回数を見る"
        >
          <NaiveSearch />
        </DemoCard>

        <p>
          <strong>動きます。</strong>
          ですが「ピカチュウ」と打つと、
          <strong>問い合わせが 5 回飛びます</strong>。
        </p>

        <p>実際に困るのは、次の 3 つです。</p>

        <ul>
          <li>
            <strong>むだが多い</strong> …{" "}
            途中の「ピ」「ピカ」の結果は誰も見ていません
          </li>
          <li>
            <strong>順番が入れ替わる</strong> …{" "}
            「ピ」の結果が「ピカチュウ」より遅れて届くと、
            <strong>古い結果で上書きされます</strong>
          </li>
          <li>
            <strong>失敗したときに何も起きない</strong> …{" "}
            通信が切れても、画面は前の結果のままです
          </li>
        </ul>

        <p>
          2 つめが厄介です。
          <strong>たまにしか起きず、再現できません。</strong>
          「たまに検索結果がおかしい」という報告になります。
        </p>
      </LessonSection>

      <LessonSection id="server" {...at(TYPES, "export type Pokemon")}>
        <h2>なぜ、いったん自分のサーバーを通すのか</h2>

        <p>
          このデモが叩いているのは PokeAPI ではなく、
          <strong>この教材自身の <code>/api/pokemon</code></strong> です。
          その中から PokeAPI を呼んでいます。
        </p>

        <p>遠回りに見えますが、実務ではこちらが普通です。</p>

        <Callout variant="point" title="サーバーを 1 枚挟む理由">
          <ul>
            <li>
              <strong>鍵を隠せる</strong> …{" "}
              API キーが要るサービスなら、ブラウザに置くと誰でも見られます。
              実務ではこれが最大の理由です
            </li>
            <li>
              <strong>形を整えられる</strong> …{" "}
              PokeAPI の返す JSON は項目が数百あります。
              <strong>要るものだけに削って渡します</strong>
            </li>
            <li>
              <strong>日本語で探せる</strong> …{" "}
              PokeAPI の一覧は英語名しか返しません。
              日本語で探すための対応表を、こちら側に持っています
            </li>
          </ul>
        </Callout>

        <p>
          そして画面側は、<strong>自分が決めた形だけを知っていれば済みます</strong>。
        </p>

        <StaticCode
          lang="ts"
          code={`export type Pokemon = {
  id: number;
  name: string;          // 日本語名
  imageUrl: string | null;
  types: string[];       // 日本語のタイプ名
  height: number;        // cm
  weight: number;        // kg
};`}
        />

        <p>
          向こうの都合で JSON の形が変わっても、
          <strong>直すのはサーバー側の 1 か所だけ</strong>です。
          画面の部品には手を触れずに済みます。
        </p>
      </LessonSection>

      <LessonSection id="debounce" {...at(SEARCH, "const [query] = useDebounce")}>
        <h2>1. 回数を減らす</h2>

        <StaticCode
          lang="ts"
          code={`const [query] = useDebounce(keyword.trim(), 400);`}
        />

        <p>
          Part 10 でやった debounce です。
          <strong>入力欄はすぐ反応し、問い合わせだけが遅れて追いつきます</strong>。
        </p>

        <p>
          そして見張る先を <code>keyword</code> ではなく{" "}
          <code>query</code> に変えます。
          <strong>変更はそれだけです。</strong>
        </p>
      </LessonSection>

      <LessonSection id="abort" {...at(SEARCH, "const controller = new AbortController();")}>
        <h2>2. 古い問い合わせを取り消す</h2>

        <p>
          debounce で回数は減りますが、
          <strong>順番の入れ替わりは消えません</strong>。
          間をあけて 2 回打てば、やはり 2 回飛びます。
        </p>

        <p>ここで Part 6 のクリーンアップが効いてきます。</p>

        <StaticCode
          lang="ts"
          code={`const controller = new AbortController();

fetch(url, { signal: controller.signal });

// 次の入力が来たら、走っている問い合わせを取り消す
return () => controller.abort();`}
        />

        <p>
          <code>AbortController</code> は
          <strong>あとから通信を取り消すためのリモコン</strong>です。
          <code>signal</code> を <code>fetch</code> に渡しておくと、
          <code>abort()</code> でその通信を打ち切れます。
        </p>

        <p>
          そして<strong>取り消しは effect の後片付けに書きます</strong>。
          <code>query</code> が変わるたびに、React が前回の後片付けを呼んでくれる。
          <strong>つまり、新しい問い合わせが始まる前に、古いほうが必ず止まります。</strong>
        </p>

        <Callout variant="warn" title="取り消しは「失敗」ではない">
          <StaticCode
            lang="ts"
            code={`if (error instanceof DOMException && error.name === "AbortError") return;`}
          />
          <p>
            取り消すと <code>fetch</code> は失敗として返ってきます。
            ですがこれは<strong>こちらが意図して止めたもの</strong>です。
          </p>
          <p>
            この 1 行が無いと、
            <strong>打つたびに「失敗しました」が出ます</strong>。
            自分で止めたぶんは、失敗として扱いません。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="status" {...at(SEARCH, "type Status =")}>
        <h2>3. 途中と失敗を、表示に出す</h2>

        <StaticCode
          lang="ts"
          code={`type Status = "idle" | "loading" | "done" | "error";`}
        />

        <p>
          Part 4 でやった形です。
          <strong>真偽値を並べず、1 つにまとめます。</strong>
          通信は<strong>必ず途中があり、必ず失敗しうる</strong>ので、
          ここが効きます。
        </p>

        <DemoCard
          title="日本語でポケモンを探す"
          tone="good"
          sourcePath={SEARCH}
          showRenderCount
          description="「ピ」「リザ」「ミュウ」などで探せます"
        >
          <PokemonSearch />
        </DemoCard>

        <p>試してみてください。</p>

        <ul>
          <li>
            打っている間は飛びません。
            <strong>手を止めて 400ms で探しにいきます</strong>
          </li>
          <li>探している間は「探しています…」が出ます</li>
          <li>
            見つからないときは、<strong>空欄ではなくその旨</strong>が出ます
          </li>
          <li>
            <strong>連打しても結果が入れ替わりません</strong>。
            古いほうは取り消されているからです
          </li>
        </ul>

        <Callout variant="point" title="2 つの数字を見比べる">
          <p>
            最初の版と同じ言葉を、同じ速さで打ってみてください。
            <strong>問い合わせた回数</strong>が、
            はっきり少なくなっているはずです。
            「ピカチュウ」と打てば、最初の版は 5 回前後、
            こちらは<strong>1 回</strong>です。
          </p>
          <p>
            カード右上の <strong>render</strong> の数字は、
            どちらもそれなりに増えます。
            <strong>描き直しは減らしていない</strong>からです。
            減らしたのは通信のほうだけで、そこが debounce の役割です。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="card" {...at(CARD, "export function PokemonCard")}>
        <h3>見た目の部品は、通信を知らない</h3>

        <p>
          1 匹ぶんを描く <code>PokemonCard</code> が受け取るのは、
          <strong><code>Pokemon</code> 1 件だけ</strong>です。
        </p>

        <p>
          <code>fetch</code> も <code>AbortController</code> も{" "}
          <code>Status</code> も出てきません。
          TODO の章の <code>TodoItem</code> とまったく同じ形です。
        </p>

        <Callout variant="point" title="通信を持つ場所は、1 か所にまとめる">
          <p>
            <strong>取ってくる係</strong>と<strong>見せる係</strong>を分けます。
          </p>
          <p>
            こうしておくと、あとで SWR に置き換えるときも、
            <strong>直すのは取ってくる係だけ</strong>で済みます。
            カードには手を触れません。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="swr" {...at(SEARCH, "const search = async ()")}>
        <h3>ここまで書いて、はじめて SWR の意味が分かる</h3>

        <p>
          この章で自分で書いたのは、次の 4 つです。
        </p>

        <ul>
          <li>読み込み中かどうかの管理</li>
          <li>失敗したときの扱い</li>
          <li>古い問い合わせの取り消し</li>
          <li>問い合わせの間引き</li>
        </ul>

        <p>
          Part 9 の SWR は、
          <strong>このうち上の 3 つを最初から持っています</strong>。
          「1 行で state 3 つぶん」と書いたのは、こういうことでした。
        </p>

        <p>
          <strong>間引きだけは、SWR にもありません。</strong>
          打つたびに呼ぶかどうかは使う側の判断なので、
          そこは自分で <code>useDebounce</code> を足します
          （この章のデモもそうしています）。
        </p>

        <p>
          <strong>先に自分で書いたからこそ、何を肩代わりしてもらっているのかが分かります。</strong>
          道具から入ると、ここが分からないまま使うことになります。
        </p>
      </LessonSection>

      <LessonSection id="quiz" {...at(SEARCH, "return () => controller.abort();")}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="debounce を入れても、順番の入れ替わりが残るのはなぜ？"
          options={[
            {
              label: "回数が減るだけで、飛んだ問い合わせの順序は保証されないから",
              correct: true,
              explanation:
                "間をあけて 2 回打てば 2 回飛びます。先に出したほうが後に届くことは、依然として起こります。",
            },
            {
              label: "debounce の待ち時間が短すぎるから",
              explanation:
                "長くしても起きます。回数を減らすことと、順番を守ることは別の問題です。",
            },
            {
              label: "React が並び替えているから",
              explanation:
                "React は関係ありません。ネットワークの都合です。",
            },
          ]}
        />

        <Quiz
          question="controller.abort() を effect の後片付けに書くのはなぜ？"
          options={[
            {
              label: "新しい問い合わせが始まる前に、React が必ず呼んでくれるから",
              correct: true,
              explanation:
                "依存が変わるたびに前回の後片付けが走ります。だから古いほうが必ず先に止まります。",
            },
            {
              label: "後片付けに書かないとエラーになるから",
              explanation:
                "エラーにはなりません。ただし古い問い合わせが生き残ります。",
            },
            {
              label: "abort() は後片付けからしか呼べないから",
              explanation:
                "どこからでも呼べます。タイミングが重要なだけです。",
            },
          ]}
        />

        <Quiz
          question="ブラウザから直接 PokeAPI を叩かず、自分のサーバーを通す理由として最も重要なのは？"
          options={[
            {
              label: "API キーをブラウザに出さずに済むから",
              correct: true,
              explanation:
                "ブラウザに置いたものは誰でも見られます。この教材では PokeAPI に鍵が要りませんが、実務ではこれが主な理由になります。",
            },
            {
              label: "そのほうが通信が速いから",
              explanation:
                "1 枚挟むぶん、むしろ遅くなります。速さのためではありません。",
            },
            {
              label: "ブラウザからは外部 API を叩けないから",
              explanation:
                "叩けます。相手が許可していれば直接でも動きます。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(SEARCH, "const [query] = useDebounce")}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            通信は<strong>時間がかかり、失敗し、順番が入れ替わる</strong>。
            3 つとも別々に手当てが要る
          </li>
          <li>
            <strong>debounce</strong> で回数を減らす。
            ただし順番の保証にはならない
          </li>
          <li>
            <strong>AbortController</strong> で古い問い合わせを取り消す。
            置き場所は<strong>effect の後片付け</strong>
          </li>
          <li>
            取り消しは失敗ではない。
            <strong>AbortError は無視する</strong>
          </li>
          <li>
            状態は<strong>union で 1 つ</strong>にまとめる
          </li>
          <li>
            外の API は<strong>自分のサーバーで受けて、自分の型に整える</strong>
          </li>
          <li>
            <strong>取ってくる係と見せる係を分ける</strong>
          </li>
        </ul>

				<Callout variant="note" title="この章で使った Part">
					<p>
						Part 0（async / await・型）、Part 4（union で状態をまとめる）、
						Part 6（useEffect・クリーンアップ・競合状態）、
						Part 9（サーバーのデータ）、Part 10（入力を間引く）。
					</p>
					<p>
						ここで手で書いたものが、Part 9 の SWR が
						<strong>肩代わりしていた中身</strong>です。
						先に書いてみたので、何を任せているのかが分かります。
					</p>
				</Callout>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
