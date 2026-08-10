<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# このリポジトリについて

React + TypeScript の入門教材。読者は **JavaScript もあやしいレベル**を想定している。
「動けばいい」ではなく「なぜそう動くのか」まで説明することを目的にしている。

## パッケージマネージャ

**bun** を使う。`npm` / `pnpm` は使わない。

## スタックの注意点

- **shadcn/ui は Base UI 版**（Radix ではない）。`asChild` は存在せず、
  要素を差し替えるときは `render={<Link href="..." />}` を使う。
  コンポーネント追加時も `-b radix` は付けない。
- **React Compiler は意図的に無効**。Part 8 で `useMemo` / `useCallback` を
  手で書く意味を説明するため。教材の都合なので勝手に有効化しない。
- ダークモードは `next-themes` で OS 設定に追従する。画面上の切り替えボタンは置いていない。

## 教材を書くときの決まり

### ページの構成

1 ページは必ずこの流れで書く。

```
概念の説明 → 最小の動く例 → ❌うまくいかない例 → ✅直した例 → ミニクイズ → まとめ
```

読者に手を動かさせる演習は作らない。読んで理解できることを優先する。

### レイアウト

- 左が解説、右がコード。読み進めると右のコードが自動で切り替わる。
- 切り替えは `<LessonSection snippet="..." lines={...}>` が担当する。
- **行番号を直接書かない。** `focus(snippets, PATH, "目印の文字列")` を使う。
  行番号をベタ書きするとデモを 1 行足しただけで全ページがズレる。
- `DemoCard` に `sourcePath` を渡すと、そのデモとコードの該当行が線でつながる。
  デモを載せるときは必ず渡す。

### 色の使い分け

意味のない場所に色を使わない。色数が増えるほど、意味のある色が効かなくなる。

| 色 | 意味 |
| --- | --- |
| `--connection`（青） | このデモ ↔ このコードの行 |
| amber | うまくいかない例 |
| emerald | 直した例 |

見出しの下線や区切り線は無彩色のままにする。

### 共通クラス

- `focus-ring`: キーボード操作時のフォーカス表示。自前のボタンには必ず付ける
  （shadcn の `Button` は元から持っているので不要）

### デモコードの書き方

右ペインに出るコードは読者が読む教材そのもの。次を守る。

- **主題に関係のない記述を減らす。** 長い Tailwind のクラス、複雑な id 採番などは
  それだけで読む気を削ぐ。文字サイズなどは `DemoCard` 側で吸収する。
- 1 行が長いと折り返して読みにくい。目安として 60 文字以内。
- コメントは短く。折り返すと行ハイライトの見た目が崩れる。

### 目次

`lib/curriculum.ts` が唯一の情報源。サイドバー・トップページの目次・前後ナビが
すべてここを見ている。ページを追加するときは、先にここへ 1 行足して `ready: true` にする。

## 完了の条件

`bun run lint` と `bun run build` が両方通ること。
特に lint は React 19 のルール（レンダリング中に ref を触らない、
effect の中で setState しない）を検出する。
**教材が推奨できない書き方を教材自身が含んでいる状態にしない。**

## デモが光る条件

`showRenderCount` を付けたら、**そのデモの中で `useTrackDemoRender()` を呼ぶ**こと。
呼んでいないとカードは一度も光らず、回数の表示も空のままになる（エラーにはならないので気づけない）。

デモの中で部品ごとの差を見せたいときは、カードではなく `RenderBox` を使う。
外側のコンポーネントが再レンダリングされないデモ（子だけが state を持つ場合など）では、
カードの `showRenderCount` は増えないので付けない。

## 目印の検査

解説側の `at(SOURCE, "from", "to")` は、デモの実ファイルにその文字列が
あることを前提にしている。デモを書き換えると黙って空振りするので、
`bun run check:highlights` で必ず確認する（`bun run verify` に含まれる）。
