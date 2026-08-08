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
import { PropsBasic } from "./demos/props-basic";
import { PropsDefault } from "./demos/props-default";

const SLUG = "props";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/props/demos/props-basic.tsx", label: "props-basic.tsx" },
  { path: "lessons/props/demos/props-default.tsx", label: "props-default.tsx" },
] as const;

const [BASIC, DEFAULTS] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          前の章で作ったコンポーネントは、いつも同じものしか表示できませんでした。
          同じ形で中身だけ違うものを出したいのに、これでは使い物になりません。
        </p>
        <p>
          そこで、外から値を渡せるようにします。それが{" "}
          <strong>props</strong> です。
        </p>
        <p>
          コンポーネントが関数なら、props は<strong>その引数</strong>です。
          新しい概念ではありません。
        </p>
      </LessonHeader>

      <LessonSection id="basic" {...at(BASIC, "function Member")}>
        <h2>props は関数の引数</h2>

        <p>
          値を渡すときは、HTML の属性と同じ書き方をします。
        </p>

        <StaticCode code={`<Member name="さとう" role="デザイナー" />`} />

        <p>
          受け取る側では、これが<strong>ひとつのオブジェクト</strong>として届きます。
        </p>

        <StaticCode
          code={`// 届いているもの
{ name: "さとう", role: "デザイナー" }`}
        />

        <p>
          オブジェクトで届くので、Part 0
          でやった分割代入がそのまま使えます。React
          のコードがこの形をしているのはそのためです。
        </p>

        <StaticCode
          code={`// 受け取るところで、直接取り出す
function Member({ name, role }: Props) {
  return <p>{name}</p>;
}`}
        />

        <DemoCard
          title="同じ部品に違う値を渡す"
          sourcePath={BASIC}
          description="関数はひとつ、表示は 2 種類"
        >
          <PropsBasic />
        </DemoCard>
      </LessonSection>

      <LessonSection id="types" {...at(BASIC, "type Props")}>
        <h2>受け取る値の形を決める</h2>

        <p>
          props に型を付けておくと、<strong>渡し忘れや打ち間違いをその場で教えてもらえます</strong>。
        </p>

        <StaticCode
          code={`type Props = {
  name: string;   // 必ず渡す
  role?: string;  // 渡さなくてもよい
};`}
        />

        <ul>
          <li>
            <code>name</code> を渡し忘れる → エラーになる
          </li>
          <li>
            <code>nane</code> と打ち間違える → エラーになる
          </li>
          <li>
            <code>name={"{123}"}</code> と数値を渡す → エラーになる
          </li>
        </ul>

        <p>
          どれも、動かす前に赤線が出ます。
          型を書く手間より、これで助かる時間のほうがずっと大きくなります。
        </p>

        <Callout variant="warn" title="? を付けたら、ないときの用意も必要">
          <p>
            <code>role?</code> は「渡されないかもしれない」という意味です。
            そのまま表示すると、渡されなかったときに何も出ません。
            <code>role ?? &quot;役割は未設定&quot;</code>{" "}
            のように、ないときにどうするかまで書いておきます。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="default" {...at(DEFAULTS, "tone = \"normal\"")}>
        <h2>渡されなかったときの値を決めておく</h2>

        <p>
          <code>??</code> を毎回書く代わりに、
          受け取るところで初期値を決めておくこともできます。
        </p>

        <StaticCode
          code={`function Badge({ label, tone = "normal" }: Props) {`}
        />

        <p>
          <code>tone</code> が渡されなかったときは <code>&quot;normal&quot;</code>{" "}
          になります。これも React の機能ではなく、
          JavaScript の分割代入がもともと持っている書き方です。
        </p>

        <DemoCard
          title="初期値のある props"
          sourcePath={DEFAULTS}
          description="tone を渡さないほうは normal になっている"
        >
          <PropsDefault />
        </DemoCard>

        <h3>受け取る値を絞る</h3>

        <p>
          このデモでは、<code>tone</code> の型を{" "}
          <code>&quot;normal&quot; | &quot;warning&quot;</code> にしています。
          Part 0 でやった union です。
        </p>

        <p>
          こうしておくと、<code>tone=&quot;warn&quot;</code>{" "}
          のような打ち間違いがエラーになります。
          <strong>渡せる値そのものを制限してしまう</strong>のが、
          props に型を付ける最大の効果です。
        </p>
      </LessonSection>

      <LessonSection id="tips" {...at(BASIC, "<Member name=")}>
        <h3>渡し方のこまごまとした話</h3>

        <StaticCode
          code={`// 文字列はそのまま書ける
<Member name="さとう" />

// それ以外は波括弧に入れる
<Member age={20} tags={["a", "b"]} onSave={handleSave} />

// 値が true のときは、名前だけでよい
<Member isAdmin />        // isAdmin={true} と同じ`}
        />

        <p>
          文字列以外を渡すときに波括弧が要るのは、
          <strong>そこから先が JavaScript だから</strong>です。
          JSX の章でやった「波括弧の中は JavaScript に戻る」と同じ話です。
        </p>
      </LessonSection>

      <LessonSection id="quiz" {...at(BASIC)}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="props はコンポーネントに何として届く？"
          options={[
            {
              label: "ひとつのオブジェクト",
              correct: true,
              explanation:
                "属性をいくつ書いても、届くのは 1 つのオブジェクトです。だから分割代入で取り出せます。",
            },
            {
              label: "書いた属性の数だけ、引数として順番に届く",
              explanation:
                "順番ではありません。まとめてオブジェクトになるので、書く順番は自由です。",
            },
            {
              label: "文字列として届く",
              explanation:
                "数値でも配列でも関数でも、渡した値がそのままの形で届きます。",
            },
          ]}
        />

        <Quiz
          question="type Props = { tone?: 'normal' | 'warning' } と書く利点は？"
          options={[
            {
              label: "決めた 2 つ以外を渡すとエラーになる",
              correct: true,
              explanation:
                "打ち間違いや想定外の値を、動かす前に防げます。渡せる値そのものを制限できるのが型の効果です。",
            },
            {
              label: "渡さなかったときに自動で normal になる",
              explanation:
                "型は「渡せる値」を決めるだけです。初期値は tone = 'normal' のように、受け取るところで別に書きます。",
            },
            {
              label: "2 つのうち片方を必ず渡さなければならなくなる",
              explanation:
                "? が付いているので、渡さなくても構いません。渡すなら 2 つのどちらか、という意味です。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(BASIC)}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            props は<strong>コンポーネント（関数）の引数</strong>
          </li>
          <li>いくつ書いても、届くのはひとつのオブジェクト</li>
          <li>
            型を付けると、渡し忘れ・打ち間違い・型違いが
            <strong>動かす前に</strong>分かる
          </li>
          <li>
            <code>?</code> は任意の項目。ないときの表示も用意しておく
          </li>
          <li>
            <code>{"{ tone = \"normal\" }"}</code> で初期値を決められる
          </li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
