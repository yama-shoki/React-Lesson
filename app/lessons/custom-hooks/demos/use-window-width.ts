"use client";

import { useEffect, useState } from "react";

/**
 * 画面幅を返すカスタムフック。
 *
 * 名前が use で始まっていて、中で他のフックを呼んでいる。
 * それだけで「カスタムフック」と呼ばれる。特別な仕組みはない。
 */
export function useWindowWidth() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);

    update();
    window.addEventListener("resize", update);

    // 後片付けもここに置いておける。使う側は知らなくてよい
    return () => window.removeEventListener("resize", update);
  }, []);

  return width;
}
