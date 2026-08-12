/*
  この画面で扱うデータの形。
  ここを最初に決めておくと、あとの部品が全部これに従って書ける。
*/

export type Todo = {
  /** 見分けるための番号。key にも使う */
  id: number;
  /** やることの内容 */
  text: string;
  /** 済んだかどうか */
  done: boolean;
};

/** 一覧の絞り込み。とりうる値をここで決めきる */
export type Filter = "all" | "active" | "done";

export const filterLabels: Record<Filter, string> = {
  all: "すべて",
  active: "未完了",
  done: "完了",
};

/** 絞り込みは「持たずに計算する」。だから関数にしておく */
export const filterTodos = (todos: Todo[], filter: Filter) => {
  if (filter === "active") return todos.filter((todo) => !todo.done);
  if (filter === "done") return todos.filter((todo) => todo.done);
  return todos;
};
