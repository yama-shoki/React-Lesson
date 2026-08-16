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
import { StaleError } from "./demos/stale-error";
import { Validation } from "./demos/validation";

const SLUG = "form-validation";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/form-validation/demos/stale-error.tsx", label: "stale-error.tsx" },
  { path: "lessons/form-validation/demos/validation.tsx", label: "validation.tsx" },
] as const;

const [STALE, VALIDATION] = SOURCES.map((source) => source.path);

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
          Part 4 の「state は最小限にする」 でやった「計算できるものは state にしない」がそのまま当てはまります。
        </p>

        <p>
          state にしてしまうと、入力のたびに
          <code>setError</code> を呼ぶ必要が出てきます。
          呼び忘れると、こうなります。
        </p>

        <DemoCard
          title="エラーを state で持った版"
          tone="bad"
          sourcePath={STALE}
          description="空のまま「確認する」→ 正しく直す → エラーはどうなる？"
        >
          <StaleError />
        </DemoCard>

        <p>
          手順は 3 つです。
          何も入れずに「確認する」を押し、エラーを出す。
          次に <code>taro@example.com</code> のように正しく入力する。
          それだけです。
        </p>

        <p>
          <strong>エラーが出たままです。</strong>
          入力はもう正しいのに、表示だけが古い。
          <code>error</code> という state が、
          <strong>入力とは別に、勝手に古い値を持ち続けている</strong>からです。
        </p>

        <p>
          このあとのデモ（計算で出している版）では、
          同じ操作をしてもエラーはすぐ消えます。
          <strong>表示するものが、常に今の入力から計算されている</strong>ためです。
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
          なお、このデモの送信ボタンは<strong>最初から押せません</strong>。
          <strong>赤字で怒らないことと、押せなくしておくことは別の親切です。</strong>
          前者は「まだ何もしていない人を責めない」、
          後者は「送れないものを送らせない」。両立します。
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
          項目が 3 つ 4 つと増えてくると、
          この書き方はつらくなります。条件と表示が離れていくからです。
        </p>

        <p>
          そのための道具が
          <strong>React Hook Form</strong> と <strong>zod</strong> です。
          <strong>Part 10 で実際に使います。</strong>
          ここでは名前だけ覚えておいてください。
        </p>

        <p>
          先に自分で書いておくと、
          <strong>道具が何を肩代わりしてくれているのか</strong>が分かります。
          この章はそのための下地です。
        </p>
      </LessonSection>

      <LessonSection id="form-tag" {...at(VALIDATION, "const validateEmail")}>
        <h3>本物のフォームは form で囲む</h3>

        <p>
          この Part のデモは、話を絞るために
          <code>&lt;input&gt;</code> と <code>&lt;button&gt;</code> だけで作っています。
          実際のフォームでは <code>&lt;form&gt;</code> で囲みます。
        </p>

        <StaticCode
          code={`<form onSubmit={handleSubmit}>
  <input ... />
  <button type="submit">送信</button>
</form>`}
        />

        <ul>
          <li>
            <strong>Enter キーでも送信できるようになります</strong>
            （囲まないと効きません）
          </li>
          <li>
            送信の処理は <code>onSubmit</code> に書きます。
            ボタンの <code>onClick</code> ではありません
          </li>
        </ul>

        <Callout variant="warn" title="preventDefault を忘れない">
          <StaticCode
            lang="ts"
            code={`const handleSubmit = (event) => {
  event.preventDefault();   // ← これがないとページが再読み込みされる
  ...
};`}
          />
          <p>
            <code>&lt;form&gt;</code> は、そのままだと
            <strong>ページを読み込み直そうとします</strong>。
            HTML の元からの動きです。
            Part 3 で出てきた <code>preventDefault</code> で止めます。
          </p>
          <p>
            Part 10 の React Hook Form では、
            この <code>preventDefault</code> も向こうがやってくれます。
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
                "二重に持つと更新の書き忘れが起き、直したのにエラーが残る状態になります。Part 4 の「state は最小限にする」 と同じ話です。",
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

        <Callout variant="note" title="ここで Part 5 は終わりです">
          <p>
            ここまでで、<strong>画面の中だけで完結する話</strong>は
            ひととおり終わりました。
            表示して、押して、入力して、確かめる。
            これだけで作れるものは、意外と多いはずです。
          </p>
          <p>
            次の Part から、<strong>React の外側</strong>が出てきます。
            ブラウザのタブ名、タイマー、通信。
            React が管理していないものと、どう足並みをそろえるか、という話です。
          </p>
          <p>
            そこで出てくるのが <code>useEffect</code> です。
            ただし<strong>いちばん誤用されている道具</strong>でもあるので、
            「使う」と同じくらい「使わない」に紙幅を割きます。
          </p>
        </Callout>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
