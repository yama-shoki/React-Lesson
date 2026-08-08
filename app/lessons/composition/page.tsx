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
import { Composed } from "./demos/composed";
import { PropsExplosion } from "./demos/props-explosion";

const SLUG = "composition";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/composition/demos/props-explosion.tsx", label: "props-explosion.tsx" },
  { path: "lessons/composition/demos/composed.tsx", label: "composed.tsx" },
] as const;

const [EXPLOSION, COMPOSED] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          コンポーネントを作っていくと、必ずこの分かれ道に来ます。
        </p>
        <p>
          <strong>似ているけれど少し違うもの</strong>を、どう表現するか。
        </p>
        <p>
          多くの言語では、継承して差分だけ書き換えます。
          React ではそれをしません。
          <strong>組み合わせて作ります</strong>。これを合成と呼びます。
        </p>
      </LessonHeader>

      <LessonSection id="explosion" {...at(EXPLOSION, "function Card")}>
        <h2>props で全部を受け取ろうとすると</h2>

        <p>
          カードを作るとします。最初はタイトルと本文だけでした。
          そこへ「バッジも出したい」「下に更新日も出したい」と要望が来ます。
        </p>

        <p>props で受け取る作りだと、こうなっていきます。</p>

        <DemoCard
          title="props で中身を受け取るカード"
          tone="bad"
          sourcePath={EXPLOSION}
          description="表示できるものが増えるたびに props が増える"
        >
          <PropsExplosion />
        </DemoCard>

        <p>
          問題は 2 つあります。
        </p>

        <ul>
          <li>
            <strong>props が際限なく増える</strong> …
            <code>showBadge</code> と <code>badgeLabel</code> のように、
            出すかどうかと中身がセットで増えていきます
          </li>
          <li>
            <strong>決めた形しか出せない</strong> …
            「バッジの代わりにボタンを置きたい」と言われたら、
            また新しい props が必要です
          </li>
        </ul>

        <p>
          そして <code>Card</code>{" "}
          は、あらゆる使われ方を知っている巨大な部品になっていきます。
          <strong>使う人が増えるほど、部品が複雑になる</strong>作りです。
        </p>
      </LessonSection>

      <LessonSection id="composed" {...at(COMPOSED, "export function Composed")}>
        <h2>組み合わせて作る</h2>

        <p>
          合成では、逆の発想をします。
          <strong>枠は場所だけを決めて、何を置くかは呼ぶ側が決める。</strong>
        </p>

        <DemoCard
          title="組み合わせて作ったカード"
          tone="good"
          sourcePath={COMPOSED}
          description="見た目は同じだが、Card は中身を知らない"
        >
          <Composed />
        </DemoCard>

        <p>
          <code>Card</code>、<code>CardHeader</code>、<code>CardBody</code>、
          <code>CardFooter</code>。
          どれも <code>children</code> を置くだけの、数行の部品です。
          <code>showBadge</code> のような props はひとつもありません。
        </p>

        <p>
          それでいて、できることは増えています。
          バッジの代わりにボタンを置きたければ、
          <strong>呼ぶ側でそう書けばいいだけ</strong>です。
          <code>Card</code> を直す必要はありません。
        </p>

        <Callout variant="point" title="合成の効き目">
          <p>
            使い道が増えても、<strong>部品のほうは複雑にならない</strong>。
            変更が呼ぶ側だけで完結します。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="specialization" {...at(COMPOSED, "function CardHeader")}>
        <h2>特別なものは、包んで作る</h2>

        <p>
          「よく使う組み合わせ」が決まっているなら、
          それを包んだ部品を作ります。継承ではなく、
          <strong>汎用のものを使う専用のもの</strong>を作るわけです。
        </p>

        <StaticCode
          code={`// 汎用の Alert を使って、専用の ErrorAlert を作る
function ErrorAlert({ children }: { children: ReactNode }) {
  return <Alert tone="error" icon={<XIcon />}>{children}</Alert>;
}`}
        />

        <p>
          <code>ErrorAlert</code> は <code>Alert</code>{" "}
          を継承しているのではなく、<strong>使っている</strong>だけです。
          呼ぶ側は <code>tone</code> を指定しなくてよくなり、
          <code>Alert</code> 自体は何も変わりません。
        </p>

        <h3>なぜ継承を使わないのか</h3>

        <p>
          継承だと、親を直したときに
          <strong>それを継いだ全部に影響</strong>します。
          しかも「どこまでが親の機能か」を知らないと、子を読めません。
        </p>

        <p>
          合成なら、使っているものは書いてあるとおりです。
          <code>ErrorAlert</code> のコードを見れば、
          <code>Alert</code> を使っていることが 1 行で分かります。
          <strong>隠れた関係が生まれません。</strong>
        </p>
      </LessonSection>

      <LessonSection id="when" {...at(EXPLOSION, "showBadge")}>
        <h3>どこで切り替えるか</h3>

        <p>
          最初から合成で作る必要はありません。
          props が 2 つ 3 つのうちは、そのほうが簡単です。
        </p>

        <p>次のような兆候が出たら、合成に切り替えどきです。</p>

        <ul>
          <li>
            <code>showXxx</code> のような、出すかどうかを決める props が増えてきた
          </li>
          <li>props の数が増え、どれとどれを一緒に使うのか分かりにくい</li>
          <li>
            「この場合だけ、ここに別のものを置きたい」という要望が繰り返し来る
          </li>
        </ul>

        <Callout variant="note">
          <p>
            この教材で使っている shadcn/ui
            のコンポーネントも、この考え方で作られています。
            <code>Card</code> と <code>CardHeader</code> が別々になっているのは、
            まさにいまやった理由からです。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="quiz" {...at(COMPOSED)}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="showBadge / badgeLabel のような props が増えてきた。どうする？"
          options={[
            {
              label: "children で差し込めるようにして、中身は呼ぶ側に決めてもらう",
              correct: true,
              explanation:
                "枠が中身を知らなくなるので、使い道が増えても props が増えません。変更が呼ぶ側で完結します。",
            },
            {
              label: "props をオブジェクトにまとめて数を減らす",
              explanation:
                "見た目の数は減りますが、枠があらゆる使われ方を知っている状態は変わりません。根本の解決にはなりません。",
            },
            {
              label: "パターンごとに別のコンポーネントを作る",
              explanation:
                "似た部品が増え、同じ修正を何か所にも入れることになります。合成なら 1 つの枠で足ります。",
            },
          ]}
        />

        <Quiz
          question="React で継承を使わないのはなぜ？"
          options={[
            {
              label: "隠れた関係ができて、コードを読むのに親まで追う必要が出るから",
              correct: true,
              explanation:
                "合成なら「何を使っているか」がコードに書いてあります。親を直したときの影響範囲も限定されます。",
            },
            {
              label: "JavaScript にクラスの継承がないから",
              explanation:
                "JavaScript にも継承はあります。使えないのではなく、使わない選択をしています。",
            },
            {
              label: "継承すると動作が遅くなるから",
              explanation:
                "速度の問題ではありません。読みやすさと変更のしやすさの問題です。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(COMPOSED)}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            React では継承せず、<strong>組み合わせて</strong>作る
          </li>
          <li>
            props で中身のパターンを受け取ると、
            <strong>使い道が増えるほど部品が複雑になる</strong>
          </li>
          <li>
            <code>children</code> で差し込めるようにすると、
            枠は中身を知らなくて済み、変更が呼ぶ側で完結する
          </li>
          <li>
            特別なものは、汎用のものを<strong>包んで</strong>作る
          </li>
          <li>
            <code>showXxx</code> のような props が増えてきたら切り替えどき
          </li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
