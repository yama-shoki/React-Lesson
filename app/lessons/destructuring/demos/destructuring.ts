const user = { name: "さとう", age: 20, city: "東京" };

// 必要なものだけ、名前を指定して取り出す
const { name, age } = user;

export const picked = `name は "${name}"、age は ${age}`;

// 配列は名前ではなく「順番」で取り出す
const colors = ["赤", "青", "緑"];
const [first, second] = colors;

export const firstTwo = `1 つめは "${first}"、2 つめは "${second}"`;
