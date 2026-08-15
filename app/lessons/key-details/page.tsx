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

const SLUG = "key-details";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  { path: "lessons/list-and-key/demos/member-row.tsx", label: "member-row.tsx" },
  { path: "lessons/list-and-key/demos/broken-list.tsx", label: "broken-list.tsx" },
  { path: "lessons/list-and-key/demos/fixed-list.tsx", label: "fixed-list.tsx" },
] as const;

const [ROW, BROKEN, FIXED] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          前の章で、<strong>key には id を使う</strong>という結論まで来ました。
          ふだん書くぶんには、それで足ります。
        </p>
        <p>
          この章は<strong>そのあとに必ず出てくる疑問</strong>を片づけます。
          「index を使ってはいけないの？」「key って props じゃないの？」
        </p>
        <p>読み流して、必要になったときに思い出せれば十分です。</p>
      </LessonHeader>

      <LessonSection id="beyond-input" {...at(ROW)}>
        <h2>これは入力欄だけの話ではない</h2>

        <p>
          分かりやすさのために入力欄を使いましたが、同じことは
          <strong>state を持つコンポーネント</strong>でも起きます。
        </p>

        <ul>
          <li>チェックを入れたはずの行と、別の行にチェックが付く</li>
          <li>開いていたアコーディオン（開閉するリスト）が、別の項目で開いたままになる</li>
          <li>アニメーションが途中から始まる、あるいは動かない</li>
        </ul>

        <p>
          React が「同じ行だ」と判断した箱の中身は、そのまま次のデータに引き継がれます。
          key を間違えると、これが全部ズレます。
        </p>

        <Callout variant="point" title="key はコンポーネントの同一性そのもの">
          <p>
            逆から言うと、<strong>key が変わると React はそれを別のコンポーネントとみなし、state ごと作り直します</strong>。
            この性質は、Part 4 の「useState の応用」で道具として使います。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="index-is-ok" {...at(BROKEN, "key={index}")}>
        <h2>index を key にしていい場合</h2>

        <p>
          いつでもダメというわけではありません。
          次の条件を<strong>全部</strong>満たすなら、index で問題ありません。
        </p>

        <ul>
          <li>並び替えが起きない</li>
          <li>途中への追加や削除が起きない（末尾に足すだけなら大丈夫）</li>
          <li>各行が入力欄や state を持っていない</li>
        </ul>

        <p>
          たとえば、固定のメニュー項目を並べるだけのリストなら index
          で十分です。そもそも順番が変わらないので、index
          は事実上そのデータ固有の値になっています。
        </p>

        <Callout variant="note">
          <p>
            とはいえ、最初は並び替えのなかったリストに、あとから並び替え機能が付くのはよくあることです。
            id があるなら id を使っておくほうが、あとで困りません。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="misconceptions" {...at(FIXED, "key={member.id}")}>
        <h2>よくある勘違い</h2>

        <h3>key は props ではない</h3>

        <p>
          key は React
          が内部で使うための特別な属性で、<strong>子コンポーネントには渡りません</strong>。
          子で受け取ろうとしても、そこには何も入っていません。
          行の中で id が必要なら、別の名前でもう一度渡します。
        </p>

        <StaticCode
          code={`// id を子でも使いたいときは、key とは別に渡す
<MemberRow key={member.id} id={member.id} name={member.name} />`}
        />

        <h3>一意でなければいけないのは「兄弟の中だけ」</h3>

        <p>
          ページ全体で一意である必要はありません。
          同じ <code>map</code> から出てきた要素どうしで重複していなければ大丈夫です。
          画面上の別々のリストで key が <code>1</code> どうしぶつかっていても、
          何の問題もありません。
        </p>

        <h3>key に Math.random() を使ってはいけない</h3>

        <p>
          一意な値がほしくて <code>Math.random()</code> や{" "}
          <code>Date.now()</code> を使いたくなることがありますが、これは最悪の選択です。
        </p>

        <StaticCode
          code={`// 絶対にやってはいけない
{members.map((member) => (
  <MemberRow key={Math.random()} name={member.name} />
))}`}
        />

        <p>
          描き直されるたびに違う値になるので、React
          は毎回「全部が知らない行だ」と判断します。
          つまり<strong>毎回すべての行が作り直されます</strong>。
          遅くなるうえに、入力中の文字も state も毎回消えます。
        </p>

        <p>
          key は<strong>同じデータなら毎回同じ値</strong>でなければ、
          名札としての意味がありません。
        </p>
      </LessonSection>

      <LessonSection id="quiz" {...at(FIXED, "key={member.id}")}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="index を key にしても問題が起きないのは、次のうちどれ？"
          options={[
            {
              label: "並び順が変わらず、各行が入力欄も state も持たないリスト",
              correct: true,
              explanation:
                "この条件なら、index は実質そのデータ固有の値と同じ意味になります。ただし、あとから並び替え機能が付く可能性は考えておきましょう。",
            },
            {
              label: "行数が 10 行以下の小さいリスト",
              explanation:
                "行数は関係ありません。3 行でも、先頭に 1 行足せば同じ問題が起きます。",
            },
            {
              label: "id を持っていないデータのリスト",
              explanation:
                "id がないことは index を使ってよい理由になりません。id がないなら、名前など重複しない値を key にするか、データを受け取った時点で id を振ります。",
            },
          ]}
        />
        <Quiz
          question="key に Math.random() を使うと何が起きる？"
          options={[
            {
              label: "毎回すべての行が作り直され、入力中の値も state も消える",
              correct: true,
              explanation:
                "描き直しのたびに key が変わるので、React はすべての行を「知らない行」とみなします。速度も落ちるうえ、入力途中の文字が消えます。",
            },
            {
              label: "key が必ず一意になるので、いちばん安全な書き方になる",
              explanation:
                "一意にはなりますが、key に求められているのは「一意であること」だけではなく「同じデータなら毎回同じであること」です。",
            },
            {
              label: "警告は消えるが、動作は index を使ったときと同じになる",
              explanation:
                "index よりさらに悪くなります。index は少なくとも並び順が変わらなければ安定しますが、Math.random() は毎回必ず変わります。",
            },
          ]}
        />

        <Quiz
          question="子コンポーネントの中で、その行の id を使いたい。どうする？"
          options={[
            {
              label: "key とは別に、id という props をもう一度渡す",
              correct: true,
              explanation:
                "key は React 専用の属性なので子には届きません。中で使いたい値は、別の名前で明示的に渡します。",
            },
            {
              label: "子で props.key として受け取る",
              explanation:
                "受け取れません。key は React が要素を照合するために使う特別な属性で、props には含まれないためです。",
            },
            {
              label: "key を付けるのをやめて、id だけを渡す",
              explanation:
                "id を渡すこと自体は正しいのですが、key を消すと React が行を照合できなくなり、この章で見たバグが起きます。両方必要です。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(FIXED, "key={member.id}")}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            key の影響は入力欄だけではない。
            <strong>state を持つ部品すべて</strong>に及ぶ
          </li>
          <li>
            index を key にしてよいのは
            <strong>並び替えも追加も削除も起きないとき</strong>だけ
          </li>
          <li>
            <strong>key は props ではない</strong>。子には届かない。
            必要なら id を別に渡す
          </li>
          <li>
            重複しなければよいのは<strong>兄弟の中だけ</strong>
          </li>
          <li>
            <code>Math.random()</code> は<strong>毎回別物になる</strong>ので使わない
          </li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
