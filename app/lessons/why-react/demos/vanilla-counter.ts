/*
  React を使わずに、同じカウンターを作るとこうなる。
  「値を持つ」だけでなく「値が変わったら画面のどこを書き換えるか」まで
  自分で面倒を見る必要がある。
*/

let count = 0;

const label = document.querySelector("#count");
const increment = document.querySelector("#increment");
const reset = document.querySelector("#reset");

// 値を変えるたびに、表示の更新を自分で呼ぶ
const render = () => {
  if (label) label.textContent = String(count);
};

increment?.addEventListener("click", () => {
  count = count + 1;
  render(); // ← これを忘れると、値は増えているのに画面が変わらない
});

reset?.addEventListener("click", () => {
  count = 0;
  render(); // ← ここでも忘れてはいけない
});

render(); // 最初の表示も自分で行う
