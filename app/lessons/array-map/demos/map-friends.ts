const scores = [1, 2, 3, 4, 5];

// map … 全部を作り変える。数は変わらない
export const doubled = scores.map((n) => n * 2); // [2, 4, 6, 8, 10]

// filter … 条件に合うものだけ残す。数が減る
export const big = scores.filter((n) => n > 2); // [3, 4, 5]

// find … 条件に合う最初の 1 つ。配列ではなく値が返る
export const firstBig = scores.find((n) => n > 2); // 3

// reduce … ひとつの値にまとめる。第 2 引数は始めの値
export const total = scores.reduce((sum, n) => sum + n, 0); // 15

// どれも元の配列は変えない
export const original = scores; // [1, 2, 3, 4, 5]
