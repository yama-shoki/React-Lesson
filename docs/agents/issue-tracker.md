# React 入門 — 完成までの地図

`wayfinder:map`

## Destination

**react-dev が持つ教材パターンをすべて取り込み、Part 0〜9 と実務ライブラリ章が完成した状態。**

完成の条件:

- 全 Part が公開され、目次に「準備中」が残っていない
- react-dev にあって、こちらにない教材パターンが残っていない
- `bun run lint` と `bun run build` が通る
- 実装後、**5 周の見直し**（読み直し / react-dev との比較 / リファクタリング）を終えている

## Notes

- **このマップは実行も含む。** 決定して終わりではなく、章を書き上げるところまでが範囲（依頼主の明示指示）
- 教材の書き方の決まりは `AGENTS.md` に集約。章を書く前に必ず読む
- react-dev のソース: `/Users/wells_claves/practice/web/react-dev`
- 依頼主は不在。判断が要る場面は、既存 29 章の方針に合わせて自分で決める
- 1 Part 書き終えるごとに commit / push（main への push で本番へ自動デプロイ）

## Decisions so far

<!-- 一行ずつ。詳細は各チケットに置き、ここには要点だけ -->

- **react-dev の調査** — 完了。取り込むべきパターンが判明（下記）
- **useCallback は「最適化」ではなく「怠ると無限ループになるバグ」として先に見せる** — react-dev がこの順序を採っており、優先度の付け方として正しい
- **Part 9 は「状態の置き場所」で統一する** — react-dev は useState / SWR / localStorage / URL を全部 `[value, setValue]` の同じ形に揃え、「API は同じ、置き場所が違うだけ」を体で覚えさせている

### react-dev から取り込むパターン

| パターン | 取り込み先 | 状態 |
| --- | --- | --- |
| useEffect の無限ループ（2 種） | Part 6 に新章「無限ループにしない」 | 実装中 |
| children による再レンダリング分離（Flat vs Count） | Part 8 | 未 |
| memo / useMemo / useCallback（1 行だけ違う双子で見せる） | Part 8 | 未 |
| Context を分割する理由（large → split の対比） | Part 9 | 未 |
| 状態の置き場所 4 種を同じ形で見せる | Part 9 | 未 |
| useReducer（counter → form → todo の階段） | Part 4 に新章 | 未 |
| スーパー → スプリット → FaaC の階段 | Part 2 | 未 |
| Suspense（async な Server Component） | Part 9 か新設 | 未 |

### react-dev の教材設計から学んだこと

- **good / bad を「1 行だけ違う双子」にする**。useMemo の悪い例を即時実行関数で書き、見た目の構造を揃えたまま差分を記号だけに絞っている
- **症状の見せ方を概念ごとに変える**。値の変化 / console に出るか / 暴走 / 待ち時間、と最も刺さる感覚に訴える手段を選んでいる
- **前のパターンの限界が、次のパターンの動機になる順序**にする（super の欠点 → split、split の限界 → FaaC）
- **銀の弾丸として提示しない**。split の説明で「実装が冗長になる」と欠点も認めている

## Not yet specified

- 5 周の見直しで、それぞれ何を見るのか（周ごとに観点を変えるべきか、同じ観点で反復するか）
- 実務ライブラリ章を独立した Part にするか、Part 9 に統合するか
- Suspense をどの Part に置くか（Server Component の話が必要になる）

## Out of scope

- ダークモードの再導入（ライト固定で運用すると決定済み）
- 演習課題の追加（読んで理解する方針と決定済み）
