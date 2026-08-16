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
import Link from "next/link";
import { ManyUseStates } from "./demos/many-usestates";
import { MultiStepForm } from "./demos/multi-step-form";

const SLUG = "multi-step-form";

export const metadata: Metadata = {
  title: findLesson(SLUG)?.title,
};

const SOURCES = [
  {
    path: "lessons/multi-step-form/demos/many-usestates.tsx",
    label: "many-usestates.tsx",
  },
  {
    path: "lessons/multi-step-form/demos/form-store.ts",
    label: "form-store.ts",
  },
  {
    path: "lessons/multi-step-form/demos/multi-step-form.tsx",
    label: "multi-step-form.tsx",
  },
] as const;

const [MANY, STORE, FORM] = SOURCES.map((source) => source.path);

export default async function Page() {
  const snippets = await loadSnippets(SOURCES);

  const at = (id: string, from?: string, to?: string) =>
    focus(snippets, id, from, to);

  return (
    <LessonShell snippets={snippets}>
      <LessonHeader slug={SLUG}>
        <p>
          最後は<strong>申込フォーム</strong>です。3 画面に分かれていて、
          最後にサーバーへ送ります。
        </p>
        <p>
          この章がいちばん重いですが、
          <strong>難しい概念は 1 つも出てきません</strong>。
          重いのは、これまでの道具が
          <strong>いっぺんに必要になる</strong>からです。
        </p>
      </LessonHeader>

      <LessonSection id="many" {...at(MANY, "const [email, setEmail]")}>
        <h2>項目が増えると、何が起きるか</h2>

        <p>
          まず、項目を <code>useState</code> で 1 つずつ持ってみます。
          6 項目なら 6 行です。
        </p>

        <StaticCode
          lang="ts"
          code={`const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [name, setName] = useState("");
const [age, setAge] = useState("");
const [zip, setZip] = useState("");
const [note, setNote] = useState("");`}
        />

        <DemoCard
          title="6 項目を useState で持った版"
          tone="bad"
          sourcePath={MANY}
          showRenderCount
          description="どこか 1 つに打って、3 つの箱を見る"
        >
          <ManyUseStates />
        </DemoCard>

        <p>
          <strong>1 文字打つだけで、3 つの箱すべてが光ります。</strong>
          打っていない項目まで、毎回描き直されています。
          Part 7 でやったとおり、
          state を持っているのが<strong>いちばん上だから</strong>です。
        </p>

        <p>
          6 項目ならまだ気になりません。
          ですが実務のフォームは 20 項目を超えることがあります。
          <strong>1 文字ごとに 20 項目ぶん描き直す</strong>と、
          さすがに引っかかりを感じ始めます。
        </p>

        <Callout variant="warn" title="もう 1 つの問題">
          <p>
            <code>useState</code> を並べると、
            <strong>state どうしの関係が書けません</strong>。
            「3 画面目に進んだら 1 画面目の内容は確定」
            「送信中は戻れない」といった決まりが、
            あちこちの <code>setXxx</code> に散らばります。
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="store" {...at(STORE, "submitAccount:")}>
        <h2>「何が起きたか」で書き直す</h2>

        <p>
          画面の状態をひとまとめにして、
          <strong>起きたことの名前</strong>で更新します。
          置き場所は <Link href="/lessons/zustand">Zustand</Link>{" "}
          のストアにします。
        </p>

        <StaticCode
          lang="ts"
          code={`export const useFormStore = create((set, get) => ({
  step: "account",
  account: null,
  profile: null,
  status: "editing",

  submitAccount: (values) => set({ account: values, step: "profile" }),
  submitProfile: (values) => set({ profile: values, step: "confirm" }),
  goBack: () => set(...),
  send: async () => { ... },
}));`}
        />

        <p>
          <code>setStep</code> や <code>setAccount</code> のような
          setter を並べていないところが要点です。
          並べてしまうと、
          <strong>「次へ進む」が呼び出し側の 2 行の組み合わせ</strong>になり、
          片方を忘れた瞬間に画面が壊れます。
        </p>

        <StaticCode
          lang="ts"
          code={`// ✕ 呼ぶ側が 2 つを正しく組み合わせる必要がある
setAccount(values);
setStep("profile");

// ○ 起きたことを 1 つ伝えるだけ
submitAccount(values);`}
        />

        <p>
          「アカウントが入力された」なら、
          <strong>保存して次へ進む</strong>のは決まりきっています。
          その決まりを<strong>ストアの中に閉じ込めれば</strong>、
          呼ぶ側が間違えようがありません。
        </p>

        <Callout variant="point" title="これは useReducer と同じ考え方">
          <p>
            <Link href="/lessons/usereducer">Part 4 の useReducer</Link>{" "}
            でやった「どう変えるかではなく、何が起きたかを伝える」が、
            そのまま当てはまります。
          </p>
          <p>
            違うのは<strong>置き場所と配り方</strong>だけです。
            <code>useReducer</code> は画面の中に持って props で配る。
            ストアは外に置いて、どこからでも読む。
            <strong>考え方は変わりません。</strong>
          </p>
        </Callout>

        <Callout variant="note" title="通信もストアに置ける">
          <p>
            <code>send</code> は <code>async</code> な関数として
            ストアの中に置いてあります。
            画面側は <code>send()</code> を呼ぶだけで、
            <strong>成功・失敗の判断はストアが持ちます</strong>。
          </p>
          <p>
            <code>useReducer</code> だと、reducer は純粋関数でなければ
            ならないので、通信は外に書く必要がありました。
            <strong>そこは書きやすくなっています。</strong>
          </p>
        </Callout>
      </LessonSection>

      <LessonSection id="rhf" {...at(FORM, "const accountSchema")}>
        <h2>入力そのものは、ライブラリに任せる</h2>

        <p>
          state の設計はできました。
          では<strong>入力欄 1 つ 1 つ</strong>はどうするか。
          ここは Part 10 の React Hook Form に任せます。
        </p>

        <StaticCode
          lang="ts"
          code={`const accountSchema = z.object({
  email: z.email("メールアドレスの形式が正しくありません"),
  password: z.string().min(8, "8 文字以上で入力してください"),
});`}
        />

        <p>
          画面ごとに決まりを分けて書けるのが利点です。
          <strong>1 画面目を通らなければ 2 画面目に進めない</strong>ので、
          検査も画面ごとで足ります。
        </p>

        <p>
          そして React Hook Form は
          <strong>打つたびに描き直しません</strong>。
          さきほどの版で全部光っていたのが、ここで効いてきます。
        </p>
      </LessonSection>

      <LessonSection id="fixed" {...at(FORM, "const step = useFormStore")}>
        <h2>組み合わせた版</h2>

        <DemoCard
          title="ストアと React Hook Form を組み合わせた版"
          tone="good"
          sourcePath={FORM}
          showRenderCount
          description="3 画面を進んで、送信まで試す"
        >
          <MultiStepForm />
        </DemoCard>

        <p>試すことは 4 つです。</p>

        <ul>
          <li>
            <strong>打ってみる</strong> …{" "}
            打っている間、箱は光りません。
            カードの render も増えません
          </li>
          <li>
            <strong>空のまま「次へ」</strong> …{" "}
            エラーが出て、先に進みません
          </li>
          <li>
            <strong>戻る</strong> …{" "}
            1 つ前の画面に戻ります
          </li>
          <li>
            <strong>送信する</strong> …{" "}
            送信中はボタンが押せなくなります（Part 9 の二重送信の話）
          </li>
        </ul>

        <Callout variant="warn" title="ストアは画面を離れても残る">
          <p>
            ストアはコンポーネントの外にあるので、
            <strong>別のページへ移って戻ってきても、中身はそのまま</strong>です。
            <code>useState</code> や <code>useReducer</code> なら、
            画面から消えた時点で初期化されていました。
          </p>
          <p>
            入力の続きができるという意味では利点ですが、
            <strong>意図しない持ち越し</strong>にもなります。
            このデモは何度でも試せるように、
            離れるときに初期化するようにしてあります。
          </p>
        </Callout>

        <Callout variant="note" title="わざと失敗させるには">
          <p>
            名前に<strong>「エラー」</strong>という文字を含めると、
            サーバーが 500 を返します。
            送信が失敗したときの表示を確かめられます。
          </p>
        </Callout>

        <p>
          描き直しの範囲が、はっきり分かれました。
          <strong>打っている間は誰も描き直されません</strong>。
          描き直されるのは<strong>画面が切り替わったときだけ</strong>です。
          変わるべきときにだけ変わる、という状態です。
        </p>
      </LessonSection>

      <LessonSection id="status" {...at(STORE, "status:")}>
        <h2>送信中かどうかも、同じ入れ物に入れる</h2>

        <StaticCode
          lang="ts"
          code={`type FormStore = {
  step: Step;
  account: {...} | null;
  profile: {...} | null;
  status: "editing" | "sending" | "done" | "error";
  message: string;
};`}
        />

        <p>
          <code>isSending</code> と <code>isDone</code> と{" "}
          <code>hasError</code> を並べていないところを見てください。
          Part 4「useState の使い方いろいろ」でやった
          <strong>真偽値を並べない</strong>形です。
        </p>

        <p>
          真偽値を 3 つ持つと、
          <strong>「送信中なのに完了もしている」</strong>という
          ありえない組み合わせが書けてしまいます。
          1 つの <code>status</code> にまとめれば、
          <strong>ありえない状態が存在できません</strong>。
        </p>
      </LessonSection>

      <LessonSection id="quiz" {...at(STORE, "submitProfile:")}>
        <h2>理解できたか確かめる</h2>

        <Quiz
          question="ストアの更新関数を setStep や setAccount ではなく submitAccount という名前にするのはなぜ？"
          options={[
            {
              label: "「何が起きたか」を伝えれば、どう変えるかはストアが決められるから",
              correct: true,
              explanation:
                "呼ぶ側は出来事を 1 つ伝えるだけで済みます。「保存して次へ進む」という決まりがストアの中に 1 か所だけあるので、呼ぶ側が組み合わせを間違えようがありません。",
            },
            {
              label: "そのほうが短く書けるから",
              explanation:
                "長さはあまり変わりません。変わるのは、決まりがどこに書かれているかです。",
            },
            {
              label: "ストアでは setter を作れないから",
              explanation:
                "作ろうと思えば作れます。作らないのは、作ると useState を並べたのと同じことになるからです。",
            },
          ]}
        />

        <Quiz
          question="React Hook Form を使うと、打っている間にカードが光らなくなるのはなぜ？"
          options={[
            {
              label: "入力中の値を state に持たず、入力欄そのものに持たせているから",
              correct: true,
              explanation:
                "state が変わらないので、描き直しも起きません。値が必要になるのは送信するときだけで、そのときにまとめて読み取ります。",
            },
            {
              label: "React Hook Form が内部で memo を使っているから",
              explanation:
                "memo は関係ありません。そもそも state を更新していないので、止める必要すらありません。",
            },
            {
              label: "入力が debounce されているから",
              explanation:
                "遅らせているのではありません。打っている間、React はそもそも関与していません。",
            },
          ]}
        />

        <Quiz
          question="status を 1 つの文字列にして、真偽値を 3 つ並べないのはなぜ？"
          options={[
            {
              label: "ありえない組み合わせが、書けなくなるから",
              correct: true,
              explanation:
                "真偽値 3 つなら 8 通りの組み合わせが書けますが、実際にありうるのは 4 通りです。1 つにまとめれば、残りの 4 通りは存在しようがありません。",
            },
            {
              label: "文字列のほうがメモリを使わないから",
              explanation:
                "その差は問題になりません。理由は、ありえない状態を作れなくすることです。",
            },
            {
              label: "ストアでは真偽値を扱えないから",
              explanation:
                "扱えます。これはライブラリの制約ではなく、状態の設計の話です。",
            },
          ]}
        />
      </LessonSection>

      <LessonSection id="summary" {...at(STORE, "send: async ()")}>
        <h2>この章のまとめ</h2>

        <ul>
          <li>
            項目が増えたら、<code>useState</code> を並べずに
            <strong>ひとまとめ</strong>にする
          </li>
          <li>
            更新は<strong>「何が起きたか」</strong>で伝える。
            決まりはストアの中に 1 か所だけ置く
          </li>
          <li>
            通信もストアに置ける。画面側は<strong>呼ぶだけ</strong>
          </li>
          <li>
            入力欄そのものは<strong>ライブラリに任せる</strong>。
            打つたびの描き直しがなくなる
          </li>
          <li>
            送信中・完了・失敗は<strong>1 つの status</strong> に。
            真偽値を並べない
          </li>
        </ul>

        <Callout variant="note" title="この章で使った Part">
          <p>
            Part 0（union 型）、Part 3（イベント）、
            Part 4（何が起きたかで書く・真偽値を並べない・最小限の state）、
            Part 5（入力チェック）、Part 7（描き直しの範囲）、
            Part 9（Zustand・データを送る・二重送信）、
            Part 10（React Hook Form）。
          </p>
        </Callout>
      </LessonSection>

      <LessonFooter slug={SLUG} />
    </LessonShell>
  );
}
