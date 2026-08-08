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
import { LiftedState } from "./demos/lifted-state";
import { SeparateState } from "./demos/separate-state";

const SLUG = "lifting-state";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/lifting-state/demos/separate-state.tsx", label: "separate-state.tsx" },
  { path: "lessons/lifting-state/demos/lifted-state.tsx", label: "lifted-state.tsx" },
] as const;

const [SEPARATE, LIFTED] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          state はコンポーネントごとに持てます。
          <strong>持てるということは、バラバラになるということ</strong>でもあります。
        </p>
        <p>
          2 つの部品で同じ値を見せたいのに、それぞれが自分の state
          を持っていたら、いつまでも一致しません。
        </p>
        <p>
          このときの定石が<strong>リフトアップ</strong>です。
          state を、<strong>共通の親へ引き上げます</strong>。
        </p>
      </LessonHeader>

      <LessonSection id="separate" {...at(SEPARATE, "const [count, setCount]")}>
        <h2>それぞれが持つと、そろわない</h2>

        <p>
          同じ部品を 2 つ置いています。
          どちらのボタンを押しても、<strong>押したほうしか増えません</strong>。
        </p>

        <DemoCard
          title="子がそれぞれ state を持つ"
          tone="bad"
          sourcePath={SEPARATE}
          description="上下で別々の数になる"
        >
          <SeparateState />
        </DemoCard>

        <p>
          これは不具合ではなく、当然の結果です。
          <code>useState</code> は<strong>そのコンポーネントごとに別の値</strong>を用意します。
          同じコードから作られていても、置かれた 2 つは別物です。
        </p>

        <p>
          「別々でいい」ならこれで正解です。
          問題になるのは、<strong>そろっていてほしい</strong>場合です。
        </p>
      </LessonSection>

      <LessonSection id="lifted" {...at(LIFTED, "export function LiftedState")}>
        <h2>共通の親へ引き上げる</h2>

        <p>
          解決は単純です。
          <strong>両方から見える場所、つまり共通の親に state を移します。</strong>
        </p>

        <p>子には、Part 2 でやった形で渡します。</p>

        <ul>
          <li>表示するための<strong>値</strong></li>
          <li>変更を伝えるための<strong>関数</strong></li>
        </ul>

        <DemoCard
          title="親が state を持つ"
          tone="good"
          sourcePath={LIFTED}
          description="どちらを押しても、両方が変わる"
        >
          <LiftedState />
        </DemoCard>

        <p>
          子のコードから <code>useState</code> が消えました。
          子は<strong>値を受け取って表示し、押されたら伝えるだけ</strong>です。
          Part 2-3 でやった形と、まったく同じになっています。
        </p>

        <Callout variant="point" title="リフトアップの手順">
          <ol>
            <li>そろえたい state を見つける</li>
            <li>それを使う部品すべての、<strong>共通の親</strong>を探す</li>
            <li>state をその親へ移す</li>
            <li>子には値と、変更を伝える関数を props で渡す</li>
          </ol>
        </Callout>
      </LessonSection>

      <LessonSection id="where" {...at(LIFTED, "function Panel")}>
        <h2>どこまで上げるか</h2>

        <p>
          「上げれば解決する」なら、最初から一番上に置けばよさそうに思えます。
          ですが、それはやりません。
        </p>

        <p>
          上げるほど、<strong>関係のない部品まで巻き込みます</strong>。
        </p>

        <ul>
          <li>
            渡すために、途中の部品が使いもしない props を受け渡すことになる
          </li>
          <li>
            親の state が変わると、その下が広く描き直される（Part 7 以降の話）
          </li>
          <li>
            どこで何が変わるのか、追いかける範囲が広くなる
          </li>
        </ul>

        <Callout variant="point" title="置き場所の原則">
          <p>
            <strong>それを必要とする部品すべてを含む、いちばん下の場所</strong>に置く。
          </p>
          <p>
            高すぎても低すぎても困ります。必要十分な高さを探します。
          </p>
        </Callout>

        <h3>バケツリレーがつらくなったら</h3>

        <p>
          必要な高さが本当に高く、
          間の部品が<strong>使いもしない props をただ受け渡すだけ</strong>
          になることがあります。これをバケツリレーと呼びます。
        </p>

        <StaticCode
          code={`// Middle は user を使わないのに、渡すためだけに受け取っている
<Page user={user}>
  <Middle user={user}>
    <Profile user={user} />
  </Middle>
</Page>`}
        />

        <p>
          この状態が深くなってきたら、Part 9 の <code>Context</code>{" "}
          という道具が候補になります。
          ただし<strong>まずはリフトアップで足ります</strong>。
          2 段や 3 段で困ることはほとんどありません。
        </p>

        <Callout variant="note" title="children で回避できることもある">
          <p>
            Part 2 でやった合成を使うと、
            バケツリレーそのものを消せる場合があります。
            中身を親で組み立てて <code>children</code> として渡せば、
            間の部品は何も知らずに済みます。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="quiz" {...at(LIFTED)}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="同じコンポーネントを 2 つ置くと、state はどうなる？"
          options={[
            {
              label: "それぞれが別々の値を持つ",
              correct: true,
              explanation:
                "useState は置かれたコンポーネントごとに値を用意します。同じコードでも、置かれた 2 つは別物です。",
            },
            {
              label: "同じ値を共有する",
              explanation:
                "共有はされません。共有したい場合は、共通の親に state を移す必要があります。",
            },
            {
              label: "あとから置いたほうが上書きする",
              explanation:
                "上書きは起きません。互いに干渉しない、独立した値になります。",
            },
          ]}
        />

        <Quiz
          question="state の置き場所として適切なのは？"
          options={[
            {
              label: "それを必要とする部品すべてを含む、いちばん下の場所",
              correct: true,
              explanation:
                "高すぎると関係ない部品を巻き込み、低すぎると共有できません。必要十分な高さを探します。",
            },
            {
              label: "アプリの一番上。すべての部品から使えるので安全",
              explanation:
                "使わない部品まで巻き込み、props の受け渡しも増えます。変更の影響範囲も広がります。",
            },
            {
              label: "実際に表示している、いちばん下の部品",
              explanation:
                "そこに置くと他の部品から見えません。共有したい場合は共通の親まで上げる必要があります。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(LIFTED)}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            <code>useState</code> はコンポーネントごとに別の値を持つ
          </li>
          <li>
            そろえたいときは、<strong>共通の親へ state を上げる</strong>
          </li>
          <li>子には、値と変更を伝える関数を props で渡す</li>
          <li>
            置き場所は<strong>必要な部品すべてを含む、いちばん下</strong>
          </li>
          <li>
            バケツリレーが深くなったら Context（Part 9）。
            ただし多くの場合、リフトアップと合成で足りる
          </li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
