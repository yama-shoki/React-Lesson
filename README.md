# React Lesson

React + TypeScript を、丸暗記ではなく**仕組みから**理解するための学習教材です。

JavaScript がまだあやしい人でも読み進められるように、Part 0 は JavaScript のおさらいから始まります。

**公開先**: https://react-lesson.yama-apps.com

## この教材の考え方

- **左に解説、右にコード。** 読み進めると右のコードが自動で切り替わり、話題の行が光ります。
- **手を動かす課題は出しません。** 読んで、触って、理解することに集中してもらいます。
- **必ず壊してから直します。** 「なぜこう書くのか」は、間違った書き方が実際に壊れるところを
  見てもらうのがいちばん早いからです。

## 動かす

```bash
bun install
bun dev
```

http://localhost:3000 を開いてください。

```bash
bun run lint    # React 19 のルール違反も検出する
bun run build   # 型チェックと本番ビルド
```

## 構成

```
app/
  page.tsx                     目次
  lessons/<slug>/
    page.tsx                   解説本文
    demos/                     実際に動くデモ（右ペインに出るコードそのもの）
    figures/                   図解（SVG）
components/lesson/             教材用の部品
  lesson-shell.tsx             左右 2 ペインの外枠
  lesson-section.tsx           スクロールに応じて右のコードを切り替える単位
  code-pane.tsx                右ペイン。行ハイライトを担当
  demo-card.tsx                デモの箱。レンダリング回数の可視化つき
  quiz.tsx                     選択式のミニクイズ
lib/
  curriculum.ts                目次の定義（サイドバー・前後ナビの情報源）
  code.ts                      デモのソース読み込みと shiki でのハイライト
```

右ペインに出るコードは、**実際にそのページで動いているファイルをそのまま読んでいます**。
解説用に別途書き写したコードではないので、デモを直せば解説側も必ず追従します。

## 章を追加する

1. `lib/curriculum.ts` に 1 行足して `ready: true` にする
2. `app/lessons/<slug>/page.tsx` を作る
3. デモを `demos/` に置き、`SOURCES` に登録する

書き方の決まりは [AGENTS.md](./AGENTS.md) にまとめてあります。

## 技術構成

Next.js 16 (App Router) / React 19 / TypeScript / Tailwind CSS v4 / shadcn/ui (Base UI) / shiki
