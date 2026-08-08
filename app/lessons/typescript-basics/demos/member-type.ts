// データの形に名前をつける
type Member = {
  id: number;
  name: string;
  // ? を付けると「なくてもいい」項目になる
  nickname?: string;
};

const members: Member[] = [
  { id: 1, name: "さとう", nickname: "さっちゃん" },
  { id: 2, name: "すずき" },
  { id: 3, name: "たかはし", nickname: "たか" },
];

// nickname は undefined のことがあるので ?? で補う
export const labels = members.map((member) => member.nickname ?? member.name);
