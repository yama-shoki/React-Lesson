type User = {
  name: string;
  address?: { city: string };
};

const withAddress: User = { name: "さとう", address: { city: "東京" } };
const withoutAddress: User = { name: "すずき" };

/*
  address がある人でも、そのまま .city とは書けない。
  型の上では「無いかもしれない」ままなので、TypeScript が止めてくれる。
  （型を付けていない JavaScript では止めてくれない。落ちてから気づく）
*/
export const city1 = withAddress.address?.city; // "東京"

/*
  ?. を外すとどうなるか。

  型を付けていれば、TypeScript が書いた時点で止めてくれる
  （下の行のコメントを外すと、赤線が出る）。
*/
// export const city2 = withoutAddress.address.city;

/*
  では型が無ければどうなるか。実行して、その場で落ちる。

    Cannot read properties of undefined (reading 'city')

  undefined の中を見に行こうとしたため。
  型を付けない JavaScript では、動かすまで気づけない。
*/

// ?. を挟むと「途中が無ければ、そこで undefined を返す」になる
export const city3 = withoutAddress.address?.city; // undefined

// ?? と組み合わせると、無いときの表示まで決められる
export const city4 = withoutAddress.address?.city ?? "未登録"; // "未登録"

// 関数にも使える。「あれば呼ぶ」
type Item = { name: string; onSelect?: () => void };
const item: Item = { name: "りんご" };
export const called = item.onSelect?.(); // undefined（呼ばれない）
