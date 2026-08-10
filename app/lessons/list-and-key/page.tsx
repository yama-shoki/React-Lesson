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
import { BasicList } from "./demos/basic-list";
import { BrokenList } from "./demos/broken-list";
import { FixedList } from "./demos/fixed-list";
import {
  KeyMatchingById,
  KeyMatchingByIndex,
} from "./figures/key-matching";

const SLUG = "list-and-key";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

/** 右ペインに出すファイル。パスは app ディレクトリからの相対 */
const SOURCES = [
  { path: "lessons/list-and-key/demos/basic-list.tsx", label: "basic-list.tsx" },
  { path: "lessons/list-and-key/demos/member-row.tsx", label: "member-row.tsx" },
  { path: "lessons/list-and-key/demos/broken-list.tsx", label: "broken-list.tsx" },
  { path: "lessons/list-and-key/demos/fixed-list.tsx", label: "fixed-list.tsx" },
] as const;

const [BASIC, ROW, BROKEN, FIXED] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  /** 解説のこの部分では、どのファイルのどこを見せるか */
  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          配列をそのまま画面に並べる、というのは React
          でいちばんよく書く処理です。商品の一覧、コメントの一覧、検索結果。
          扱うデータが変わるだけで、やっていることは毎回同じです。
        </p>
        <p>
          そしてこれを書くと、React は必ず
          <strong>「key を付けてください」</strong>と言ってきます。
          とりあえず index を入れると警告は消えます。多くの人がそうしています。
        </p>
        <p>
          ですがそれをやると、いつか奇妙なバグに出会います。
          <strong>入力欄に打った文字が、別の行に移動する</strong>のです。
          この章では、それを実際に壊しながら、なぜ起きるのかを見ていきます。
        </p>
      </LessonHeader>

      <LessonSection id="map" {...at(BASIC, "{members.map", "))}")}>
        <h2>まず、配列を画面に並べる</h2>

        <p>
          配列を画面に出すときは <code>map</code> を使います。
          <code>map</code> は「配列の要素をひとつずつ別のものに作り変えて、新しい配列を返す」関数でした。
          React では、この「別のもの」を JSX にします。
        </p>

        <p>
          JSX の配列を <code>{"{ }"}</code> の中に置くと、React
          はそれを順番に並べて表示します。3 つの要素が入った配列を渡せば、3 行出ます。
          <code>for</code> 文を書く必要はありません。
        </p>

        <DemoCard title="配列を並べただけのリスト" sourcePath={BASIC}>
          <BasicList />
        </DemoCard>

        <p>
          右のコードを見てください。<code>li</code> に{" "}
          <code>key={"{member.id}"}</code> という見慣れない属性が付いています。
          これがこの章の主役です。
        </p>
      </LessonSection>

      <LessonSection id="why-key" {...at(BASIC, "key={member.id}")}>
        <h2>key を書かないと警告が出る</h2>

        <p>
          この <code>key</code> を消すと、ブラウザのコンソールに警告が出ます。
        </p>

        <StaticCode
          lang="bash"
          code={`Each child in a list should have a unique "key" prop.
See https://react.dev/link/warning-keys for more information.`}
        />

        <p>
          これは書き方の作法の問題ではありません。
          <strong>key がないと React は正しく動けません。</strong>
          なぜそうなのかを理解するには、React
          が画面を更新するときに何をしているかを知る必要があります。
        </p>

        <h3>React は変わったところだけを描き直す</h3>

        <p>
          state が変わると、React はコンポーネントをもう一度実行して、新しい JSX
          を作ります。このとき React は
          <strong>画面を全部作り直すことはしません</strong>。
          前回の結果と今回の結果を見比べて、変わったところだけを実際の画面に反映します。
        </p>

        <p>
          全部作り直してしまうと、入力中の文字が消えたり、スクロール位置が飛んだりして、
          とても使えたものではないからです。
        </p>

        <p>
          ここで、リストが問題になります。3 行だったリストが 4 行になったとき、React
          はどう解釈すればいいでしょうか。
        </p>

        <ul>
          <li>先頭に 1 行挿入されて、もとの 3 行がひとつずつ下にずれた</li>
          <li>もとの 3 行の中身が全部書き換わって、末尾に 1 行増えた</li>
        </ul>

        <p>
          <strong>見えている結果はどちらも同じです。</strong>
          けれども、どちらと解釈するかで、画面に対して行う操作はまったく変わります。
          そして React には、これを自力で判断する材料がありません。
        </p>

        <Callout variant="point" title="key とは何か">
          <p>
            key は、<strong>「この行はこのデータのものだ」という名札</strong>です。
            React は前回と今回で同じ key を持つものを見つけると、
            「これは同じ行だ、中身だけ更新すればいい」と判断します。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="broken" {...at(BROKEN, "{members.map", "))}")}>
        <h2>index を key にすると壊れる</h2>

        <p>
          配列には最初から通し番号があります。<code>map</code> の 2
          番目の引数で受け取れる index です。これを key
          にすれば一意になりますし、警告も消えます。
          いちばん手軽な方法に見えます。
        </p>

        <p>実際に何が起きるか、下のデモで確かめてください。</p>

        <Callout variant="warn" title="この順番で試してください">
          <ul>
            <li>「さとう」の行のメモ欄に、なにか文字を打つ</li>
            <li>「先頭にメンバーを追加」を押す</li>
            <li>いま打った文字が、どの行に付いているか見る</li>
          </ul>
        </Callout>

        <DemoCard
          title="key に index を使ったリスト"
          tone="bad"
          sourcePath={BROKEN}
          showRenderCount
          description="さとうに書いたはずのメモが、やまだの行に残ってしまう"
        >
          <BrokenList />
        </DemoCard>

        <p>
          打った文字は「さとう」ではなく、新しく入ってきた
          <strong>「やまだ」の行に付いたまま</strong>になったはずです。
          名前だけが入れ替わって、メモは動きませんでした。
        </p>
      </LessonSection>

      <LessonSection id="why-broken" {...at(BROKEN, "key={index}")}>
        <h2>なぜそうなるのか</h2>

        <p>
          index を key にするということは、key
          の意味が<strong>「上から何番目か」</strong>になるということです。
          データが持っている情報ではなく、並び順そのものです。
        </p>

        <p>
          先頭に 1 人追加すると、さとうは 0 番目から 1 番目に移動します。
          ところが React から見えているのは、こうです。
        </p>

        <KeyMatchingByIndex />

        <p>
          前回の 0 番も、今回の 0 番も、key はどちらも <code>0</code> です。
          React はこれを<strong>同じ行</strong>だと判断します。
          そして「0 番の行は、名前が さとう から やまだ に変わっただけだ」と解釈し、
          さとうの行として使っていた画面上の要素をそのまま流用して、名前の部分だけを書き換えます。
        </p>
      </LessonSection>

      <LessonSection id="input-value" {...at(ROW, "<Input")}>
        <h3>流用された箱の中身は残る</h3>

        <p>ここで効いてくるのが、メモ欄です。</p>

        <p>
          ここに打った文字は、
          <strong>React が管理している値ではありません</strong>。
          ブラウザの入力欄そのものが内部で持っている値です。
          React は名前の部分しか書き換えないので、
          <strong>文字はその場に残ります</strong>。
        </p>

        <Callout variant="note">
          <p>
            メモ欄には <code>Input</code> という部品を使っていますが、中身は
            ふつうの <code>&lt;input&gt;</code> です。
            見た目を整えるためにあらかじめ用意してあるものなので、
            ここでは「入力欄」と読んでもらって大丈夫です。
          </p>
        </Callout>

        <p>
          結果として、さとうに書いたメモが、やまだの行に付いているように見える。
          これがあのバグの正体です。
        </p>
      </LessonSection>

      <LessonSection id="fixed" {...at(FIXED, "{members.map", "))}")}>
        <h2>直し方</h2>

        <p>
          直すのは簡単です。
          <strong>そのデータ自身が持っている、変わらない値</strong>を key
          にします。今回のデータには <code>id</code> があるので、それを使います。
        </p>

        <DemoCard
          title="key に id を使ったリスト"
          tone="good"
          sourcePath={FIXED}
          showRenderCount
          description="さっきと同じ手順で試してみてください"
        >
          <FixedList />
        </DemoCard>

        <p>
          今度はメモがさとうの行に付いてきました。
          コードの違いは <code>key</code> に何を渡すか、その 1 か所だけです。
        </p>

        <KeyMatchingById />

        <p>
          key が <code>member.id</code> なら、さとうはいつでも key
          が <code>1</code> です。先頭に入ってきたやまだは <code>4</code>、
          これまでに登場したことのない値です。
        </p>

        <p>
          React は「key が 1 の行は前回もあった。位置が変わっただけだ」と判断して、
          その行を丸ごと下に移動させます。
          メモ欄もさとうの行と一緒に移動するので、打った文字も付いてきます。
          key が 4 の行は初めて見るので、新しく作られます。
        </p>
      </LessonSection>

      <LessonSection id="beyond-input" {...at(ROW)}>
        <h2>これは入力欄だけの話ではない</h2>

        <p>
          分かりやすさのために入力欄を使いましたが、同じことは
          <strong>state を持つコンポーネント</strong>でも起きます。
        </p>

        <ul>
          <li>チェックを入れたはずの行と、別の行にチェックが付く</li>
          <li>開いていたアコーディオンが、別の項目で開いたままになる</li>
          <li>アニメーションが途中から始まる、あるいは動かない</li>
        </ul>

        <p>
          React が「同じ行だ」と判断した箱の中身は、そのまま次のデータに引き継がれます。
          key を間違えると、これが全部ズレます。
        </p>

        <Callout variant="point" title="key はコンポーネントの同一性そのもの">
          <p>
            逆から言うと、<strong>key が変わると React はそれを別のコンポーネントとみなし、state ごと作り直します</strong>。
            これは知っておくと便利な性質で、
            「このフォームを初期状態に戻したい」というときに、
            わざと key を変えて作り直させる、という書き方もできます。
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

      <LessonSection id="quiz" {...at(FIXED, "{members.map", "))}")}>
        <h2>理解できたか確かめる</h2>

        <p>手を動かす必要はありません。選んで、解説を読んでください。</p>

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
            key は React に「どの行がどのデータのものか」を伝える<strong>名札</strong>
          </li>
          <li>
            React は key を見て、画面上の要素を<strong>再利用するか作り直すか</strong>を決める
          </li>
          <li>
            index は「並び順」であってデータの情報ではないので、順番が変わると壊れる
          </li>
          <li>
            各行が入力欄や state を持っているときに、その壊れ方がはっきり出る
          </li>
          <li>迷ったら、そのデータ自身が持つ id を使う</li>
        </ul>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
