// オブジェクト。名前の付いた値をまとめたもの
export const user = {
  name: "さとう",
  age: 20,
  admin: false,
};

// 中の値を取り出す
export const name = user.name; // "さとう"

// 名前を変数で指定したいときだけ、こちらの書き方を使う
const key = "age";
export const age = user[key]; // 20

// 入れ子にもできる
export const member = {
  name: "すずき",
  address: {
    city: "東京",
  },
};

export const city = member.address.city; // "東京"

// オブジェクトの配列。React で扱うデータは、たいていこの形
export const members = [
  { id: 1, name: "さとう" },
  { id: 2, name: "すずき" },
];
