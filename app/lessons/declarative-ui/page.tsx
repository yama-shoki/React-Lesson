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
import { LoginView } from "./demos/login-view";
import { StateToUiFigure } from "./figures/state-to-ui";

const SLUG = "declarative-ui";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/declarative-ui/demos/login-view.tsx", label: "login-view.tsx" },
] as const;

const [LOGIN] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          React の説明でよく出てくる「宣言的 UI」という言葉。
          日本語として硬いので身構えてしまいますが、
          言っていることはひとつだけです。
        </p>
        <p>
          <strong>画面をどう作り変えるかではなく、画面がどうあるべきかを書く。</strong>
        </p>
        <p>
          この違いが分かると、React
          のコードが「なぜあの形をしているのか」に納得がいきます。
        </p>
      </LessonHeader>

      <LessonSection id="imperative" {...at(LOGIN, "const [isLoggedIn")}>
        <h2>手順を書くやり方（命令的）</h2>

        <p>
          ログイン状態によって、画面の 3 か所を変えたいとします。
          ヘッダーの名前、本文、ボタンの文字です。
        </p>

        <p>手順として書くと、こうなります。</p>

        <StaticCode
          lang="ts"
          code={`function login() {
  header.textContent = "さとうさん";
  body.textContent = "会員向けの内容が表示されています";
  button.textContent = "ログアウトする";
}

function logout() {
  header.textContent = "ゲスト";
  body.textContent = "ログインすると内容が表示されます";
  button.textContent = "ログインする";
}`}
        />

        <p>
          間違ってはいません。ただ、
          <strong>同じことを 2 回、逆向きに書いている</strong>のが気になります。
        </p>

        <p>
          そして表示する場所が 1 つ増えるたびに、
          <code>login</code> と <code>logout</code> の
          <strong>両方に</strong>書き足す必要があります。
          片方だけ直してしまうと、
          「ログアウトしたのにヘッダーだけ名前が残っている」という状態が生まれます。
        </p>
      </LessonSection>

      <LessonSection id="declarative" {...at(LOGIN, "{isLoggedIn ?", "}")}>
        <h2>あるべき姿を書くやり方（宣言的）</h2>

        <p>React では、手順を書きません。書くのはこれだけです。</p>

        <Callout variant="point" title="宣言的に書くとは">
          <p>
            <strong>状態がこうなら、画面はこう</strong>という
            <strong>対応関係</strong>だけを書くこと。
            そこへ至る手順は書かない。
          </p>
        </Callout>

        <StaticCode
          code={`<span>{isLoggedIn ? "さとうさん" : "ゲスト"}</span>`}
        />

        <p>
          「ログイン中なら名前、そうでなければゲスト」。
          これは<strong>手順ではなく、事実の記述</strong>です。
          いつ書き換えるか、という話が一切出てきません。
        </p>

        <DemoCard
          title="状態はひとつだけ"
          sourcePath={LOGIN}
          description="ボタンを押すと 3 か所が同時に変わる"
        >
          <LoginView />
        </DemoCard>

        <p>
          このデモが持っている状態は <code>isLoggedIn</code> ひとつだけです。
          <code>true</code> と <code>false</code> を切り替えているだけで、
          3 か所を書き換える処理はどこにもありません。
        </p>

        <StateToUiFigure />

        <p>
          表示する場所が 4 つに増えても、書き足すのは
          <strong>その 1 か所だけ</strong>です。
          「両方に書き足す」必要がないので、片方だけ直し忘れる事故が起きません。
        </p>
      </LessonSection>

      <LessonSection id="formula" {...at(LOGIN)}>
        <h2>画面は、状態から決まる</h2>

        <p>この考え方は、よくこう表現されます。</p>

        <StaticCode lang="ts" code={`UI = f(state)`} />

        <p>
          画面は、状態を渡すと結果が返ってくる<strong>関数のようなもの</strong>だ、という意味です。
          同じ状態なら、いつ何度描いても同じ画面になります。
        </p>

        <p>
          だから React では、画面を直接いじりません。
          <strong>状態を変えれば、画面は勝手についてくる</strong>からです。
        </p>

        <Callout variant="warn" title="ここでつまずく人が多い">
          <p>
            素の JavaScript に慣れていると、
            「この要素を書き換えたい」と考えてしまいがちです。
            React では、そこで一度立ち止まって
            <strong>「この表示を決めている状態は何か」</strong>を考えます。
          </p>
          <p>
            表示を変えたいのではなく、<strong>状態を変えたい</strong>。
            この発想の転換が、React を使ううえでいちばん大きな山です。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="quiz" {...at(LOGIN)}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="宣言的 UI とは、どういう書き方のこと？"
          options={[
            {
              label: "状態がこうなら画面はこう、という対応関係だけを書く",
              correct: true,
              explanation:
                "そこへ至る手順は書きません。手順は React が引き受けます。",
            },
            {
              label: "画面を書き換える手順を、順番どおりに書く",
              explanation:
                "それが命令的な書き方です。React ではその手順を書きません。",
            },
            {
              label: "型を宣言してから使うという書き方",
              explanation:
                "型の話ではありません。UI をどう記述するかという考え方の話です。",
            },
          ]}
        />

        <Quiz
          question="React で「ボタンの文字を変えたい」と思ったとき、まず何を考える？"
          options={[
            {
              label: "その文字を決めている状態は何か",
              correct: true,
              explanation:
                "表示は状態から決まります。変えるべきは表示ではなく状態のほうです。",
            },
            {
              label: "そのボタンをどうやって探して書き換えるか",
              explanation:
                "要素を探して書き換えるのは命令的なやり方です。React ではその作業自体が不要になります。",
            },
            {
              label: "書き換える処理をどの関数に書くか",
              explanation:
                "書き換える処理そのものを書きません。状態と表示の対応を書けば、更新は React が行います。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(LOGIN)}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            命令的 = 画面を<strong>どう変えるか</strong>の手順を書く
          </li>
          <li>
            宣言的 = 状態と画面の<strong>対応関係</strong>を書く
          </li>
          <li>
            対応を 1 か所書けば済むので、直し忘れによる食い違いが起きない
          </li>
          <li>
            React では「表示を変えたい」ではなく
            <strong>「状態を変えたい」</strong>と考える
          </li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
