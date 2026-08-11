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
import { Greetings } from "./demos/greeting";
import { ProfileCard } from "./demos/profile-card";

const SLUG = "components";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/components/demos/greeting.tsx", label: "greeting.tsx" },
  { path: "lessons/components/demos/profile-card.tsx", label: "profile-card.tsx" },
] as const;

const [GREETING, CARD] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          React は「コンポーネントを作って組み合わせる」ライブラリだと説明されます。
          そう聞くと、何か特別な仕組みがあるように思えます。
        </p>
        <p>
          ですが実体は拍子抜けするほど単純です。
          <strong>コンポーネントとは、JSX を返すただの関数</strong>です。
          それ以上でも以下でもありません。
        </p>
      </LessonHeader>

      <LessonSection id="function" {...at(GREETING, "function Greeting")}>
        <h2>JSX を返す関数、それだけ</h2>

        <p>
          前の章で「JSX は値である」と確かめました。
          値なら、関数から返せます。それがコンポーネントです。
        </p>

        <StaticCode
          code={`function Greeting() {
  return <p>こんにちは</p>;
}`}
        />

        <p>
          特別な書き方も、継承する親クラスもありません。
          <strong>JSX を返す関数を書けば、それはもうコンポーネント</strong>です。
        </p>

        <p>
          そして作ったコンポーネントは、タグとして書けます。
          同じものを何度でも置けます。
        </p>

        <DemoCard
          title="同じ部品を 3 回置く"
          sourcePath={GREETING}
          description="関数を 1 つ書いて、3 回使っている"
        >
          <Greetings />
        </DemoCard>
      </LessonSection>

      <LessonSection id="uppercase" {...at(GREETING, "export function Greetings")}>
        <h2>名前は必ず大文字で始める</h2>

        <p>
          コンポーネントの名前は、<strong>大文字で始めなければいけません</strong>。
          これは好みの問題ではなく、動作が変わります。
        </p>

        <StaticCode
          code={`<Greeting />   // 大文字 → 自分で作ったコンポーネント
<greeting />   // 小文字 → HTML のタグとして扱われる`}
        />

        <p>
          React は<strong>頭文字だけを見て</strong>、
          「これは自作の部品か、それとも HTML のタグか」を判断しています。
          小文字で書くと、React はそれを
          <strong>HTML のタグ名だと思って</strong>、
          <code>&lt;greeting&gt;</code> という要素をそのまま作ります。
          そんなタグはブラウザにとって意味がないので、画面には何も出ません。
        </p>

        <Callout variant="warn" title="気づけるかどうかは、書き方しだい">
          <p>
            素の JavaScript で書いていると、この間違いは
            <strong>エラーにならず、ただ何も表示されません</strong>。
            「作ったはずの部品が出ない」ときは、まず頭文字を確認してください。
          </p>
          <p>
            この教材のように <strong>TypeScript</strong> で書いていれば、
            <code>&lt;greeting /&gt;</code> の時点で
            「そんな HTML タグはない」と赤線が出ます。
            型を付けておくと、こういう間違いが書いた瞬間に分かります。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="compose" {...at(CARD, "export function ProfileCard")}>
        <h2>小さく作って、組み合わせる</h2>

        <p>
          コンポーネントは、別のコンポーネントの中で使えます。
          小さい部品を作り、それを並べて大きい部品を作っていきます。
        </p>

        <DemoCard
          title="部品を組み合わせたカード"
          sourcePath={CARD}
          description="Avatar と Name を並べただけ"
        >
          <ProfileCard />
        </DemoCard>

        <p>
          <code>ProfileCard</code> の中身を見ると、
          <strong>何が置いてあるかが一目で分かります</strong>。
          アバターと名前が横に並んでいる、それだけです。
        </p>

        <p>
          もし分けずに全部書いていたら、
          <code>div</code> と <code>className</code> が入り混じった塊になり、
          何のためのコードか読み取るのに時間がかかります。
        </p>

        <h3>分けると何が良いのか</h3>

        <ul>
          <li>
            <strong>読める</strong> … 名前が付くので、中を読まなくても何かが分かる
          </li>
          <li>
            <strong>使い回せる</strong> … 同じ見た目が必要な場所で再利用できる
          </li>
          <li>
            <strong>直す範囲が狭い</strong> … アバターを丸から四角に変えたいなら、
            <code>Avatar</code> だけを見ればいい
          </li>
        </ul>

        <Callout variant="note" title="どこまで分けるか">
          <p>
            最初から細かく分ける必要はありません。
            <strong>長くなって読みにくくなったとき</strong>や、
            <strong>同じものを 2 回書きそうになったとき</strong>に分ければ十分です。
          </p>
          <p>
            分けすぎると、今度はファイルを行き来する手間が増えます。
            分け方そのものは、この Part の
            <strong>「合成という考え方」</strong>で改めて扱います。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="quiz" {...at(GREETING)}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="React のコンポーネントとは何？"
          options={[
            {
              label: "JSX を返す関数",
              correct: true,
              explanation:
                "それだけです。特別な継承も、決められた書き方もありません。",
            },
            {
              label: "React が用意した特別なクラス",
              explanation:
                "昔はクラスで書く方法もありましたが、いまは関数で書くのが標準です。特別な親クラスは必要ありません。",
            },
            {
              label: "HTML を文字列で返す関数",
              explanation:
                "返しているのは文字列ではなく JSX（関数呼び出しの結果の値）です。",
            },
          ]}
        />

        <Quiz
          question="作ったコンポーネントが画面に出ない。まず疑うのは？"
          options={[
            {
              label: "名前が小文字で始まっていないか",
              correct: true,
              explanation:
                "小文字だと HTML タグとして扱われ、意味のない要素が作られるだけなので何も表示されません。TypeScript を使っていれば赤線で気づけます。",
            },
            {
              label: "return（結果を返す命令）を書き忘れていないか",
              explanation:
                "それも原因になり得ますが、その場合は多くのケースでエラーや警告が出ます。無言で消えるのは頭文字のほうです。",
            },
            {
              label: "ファイル名が間違っていないか",
              explanation:
                "ファイル名は React の動作に影響しません。import できていれば名前は自由です。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(GREETING)}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            コンポーネントは<strong>JSX を返すただの関数</strong>
          </li>
          <li>
            名前は<strong>大文字で始める</strong>。小文字だと HTML タグ扱いになり、無言で消える
          </li>
          <li>小さい部品を組み合わせて、大きい部品を作る</li>
          <li>
            分ける目的は、読みやすさ・再利用・
            <strong>直す範囲を狭くすること</strong>
          </li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
