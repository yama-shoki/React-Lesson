/** 買うものの分類。文字列を直接書かず、この 4 つに絞る */
export type Category = "野菜" | "肉・魚" | "日用品" | "その他";

export const categories: Category[] = ["野菜", "肉・魚", "日用品", "その他"];

/**
 * URL から来た文字列を Category に直す。
 *
 * URL は誰でも書き換えられるので、知らない値が入ってくる。
 * as で押し込むと型の上では通ってしまい、
 * 「絞り込んだのに 1 件も出ない」という形で静かに壊れる。
 */
export const toCategory = (value: string): Category | null =>
  categories.includes(value as Category) ? (value as Category) : null;

export type Item = {
  id: number;
  name: string;
  category: Category;
  bought: boolean;
};

export const initialItems: Item[] = [
  { id: 1, name: "にんじん", category: "野菜", bought: false },
  { id: 2, name: "とりむね肉", category: "肉・魚", bought: false },
  { id: 3, name: "洗剤", category: "日用品", bought: true },
  { id: 4, name: "電池", category: "その他", bought: false },
];

/**
 * 絞り込みは「持つ」ものではなく「計算する」もの。
 * ここを state にしないのが Part 4 の「state は最小限にする」。
 */
export const filterItems = (
  items: Item[],
  keyword: string,
  category: Category | null,
) =>
  items.filter((item) => {
    const matchesKeyword = item.name.includes(keyword);
    const matchesCategory = category === null || item.category === category;
    return matchesKeyword && matchesCategory;
  });
