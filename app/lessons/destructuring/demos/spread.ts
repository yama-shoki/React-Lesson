const original = { name: "さとう", age: 20 };

// ... で中身を展開して、新しいオブジェクトを作る
export const copied = { ...original };

// 展開したあとに書けば、その項目だけ上書きできる
export const updated = { ...original, age: 21 };

// original はいっさい変わっていない
export const stillOriginal = original;
