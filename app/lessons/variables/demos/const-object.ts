// const で作ったオブジェクト
export const user = { name: "さとう", age: 20 };

// user そのものを入れ替えることはできない。これを書くとエラーになる
// user = { name: "すずき", age: 30 };

// でも、中身を書き換えることはできてしまう
user.name = "すずき";
user.age = 30;
