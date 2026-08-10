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
import { Snapshot } from "./demos/snapshot";
import { Updater } from "./demos/updater";

const SLUG = "state-snapshot";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/state-snapshot/demos/snapshot.tsx", label: "snapshot.tsx" },
  { path: "lessons/state-snapshot/demos/updater.tsx", label: "updater.tsx" },
] as const;

const [SNAPSHOT, UPDATER] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          <code>setCount</code> を呼んだ直後に <code>count</code>{" "}
          を見ると、<strong>まだ古い値のまま</strong>です。
        </p>
        <p>
          これは不具合ではなく、React の設計です。
          ただ、知らないと必ず引っかかります。
          「3 回呼んだのに 1 しか増えない」という形で現れます。
        </p>
      </LessonHeader>

      <LessonSection id="broken" {...at(SNAPSHOT, "const addThree", "};")}>
        <h2>3 回呼んでも 1 しか増えない</h2>

        <p>
          <code>setCount(count + 1)</code> を 3 回並べれば 3 増えそうです。
          押してみてください。
        </p>

        <DemoCard
          title="3 回呼んだつもり"
          tone="bad"
          sourcePath={SNAPSHOT}
          showRenderCount
          description="1 ずつしか増えない"
        >
          <Snapshot />
        </DemoCard>

        <p>
          1 しか増えません。理由は、
          <strong>この関数の実行中、<code>count</code> がずっと同じ値だから</strong>です。
        </p>

        <StaticCode
          lang="ts"
          code={`// count が 0 のときに押すと…
setCount(count + 1); // setCount(0 + 1) → 1 にして、と依頼
setCount(count + 1); // setCount(0 + 1) → やっぱり 1 にして
setCount(count + 1); // setCount(0 + 1) → やっぱり 1 にして`}
        />

        <p>
          3 回とも「1 にしてください」と頼んでいます。
          結果が 1 になるのは当然です。
        </p>

        <Callout variant="point" title="光った回数を数えてみてください">
          <p>
            <code>setCount</code> を 3 回呼んでいるのに、
            カードが光るのは<strong>1 回だけ</strong>です。
            render の数字も 1 しか増えません。
          </p>
          <p>
            React は 3 回ぶんの依頼をまとめて処理し、
            <strong>描き直しは 1 回で済ませています</strong>。
            呼んだ回数と描き直された回数は、一致しません。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="why" {...at(SNAPSHOT, "const addThree")}>
        <h2>state は「その回の写真」</h2>

        <p>
          前の章でやったとおり、コンポーネントは state
          が変わるたびに実行し直されます。
        </p>

        <p>
          そして<strong>1 回の実行の間、state の値は変わりません</strong>。
          その実行が始まった時点の値のまま、最後まで固定されています。
          撮った写真が途中で変化しないのと同じです。
        </p>

        <Callout variant="point" title="なぜ固定されているのか">
          <p>
            もし実行の途中で値が変わったら、
            <strong>同じ関数の中なのに、前半と後半で違う値が使われる</strong>
            ことになります。
          </p>
          <p>
            上のほうでは 0、下のほうでは 1 を表示している画面ができてしまいます。
            固定されているからこそ、
            <strong>1 回の実行からは 1 つの画面しか生まれない</strong>と保証できます。
          </p>
        </Callout>

        <p>
          <code>setCount</code> は「次はこの値で実行してください」という
          <strong>予約</strong>です。いま動いている実行には影響しません。
        </p>
      </LessonSection>

      <LessonSection id="updater" {...at(UPDATER, "const addThree", "};")}>
        <h2>いまの値を使いたいときは関数を渡す</h2>

        <p>
          「1 増やす」のように<strong>いまの値をもとに決めたい</strong>ときは、
          値ではなく<strong>関数</strong>を渡します。
        </p>

        <StaticCode
          lang="ts"
          code={`setCount((current) => current + 1);`}
        />

        <p>
          こう書くと、React は更新するときに
          <strong>そのときの最新の値</strong>を <code>current</code> に入れて呼びます。
          自分で値を計算しないので、古い値を使ってしまう心配がありません。
        </p>

        <DemoCard
          title="関数を渡す形"
          tone="good"
          sourcePath={UPDATER}
          showRenderCount
          description="今度はちゃんと 3 増える"
        >
          <Updater />
        </DemoCard>

        <p>
          React は依頼を順番に適用します。
          0 に対して +1 して 1、その 1 に +1 して 2、その 2 に +1 して 3。
          <strong>積み上がる</strong>ので、3 増えます。
        </p>

        <h3>どちらを使えばいいか</h3>

        <ul>
          <li>
            <strong>いまの値を使う</strong>なら関数を渡す（+1、切り替え、追加など）
          </li>
          <li>
            <strong>関係のない値を入れる</strong>なら、そのまま渡してよい（リセット、入力値の反映など）
          </li>
        </ul>

        <p>
          迷ったら関数を渡す形にしておけば、まず間違いません。
        </p>
      </LessonSection>

      <LessonSection id="async" {...at(SNAPSHOT, "setCount(count + 1);")}>
        <h3>直後に読んでも変わっていない</h3>

        <StaticCode
          lang="ts"
          code={`const handleClick = () => {
  setCount(count + 1);
  console.log(count); // まだ古い値が出る
};`}
        />

        <p>
          「更新に時間がかかっているのでは」と思うかもしれませんが、違います。
          <strong>この実行における <code>count</code> は、最初から最後まで同じ値</strong>だからです。
          待っても変わりません。
        </p>

        <p>
          新しい値を使いたい処理があるなら、
          その値を変数に入れておくか、次の実行で扱います。
        </p>

        <StaticCode
          lang="ts"
          code={`const next = count + 1;
setCount(next);
console.log(next); // これなら新しい値`}
        />
      </LessonSection>

      <LessonSection id="quiz" {...at(UPDATER)}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="setCount(count + 1) を 3 回並べると、count はいくつ増える？"
          options={[
            {
              label: "1 だけ増える",
              correct: true,
              explanation:
                "1 回の実行の間 count は固定なので、3 回とも同じ値に対する依頼になります。最後の依頼だけが残ったのと同じ結果です。",
            },
            {
              label: "3 増える",
              explanation:
                "そうなるのは setCount((c) => c + 1) と関数を渡した場合です。値を渡す形では積み上がりません。",
            },
            {
              label: "エラーになる",
              explanation:
                "エラーにはなりません。意図と違う結果になるだけなので、気づきにくい問題です。",
            },
          ]}
        />

        <Quiz
          question="setCount((c) => c + 1) と書く利点は？"
          options={[
            {
              label: "更新時点の最新の値をもとに計算できる",
              correct: true,
              explanation:
                "自分で値を計算しないので、古い値を使ってしまう心配がありません。複数回呼んでも積み上がります。",
            },
            {
              label: "更新が速くなる",
              explanation:
                "速度は変わりません。使う値が「その実行時点の値」か「更新時点の最新値」かの違いです。",
            },
            {
              label: "state を直接書き換えられる",
              explanation:
                "直接書き換えているわけではありません。React に渡す依頼の形が違うだけです。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(UPDATER)}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            1 回の実行の間、state の値は<strong>固定されている</strong>
          </li>
          <li>
            だから <code>setCount</code> の直後に読んでも古い値のまま
          </li>
          <li>
            値を渡す形で複数回呼んでも<strong>積み上がらない</strong>
          </li>
          <li>
            いまの値をもとに決めたいときは
            <code>setCount((c) =&gt; c + 1)</code> と<strong>関数を渡す</strong>
          </li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
