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
- **Suspense は Part 8 の末尾に置く** — Part 8 の他の章が「むだな描き直しを減らす」話なので、「縮められない待ち時間の見せ方」だと冒頭で線を引いたうえで並べた。Part 9 の url-state が Suspense を必要とするので、先に来ている必要もあった
- **Part 10 は独立させる** — Part 9 に混ぜると「状態の置き場所」という Part の筋が濁る。「困りごとが先、ライブラリは後」という別の主題として切り出した
- **Part 9 は「状態の置き場所」で統一する** — react-dev は useState / SWR / localStorage / URL を全部 `[value, setValue]` の同じ形に揃え、「API は同じ、置き場所が違うだけ」を体で覚えさせている

### react-dev から取り込むパターン

| パターン | 取り込み先 | 状態 |
| --- | --- | --- |
| useEffect の無限ループ（2 種） | Part 6「無限ループにしない」 | 済 |
| children による再レンダリング分離 | Part 8「children で切り離す」 | 済 |
| memo / useMemo / useCallback（1 行だけ違う双子） | Part 8 | 済 |
| Context を分割する理由（large → split） | Part 9「Context と再レンダリング」 | 済 |
| 状態の置き場所 4 種を同じ形で見せる | Part 9「状態の置き場所を選ぶ」 | 済 |
| useReducer | Part 4「useReducer」 | 済 |
| スーパー → スプリット | Part 2「合成という考え方」 | 済（元からあった） |
| FaaC / render props | Part 2「children を関数にする」 | 済 |
| Suspense（async な Server Component） | Part 8「Suspense」 | 済 |

**react-dev には無いが、こちらで足したもの**

- カスタムフック（Part 6） — react-dev に単独の扱いがなく、Part 10 への橋として必要だった
- Part 10「実務で使う道具」 — react-hook-form / debounce / ライブラリの選び方
- useState の実践パターン（Part 4） — 依頼主の指摘で追加
- `scripts/check-highlights.mjs` — 目印の空振りを機械的に検出する

### react-dev の教材設計から学んだこと

- **good / bad を「1 行だけ違う双子」にする**。useMemo の悪い例を即時実行関数で書き、見た目の構造を揃えたまま差分を記号だけに絞っている
- **症状の見せ方を概念ごとに変える**。値の変化 / console に出るか / 暴走 / 待ち時間、と最も刺さる感覚に訴える手段を選んでいる
- **前のパターンの限界が、次のパターンの動機になる順序**にする（super の欠点 → split、split の限界 → FaaC）
- **銀の弾丸として提示しない**。split の説明で「実装が冗長になる」と欠点も認めている

## Not yet specified

- （実装に関するものは残っていない）

## 見直し 5 周の割り当て

| 周 | 見るもの | 状態 |
| --- | --- | --- |
| 1 | ハイライトの目印が空振りしていないか（機械検査） | 済 — 1 件発見・修正、254 件一致 |
| 2 | showRenderCount の付け漏れ / カリキュラムと実ディレクトリの整合 | 済 — 漏れなし（Part 0〜2 は静的デモなので意図的に無し） |
| 3 | 全 49 章の内容点検（事実誤り / 本文とデモの不一致 / 章参照 / クイズ） | 実施中（4 並列） |
| 4 | 3 周目の指摘の反映 | 未 |
| 5 | リファクタリングと最終確認（lint / 目印 / build） | 未 |

## Out of scope

- ダークモードの再導入（ライト固定で運用すると決定済み）
- 演習課題の追加（読んで理解する方針と決定済み）
