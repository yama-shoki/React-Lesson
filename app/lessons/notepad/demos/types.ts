export type Memo = {
  id: number;
  title: string;
  body: string;
};

/** メモ帳の中だけで使う配色。アプリ全体のテーマとは別のもの */
export type Palette = "plain" | "warm" | "cool";

export const paletteLabels: Record<Palette, string> = {
  plain: "白",
  warm: "あたたかい",
  cool: "つめたい",
};

export const paletteStyles: Record<Palette, string> = {
  plain: "bg-background",
  warm: "bg-amber-500/10",
  cool: "bg-sky-500/10",
};

export const initialMemos: Memo[] = [
  { id: 1, title: "買い物", body: "牛乳とパン" },
  { id: 2, title: "読みたい本", body: "リファクタリング" },
];
