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
import { Validation } from "./demos/validation";

const SLUG = "form-validation";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/form-validation/demos/validation.tsx", label: "validation.tsx" },
] as const;

const [VALIDATION] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          Part 0 で TypeScript の型をやりました。ですが、
          <strong>型はユーザーの入力を守ってくれません</strong>。
        </p>
        <p>
          型のチェックは書いているときとビルドのときだけで、
          <strong>動いている最中には存在しません</strong>。
          「メールアドレスの形か」を判断できるのは、実行時のチェックだけです。
        </p>
        <p>
          この章では、その書き方と<strong>いつエラーを出すか</strong>を扱います。
        </p>
      </LessonHeader>

      <LessonSection id="why" {...at(VALIDATION, "const validateEmail")}>
        <h2>型は実行時には効かない</h2>

        <StaticCode
          lang="ts"
          code={`type Form = { email: string };

// 型としては通ってしまう。string ではあるので
const form: Form = { email: "これはメールアドレスではない" };`}
        />

        <p>
          <code>string</code> であることは型が保証しますが、
          <strong>その中身が正しいかどうかは別の話</strong>です。
          ユーザーは何でも打てます。
        </p>

        <p>
          だから、値を受け取って
          <strong>問題があれば教えてくれる関数</strong>を自分で用意します。
        </p>

        <StaticCode
          lang="ts"
          code={`const validateEmail = (value: string) => {
  if (value.trim() === "") return "メールアドレスを入力してください";
  if (!value.includes("@")) return "@ が含まれていません";
  return null; // 問題なし
};`}
        />

        <p>
          この関数には React
          の要素がひとつも入っていません。ただの関数です。
          だから<strong>単体で読めますし、単体で試せます</strong>。
          チェックの処理はコンポーネントの外に出しておくと、あとで楽になります。
        </p>
      </LessonSection>

      <LessonSection id="derived" {...at(VALIDATION, "const error = validateEmail")}>
        <h2>エラーは state にしない</h2>

        <p>
          エラーメッセージを <code>useState</code>{" "}
          で持ちたくなりますが、その必要はありません。
        </p>

        <StaticCode
          lang="ts"
          code={`// ✕ 二重に持つことになる
const [error, setError] = useState<string | null>(null);

// ○ 値から計算する
const error = validateEmail(email);`}
        />

        <p>
          エラーは<strong>入力値から必ず決まります</strong>。
          Part 4-3 でやった「計算できるものは state にしない」がそのまま当てはまります。
        </p>

        <p>
          state にしてしまうと、入力のたびに
          <code>setError</code> を呼ぶ必要が出てきて、
          呼び忘れれば<strong>直したのにエラーが消えない</strong>という状態になります。
        </p>
      </LessonSection>

      <LessonSection id="timing" {...at(VALIDATION, "const [touched, setTouched]")}>
        <h2>いつエラーを出すか</h2>

        <p>
          チェックそのものより、<strong>いつ見せるか</strong>のほうが体験を左右します。
        </p>

        <p>
          入力欄に触った瞬間から「入力してください」と赤字が出たら、
          何も悪いことをしていないのに怒られている気分になります。
        </p>

        <Callout variant="point" title="ほどよい出し方">
          <p>
            <strong>一度でも触ったあと</strong>から出す。
            入力欄から離れた時点（<code>onBlur</code>）を目安にします。
          </p>
        </Callout>

        <StaticCode
          lang="ts"
          code={`const [touched, setTouched] = useState(false);

const error = validateEmail(email);
const showError = touched && error !== null;`}
        />

        <DemoCard
          title="触ってから出るエラー"
          sourcePath={VALIDATION}
          showRenderCount
          description="入力欄から離れると、はじめてエラーが出る"
        >
          <Validation />
        </DemoCard>

        <p>
          <code>touched</code> は state です。
          「ユーザーが触ったかどうか」は、他の何からも計算できません。
          <strong>これは持つべき state</strong>です。
        </p>

        <p>
          一方で、送信ボタンを押せるかどうかは
          <code>error !== null</code> で決まります。こちらは計算です。
          <strong>何を持ち、何を計算するか</strong>の判断が、ここでも効いています。
        </p>
      </LessonSection>

      <LessonSection id="libraries" {...at(VALIDATION, "const validateEmail")}>
        <h3>項目が増えたら道具を使う</h3>

        <p>
          項目が 2 つ 3 つのうちは、いまの書き方で十分です。
          ですが 10 個になると、
          <code>useState</code> と <code>touched</code>{" "}
          が項目の数だけ並ぶことになります。
        </p>

        <p>そうなったら、専用の道具を使います。</p>

        <ul>
          <li>
            <strong>react-hook-form</strong> …
            入力欄の値と触ったかどうかをまとめて管理してくれる
          </li>
          <li>
            <strong>zod</strong> …
            チェックのルールを宣言的に書ける。しかも
            <strong>そこから型を作れる</strong>ので、型とチェックがズレない
          </li>
        </ul>

        <StaticCode
          lang="ts"
          code={`// zod で書くと、ルールと型が 1 か所にまとまる
const schema = z.object({
  email: z.string().email("メールアドレスの形式ではありません"),
  age: z.number().min(0),
});

type Form = z.infer<typeof schema>; // 型はここから作られる`}
        />

        <Callout variant="note">
          <p>
            ただし、<strong>いまの章でやったことが土台</strong>です。
            道具はこれを楽にしてくれるだけで、
            「エラーは計算で求まる」「触ってから見せる」という考え方は変わりません。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="quiz" {...at(VALIDATION)}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="TypeScript の型があれば、入力チェックは不要？"
          options={[
            {
              label: "不要ではない。型は実行時には存在しないため",
              correct: true,
              explanation:
                "型のチェックは書いているときとビルド時だけです。ユーザーが実際に打った内容は、実行時に自分で確かめる必要があります。",
            },
            {
              label: "不要。型に合わない値は入らないから",
              explanation:
                "string 型でも、中身がメールアドレスの形かどうかは型では表せません。",
            },
            {
              label: "必要だが、型を厳しくすれば減らせる",
              explanation:
                "型をどれだけ厳しくしても、実行時の入力は検査できません。役割が違います。",
            },
          ]}
        />

        <Quiz
          question="エラーメッセージを useState で持つべき？"
          options={[
            {
              label: "持たない。入力値から計算できるため",
              correct: true,
              explanation:
                "二重に持つと更新の書き忘れが起き、直したのにエラーが残る状態になります。Part 4-3 と同じ話です。",
            },
            {
              label: "持つべき。表示するものは state にする決まりだから",
              explanation:
                "そんな決まりはありません。表示するものでも、計算で出せるなら state にしません。",
            },
            {
              label: "持つべき。計算だと毎回実行されて遅くなるから",
              explanation:
                "この程度の処理で問題になることはありません。速度より、ずれない構造のほうが大切です。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(VALIDATION)}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            型は実行時に存在しない。入力の中身は<strong>自分で確かめる</strong>
          </li>
          <li>
            チェックはコンポーネントの外に出す。ただの関数なら単体で試せる
          </li>
          <li>
            エラーは<strong>値から計算する</strong>。state にしない
          </li>
          <li>
            「触ったかどうか」は計算できないので state。
            <strong>触ってから見せる</strong>
          </li>
          <li>
            項目が増えたら react-hook-form や zod。ただし考え方は同じ
          </li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
