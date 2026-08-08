// 偽として扱われる値は、この 6 つだけ
export const falsyValues = [false, 0, "", null, undefined, NaN];

// それ以外は全部「真」として扱われる。
// 中身が空でも、文字が "0" や "false" でも真になる
export const truthyButSurprising = [[], {}, "0", "false", -1, " "];
