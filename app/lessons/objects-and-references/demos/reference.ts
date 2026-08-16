// 数値や文字列は「値そのもの」が入る
export const a = 10;
export const b = a; // 10 という値が写される

// 中身が同じでも、別々に作ったオブジェクトは別のもの
export const box1 = { name: "さとう" };
export const box2 = { name: "さとう" };

export const sameLooking = box1 === box2; // false

// 代入したときに写されるのは「どの箱か」であって、箱の中身ではない
export const box3 = box1;

export const sameBox = box1 === box3; // true

// box3 経由で書き換えると、box1 も変わって見える。同じ箱だから
box3.name = "すずき";

export const nameFromBox1 = box1.name; // "すずき"

// 写すのではなく、新しい箱を作れば影響しない
export const box4 = { name: box1.name };
box4.name = "たかはし";

export const box1StillSame = box1.name; // "すずき" のまま
