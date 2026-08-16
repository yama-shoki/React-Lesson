import { create } from "zustand";

type CounterStore = {
  count: number;
  name: string;
  increase: () => void;
  changeName: () => void;
};

/**
 * ストア。コンポーネントの外に置く。
 *
 * Provider で包む必要がない。
 * 「どこから使うか」を先に決めなくてよいのが、Context との大きな違い。
 */
export const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  name: "さとう",

  // 更新のしかたも、ストアの中に一緒に置く
  increase: () => set((state) => ({ count: state.count + 1 })),
  changeName: () =>
    set((state) => ({ name: state.name === "さとう" ? "すずき" : "さとう" })),
}));

/*
  中身はまったく同じ、2 つめのストア。

  ふだんは 1 つで足りる。ここで分けているのは、
  このあとの 2 つのデモを別々に動かして見比べるため。
  同じストアを見ていると、片方を押しただけで
  もう片方の数字も動いてしまう。
*/
export const useSelectorStore = create<CounterStore>((set) => ({
  count: 0,
  name: "さとう",
  increase: () => set((state) => ({ count: state.count + 1 })),
  changeName: () =>
    set((state) => ({ name: state.name === "さとう" ? "すずき" : "さとう" })),
}));
