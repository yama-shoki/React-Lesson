/**
 * わざと時間のかかる計算。
 * 実際にこれくらい待たされると、無駄な再計算がどれだけ効くか体で分かる。
 */
export const heavyCalculation = (count: number) => {
  let total = 0;

  for (let i = 0; i < 12_000_000; i++) {
    total += i % (count + 2);
  }

  return total;
};
