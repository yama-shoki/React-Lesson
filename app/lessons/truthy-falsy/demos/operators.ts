/*
  && は 左が偽ならその左の値を返し、真なら右の値を返す
  || は 左が真ならその左の値を返し、偽なら右の値を返す
  ?? は 左が null か undefined のときだけ右の値を返す
*/

// 実際のデータと同じように、変数に入った値で試す
const count: number = 0;
const stock: number = 5;
const keyword: string = "";
const nickname: string | null = null;

export const examples = [
  { code: 'count && "あり"', result: count && "あり" },
  { code: 'stock && "あり"', result: stock && "あり" },
  { code: 'keyword || "デフォルト"', result: keyword || "デフォルト" },
  { code: 'count || "デフォルト"', result: count || "デフォルト" },
  { code: 'count ?? "デフォルト"', result: count ?? "デフォルト" },
  { code: 'nickname ?? "デフォルト"', result: nickname ?? "デフォルト" },
];
