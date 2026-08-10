/**
 * 教材全体の目次。
 *
 * サイドバー・トップページの目次・レッスン下部の「前へ / 次へ」は
 * すべてこのファイルを唯一の情報源にしている。
 * ページを増やすときは、ここに 1 行足してから実ファイルを作る。
 */

export type Lesson = {
	/** URL の末尾。/lessons/<slug> になる */
	slug: string;
	/** サイドバーと目次に出る見出し */
	title: string;
	/** 目次でタイトルの下に出る一言。「何が分かるようになるか」を書く */
	summary: string;
	/** まだ書いていないページは false。サイドバーでグレーアウトする */
	ready?: boolean;
};

export type Part = {
	/** "Part 0" などの表示用ラベル */
	label: string;
	title: string;
	/** その Part で何を身につけるのか */
	summary: string;
	lessons: Lesson[];
};

export const curriculum: Part[] = [
	{
		label: "Part 0",
		title: "React の前に",
		summary:
			"React のコードは JavaScript でできている。ここが曖昧なままだと、この先ずっと「なんとなく」で読むことになる。",
		lessons: [
			{
				slug: "variables",
				title: "変数と const",
				summary: "なぜ React では let をほとんど使わないのか",
				ready: true,
			},
			{
				slug: "functions",
				title: "関数を値として扱う",
				summary: "「関数を渡す」が分かると onClick が読めるようになる",
				ready: true,
			},
			{
				slug: "array-map",
				title: "配列の map",
				summary: "リスト表示のすべてがここから始まる",
				ready: true,
			},
			{
				slug: "destructuring",
				title: "分割代入とスプレッド構文",
				summary: "props の正体を読み解くための前提知識",
				ready: true,
			},
			{
				slug: "truthy-falsy",
				title: "truthy / falsy と && || ??",
				summary: "条件によって出し分けるための土台",
				ready: true,
			},
			{
				slug: "typescript-basics",
				title: "TypeScript のさわり",
				summary: "型があると、なぜ書くのが楽になるのか",
				ready: true,
			},
		],
	},
	{
		label: "Part 1",
		title: "React の世界観",
		summary:
			"React は「DOM を操作するライブラリ」ではない。ここの発想の切り替えが最初の山になる。",
		lessons: [
			{
				slug: "why-react",
				title: "なぜ React を使うのか",
				summary: "素の JavaScript で同じものを作って比べてみる",
				ready: true,
			},
			{
				slug: "declarative-ui",
				title: "宣言的 UI",
				summary: "「UI は状態の写像である」の意味",
				ready: true,
			},
			{
				slug: "jsx",
				title: "JSX と TSX",
				summary: "HTML に見えるが HTML ではない。その正体",
				ready: true,
			},
		],
	},
	{
		label: "Part 2",
		title: "コンポーネントと props",
		summary:
			"React で作るものは、突き詰めると「関数」と「その引数」でしかない。",
		lessons: [
			{
				slug: "components",
				title: "コンポーネントは関数である",
				summary: "画面の部品を関数として切り出す",
				ready: true,
			},
			{
				slug: "props",
				title: "props と型のつけ方",
				summary: "部品に情報を渡す。必須と任意の書き分け",
				ready: true,
			},
			{
				slug: "props-readonly",
				title: "props は書き換えられない",
				summary: "書き換えたら何が起きるのか、実際に壊してみる",
				ready: true,
			},
			{
				slug: "children",
				title: "children の正体",
				summary: "タグで囲んだ中身が、なぜ props として届くのか",
				ready: true,
			},
			{
				slug: "composition",
				title: "合成という考え方",
				summary: "継承ではなく組み合わせで作る理由",
				ready: true,
			},
		],
	},
	{
		label: "Part 3",
		title: "画面に動きをつける",
		summary:
			"クリックに反応する、条件で出し分ける、配列を並べる。この 3 つで大半の画面は作れる。",
		lessons: [
			{
				slug: "events",
				title: "イベントハンドラ",
				summary: "onClick に渡すのは「関数」であって「実行結果」ではない",
				ready: true,
			},
			{
				slug: "conditional-rendering",
				title: "条件によって出し分ける",
				summary: "&& を使うと画面に 0 が出てしまう問題",
				ready: true,
			},
			{
				slug: "list-and-key",
				title: "リストと key",
				summary: "key を間違えると、入力した文字が別の行に移動する",
				ready: true,
			},
		],
	},
	{
		label: "Part 4",
		title: "状態 (state)",
		summary:
			"React でいちばん重要な概念。ここを丁寧にやると、この先が全部つながる。",
		lessons: [
			{
				slug: "usestate",
				title: "useState",
				summary: "なぜ普通の変数ではダメなのか",
				ready: true,
			},
			{
				slug: "state-snapshot",
				title: "state は「その瞬間の写真」",
				summary: "setState した直後に値が変わっていない理由",
				ready: true,
			},
			{
				slug: "minimal-state",
				title: "state は最小限にする",
				summary: "計算で求まる値を state にしてはいけない",
				ready: true,
			},
			{
				slug: "lifting-state",
				title: "state のリフトアップ",
				summary: "2 つの部品で同じ値を共有したくなったら",
				ready: true,
			},
			{
				slug: "immutable-state",
				title: "オブジェクトと配列の更新",
				summary: "push してはいけない。なぜ毎回新しく作るのか",
				ready: true,
			},
		],
	},
	{
		label: "Part 5",
		title: "フォーム",
		summary: "入力を受け取るという、アプリで最も頻繁に書く処理。",
		lessons: [
			{
				slug: "controlled-input",
				title: "制御コンポーネント",
				summary: "input の値を React が持つということ",
				ready: true,
			},
			{
				slug: "form-validation",
				title: "入力チェック",
				summary: "型と実行時チェックを両立させる",
				ready: true,
			},
		],
	},
	{
		label: "Part 6",
		title: "副作用 (useEffect)",
		summary: "いちばん誤用されるフック。まず「使わなくて済む方法」から学ぶ。",
		lessons: [
			{
				slug: "useeffect",
				title: "useEffect の役割",
				summary: "React の外側と同期をとるための道具",
				ready: true,
			},
			{
				slug: "you-might-not-need-effect",
				title: "その useEffect は要らない",
				summary: "書きがちなアンチパターンを 4 つ潰す",
				ready: true,
			},
			{
				slug: "effect-loop",
				title: "無限ループにしない",
				summary: "依存配列に入れた値を、その中で更新してはいけない",
				ready: true,
			},
			{
				slug: "cleanup",
				title: "クリーンアップ",
				summary: "後片付けを書かないと何が漏れるのか",
				ready: true,
			},
		],
	},
	{
		label: "Part 7",
		title: "レンダリングの仕組み",
		summary:
			"「再レンダリング」が実際に何をしているのかを見る。ここから先は目に見えない話が増える。",
		lessons: [
			{
				slug: "rendering",
				title: "再レンダリングとは何か",
				summary: "画面が描き直されるまでに起きていること",
				ready: true,
			},
			{
				slug: "render-triggers",
				title: "何が再レンダリングを起こすか",
				summary: "props が変わったから、ではない",
				ready: true,
			},
		],
	},
	{
		label: "Part 8",
		title: "パフォーマンス",
		summary:
			"遅くなってから使う道具たち。先回りして使うと、かえって読みにくくなる。",
		lessons: [
			{
				slug: "memo",
				title: "memo",
				summary: "再レンダリングを止める",
				ready: true,
			},
			{
				slug: "children-optimization",
				title: "children で切り離す",
				summary: "memo を使わずに、描き直しの範囲を狭める",
				ready: true,
			},
			{
				slug: "usememo",
				title: "useMemo",
				summary: "重い計算を毎回やらせない",
				ready: true,
			},
			{
				slug: "usecallback",
				title: "useCallback",
				summary: "関数を毎回作り直さない",
				ready: true,
			},
			{
				slug: "react-compiler",
				title: "React Compiler",
				summary: "上の 3 つが、そのうち要らなくなる話",
				ready: true,
			},
		],
	},
	{
		label: "Part 9",
		title: "state を共有する",
		summary: "アプリが大きくなったときに、どこに状態を置くか。",
		lessons: [
			{
				slug: "context",
				title: "Context",
				summary: "バケツリレーをやめる",
				ready: true,
			},
			{
				slug: "context-performance",
				title: "Context と再レンダリング",
				summary: "1 つの Context に詰め込むと何が起きるか",
				ready: true,
			},
			{
				slug: "url-state",
				title: "URL に state を置く",
				summary: "リロードしても消えない状態",
			},
			{
				slug: "server-state",
				title: "サーバーのデータ",
				summary: "取得したデータは state とは別物として扱う",
			},
		],
	},
];

/** サイドバーや前後ナビ用に、全レッスンを平坦な配列にしたもの */
export const allLessons = curriculum.flatMap((part) =>
	part.lessons.map((lesson) => ({
		...lesson,
		partLabel: part.label,
		partTitle: part.title,
	})),
);

export type FlatLesson = (typeof allLessons)[number];

export const findLesson = (slug: string) =>
	allLessons.find((lesson) => lesson.slug === slug);

/** 前後ナビ。まだ書いていないページは飛ばす */
export const getNeighbors = (slug: string) => {
	const readyLessons = allLessons.filter((lesson) => lesson.ready);
	const index = readyLessons.findIndex((lesson) => lesson.slug === slug);

	return {
		prev: index > 0 ? readyLessons[index - 1] : undefined,
		next: index >= 0 ? readyLessons[index + 1] : undefined,
	};
};
