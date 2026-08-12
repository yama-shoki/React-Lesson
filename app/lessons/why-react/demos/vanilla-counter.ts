/*
  React を使わずに、同じカウンターを作るとこうなる。
  「値を持つ」だけでなく「値が変わったら画面のどこを書き換えるか」まで
  自分で面倒を見る必要がある。
*/

export const mountCounter = (root: HTMLElement, forgetRender: boolean) => {
  let count = 0;

  const label = root.querySelector("#count");
  const increment = root.querySelector("#increment");
  const reset = root.querySelector("#reset");

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

    // 「書き忘れ」を再現するスイッチ。実際のコードでは、
    // ただ render() を書き忘れただけ、という形で起きる
    if (!forgetRender) render();
  });

  render(); // 最初の表示も自分で行う

  // いまの値を外から見るための窓口（教材用）
  return () => count;
};
