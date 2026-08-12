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
          にすれば重複しない（一意）になりますし、警告も消えます。
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
          <strong>React が管理している値ではありません</strong>
          （この話は Part 5 の「制御コンポーネント」で正面から扱います）。
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

      <LessonSection id="quiz" {...at(FIXED, "{members.map", "))}")}>
        <h2>理解できたか確かめる</h2>

        <p>手を動かす必要はありません。選んで、解説を読んでください。</p>

        

        

        <Quiz
          question="index を key にすると、なぜメモの内容が別の行に付いてしまう？"
          options={[
            {
              label: "React が「同じ key = 同じもの」と判断して、箱を流用するから",
              correct: true,
              explanation:
                "並び替えても index は 0, 1, 2 のままです。React から見ると「中身が書き換わっただけ」なので、入力欄の箱はそのまま使い回されます。",
            },
            {
              label: "index が数値なので、React が扱えないから",
              explanation:
                "数値でも問題ありません。悪いのは「並び替えても値が変わらない」ことです。",
            },
            {
              label: "React のバグ",
              explanation:
                "バグではありません。key を目印として信じた結果、そのとおりに動いています。",
            },
          ]}
        />

        <Quiz
          question="key は何のためにある？"
          options={[
            {
              label: "React が「前回のどれと同じものか」を見分けるため",
              correct: true,
              explanation:
                "見分けがつけば、変わったところだけを直せます。中身を全部見比べるより、はるかに速く正確です。",
            },
            {
              label: "画面に順番を表示するため",
              explanation:
                "key は画面に出ません。React が内部で使う目印です。",
            },
            {
              label: "配列を並び替えるため",
              explanation:
                "並び替えるのはこちらのコードです。key は結果を見分けるための目印にすぎません。",
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
