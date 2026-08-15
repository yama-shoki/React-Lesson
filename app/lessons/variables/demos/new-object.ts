// 元のデータ。こちらは最後まで書き換えない
export const user = { name: "さとう", age: 20 };

// 書き換える代わりに、新しいオブジェクトを作る。
// 変えたいところだけ新しい値にして、残りは元から写す
export const updated = { name: "すずき", age: user.age };

// user は無傷のまま。updated だけが新しい
