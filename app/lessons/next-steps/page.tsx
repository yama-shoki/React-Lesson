import { Callout } from "@/components/lesson/callout";
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

const SLUG = "next-steps";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/todo-app/demos/todo-app.tsx", label: "todo-app.tsx" },
  {
    path: "lessons/pokemon-search/demos/pokemon-search.tsx",
    label: "pokemon-search.tsx",
  },
] as const;

const [TODO, SEARCH] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>おつかれさまでした。ここまでで一通りです。</p>
        <p>
          最後に、<strong>これから何をすればいいか</strong>と、
          <strong>詰まったときにどうするか</strong>を書いておきます。
        </p>
      </LessonHeader>

      <LessonSection id="core" {...at(TODO, "const toggle = (id: number)")}>
        <h2>結局、覚えることは少ない</h2>

        <p>
          59 章ありましたが、<strong>芯は 5 つだけ</strong>です。
          これだけ持って帰れば足ります。
        </p>

        <ol>
          <li>
            <strong>画面は状態から決まる</strong>。
            画面を書き換えるのではなく、状態を書き換える
          </li>
          <li>
            <strong>state は最小限に、使う場所のいちばん近くへ</strong>。
            計算できるものは持たない
          </li>
          <li>
            <strong>元のものを書き換えず、新しく作る</strong>。
            画面が変わらないときは、まずここを疑う
          </li>
          <li>
            <strong>値は下へ、知らせは上へ</strong>。
            子は「起きたこと」を伝えるだけ
          </li>
          <li>
            <strong>持ち主が自分でないデータは、state にしない</strong>。
            サーバーのものは取り直せる写しとして扱う
          </li>
        </ol>

        <p>
          残りは全部、この 5 つの言い換えか、
          <strong>この 5 つを守ったうえで速くするための道具</strong>でした。
        </p>
      </LessonSection>

      <LessonSection id="build" {...at(SEARCH, "const [query] = useDebounce")}>
        <h2>次に作るもの</h2>

        <p>
          <strong>読むのはここまでにして、作ってください。</strong>
          手を動かさないと、この 5 つは身につきません。
        </p>

        <p>
          いきなり大きなものを作らないでください。
          <strong>Part 11 で作ったものを、自分の題材で作り直す</strong>のが
          いちばん早いです。
        </p>

        <ul>
          <li>
            <Link href="/lessons/todo-app">TODO リスト</Link> …{" "}
            作る・変える・消すの基本形
          </li>
          <li>
            <Link href="/lessons/shopping-list">買い物リスト</Link> …{" "}
            値ごとの置き場所
          </li>
          <li>
            <Link href="/lessons/pokemon-search">API を使う画面</Link> …{" "}
            取ってくる側
          </li>
          <li>
            <Link href="/lessons/multi-step-form">申込フォーム</Link> …{" "}
            送る側と、複雑な state
          </li>
          <li>
            <Link href="/lessons/notepad">メモ帳</Link> …{" "}
            離れた部品での共有
          </li>
        </ul>

        <ul>
          <li>
            <strong>CRUD のあるもの</strong> …{" "}
            買い物メモ、読んだ本の記録、練習メニュー。
            なんでも構いませんが、<strong>自分が本当に使うもの</strong>にしてください
          </li>
          <li>
            <strong>API を叩くもの</strong> …{" "}
            好きなサービスの公開 API を 1 つ選んで、検索できる画面を作る
          </li>
        </ul>

        <Callout variant="point" title="作り終えたら、この 6 つを確かめる">
          <ol>
            <li>型を先に決めたか（<code>string</code> で済ませていないか）</li>
            <li>
              計算で求まるものを <code>useState</code> に入れていないか
            </li>
            <li>
              配列やオブジェクトを、書き換えずに新しく作っているか
            </li>
            <li>リストの <code>key</code> は id か（index になっていないか）</li>
            <li>
              通信するなら、<strong>読み込み中・失敗</strong>の表示があるか
            </li>
            <li>後片付けの要るものに、後片付けを書いたか</li>
          </ol>
        </Callout>

        <Callout variant="point" title="詰まったら、まずこの順で疑う">
          <ol>
            <li>
              <strong>コンソールを開く</strong>。
              React はたいてい何か言っています
            </li>
            <li>
              <strong>元のものを書き換えていないか</strong>。
              画面が変わらないなら、ほぼこれです
            </li>
            <li>
              <strong>その state は本当に必要か</strong>。
              計算で求まるものを持っていないか
            </li>
            <li>
              <strong>lint の赤線を消していないか</strong>。
              消したくなったら、たいてい設計のほうがおかしい
            </li>
          </ol>
        </Callout>
      </LessonSection>

      <LessonSection id="not-covered" {...at(TODO, "export function TodoApp")}>
        <h2>この教材で扱わなかったこと</h2>

        <p>
          仕事で必要になるが、ここでは触れていないものを挙げておきます。
          <strong>いま覚える必要はありません。</strong>
          必要になってから、その順で調べてください。
        </p>

        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left font-semibold">分野</th>
                <th className="p-3 text-left font-semibold">
                  必要になる場面
                </th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="p-3 font-medium text-foreground">
                  ページの切り替え
                </td>
                <td className="p-3">
                  画面が複数になったとき。Next.js ならファイルを置くだけ
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium text-foreground">
                  テスト
                </td>
                <td className="p-3">
                  直すたびに他が壊れるようになったとき
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium text-foreground">
                  エラー境界
                </td>
                <td className="p-3">
                  一部の失敗で画面全体が落ちて困ったとき（Part 8 で触れました）
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium text-foreground">
                  状態管理ライブラリ
                </td>
                <td className="p-3">
                  Part 9 の 4 つでは足りないと、実際に困ったとき
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium text-foreground">
                  サーバーへの書き込み
                </td>
                <td className="p-3">
                  Next.js の Server Actions。フォームの送信を
                  サーバー側の関数に直接つなぐ書き方
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium text-foreground">
                  アクセシビリティ
                </td>
                <td className="p-3">
                  キーボードだけで操作できるか、読み上げに乗るか。
                  この教材のデモにも入れてありますが、説明はしていません
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-foreground">
                  スタイリングの設計
                </td>
                <td className="p-3">
                  画面が増えて、見た目の指定が散らかってきたとき
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          最後の行が大事です。
          <strong>困る前に入れないでください。</strong>
          Part 10 で書いたとおり、道具には値段があります。
        </p>
      </LessonSection>

      <LessonSection id="how-to-search" {...at(SEARCH, "const controller = new AbortController();")}>
        <h2>調べ方</h2>

        <p>
          分からないことは、これからいくらでも出てきます。
          <strong>調べ方だけ持っていれば大丈夫です。</strong>
        </p>

        <ul>
          <li>
            <strong>公式ドキュメントを最初に見る</strong>。
            <a href="https://ja.react.dev/" target="_blank" rel="noreferrer">
              ja.react.dev
            </a>{" "}
            に日本語版があります。この教材の説明も、ほとんどここが元です
          </li>
          <li>
            <strong>エラーメッセージをそのまま検索する</strong>。
            訳したり要約したりせず、英語のまま貼る
          </li>
          <li>
            <strong>記事の日付を見る</strong>。
            React は書き方が変わってきました。
            <code>.Provider</code> や <code>forwardRef</code> が出てくる記事は、
            少し古い可能性があります
          </li>
        </ul>

        <Callout variant="note" title="AI に聞くときのコツ">
          <p>
            「動きません」ではなく、
            <strong>この教材で覚えた言葉で聞く</strong>と精度が上がります。
          </p>
          <StaticCode
            lang="bash"
            code={`✕ TODO が更新されません

◯ useState の配列に push しても再レンダリングされません。
   新しい配列を作るべきという理解で合っていますか`}
          />
          <p>
            <strong>何が起きているかを言葉にできれば、半分解けています。</strong>
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="quiz" {...at(TODO, "const toggle = (id: number)")}>
        <h2>最後に、5 つの芯を確かめる</h2>

        <Quiz
          question="画面が更新されないとき、まず疑うのはどれ？"
          options={[
            {
              label: "元の配列やオブジェクトを、書き換えてしまっていないか",
              correct: true,
              explanation:
                "React は「同じものかどうか」で判断します。中身を書き換えても同じものなので、変わっていないと見なされます。いちばん多い原因です。",
            },
            {
              label: "再レンダリングが遅くて、追いついていないのではないか",
              explanation:
                "描き直しは一瞬で終わります。待っても変わらないなら、そもそも描き直しが起きていません。",
            },
            {
              label: "useEffect を書き忘れているのではないか",
              explanation:
                "表示の更新に useEffect は要りません。むしろ Part 6 で見たとおり、要らない場面で使うほうが問題になります。",
            },
          ]}
        />

        <Quiz
          question="サーバーから取ってきたデータを useState にコピーしていいのはどんなとき？"
          options={[
            {
              label: "基本しない。編集用の下書きとして持つときだけ",
              correct: true,
              explanation:
                "コピーすると、元が変わっても追随しません。「サーバーのものはサーバーのもの」で、手元に持つのは自分で編集する下書きだけです。",
            },
            {
              label: "毎回コピーする。そのほうが速いから",
              explanation:
                "速さは変わりません。増えるのは、元とコピーがずれる可能性だけです。",
            },
            {
              label: "配列のときだけコピーする",
              explanation:
                "形は関係ありません。持ち主が誰かで決まります。",
            },
          ]}
        />

        <Quiz
          question="新しい道具（ライブラリ）を入れるかどうかは、どう決める？"
          options={[
            {
              label: "実際に困ってから入れる。困る前に入れない",
              correct: true,
              explanation:
                "道具には値段があります。読む人が覚えることが増え、抜けられなくなることもあります。困っていないなら、その値段を払う理由がありません。",
            },
            {
              label: "有名なものは先に入れておく",
              explanation:
                "有名さは、自分の画面に必要かどうかとは別の話です。",
            },
            {
              label: "自分で書けないものだけ入れる",
              explanation:
                "書けるかどうかより、書いたものを保ち続けられるかで決めます。書けても任せたほうがよいものはあります。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="closing" {...at(TODO, "const add = ()")}>
        <h2>最後に</h2>

        <p>
          丸暗記した書き方は、<strong>状況が変われば使えなくなります</strong>。
          仕組みが分かっていれば、初めて見るコードでも
          <strong>「たぶんこうだろう」と当たりが付けられます</strong>。
          そこまで来れば、あとは自分で進めます。
        </p>

        <p>
          <strong>ここから先は、作りながら覚えてください。</strong>
        </p>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
