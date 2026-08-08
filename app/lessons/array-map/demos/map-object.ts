const members = [
  { id: 1, name: "さとう", age: 20 },
  { id: 2, name: "すずき", age: 25 },
  { id: 3, name: "たかはし", age: 30 },
];

// オブジェクトの配列から、名前だけを取り出す
export const names = members.map((member) => member.name);

// 別の形に作り変えることもできる
export const labels = members.map((member) => `${member.name}（${member.age}）`);
