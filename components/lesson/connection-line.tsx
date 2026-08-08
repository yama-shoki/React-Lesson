"use client";

import { useEffect, useRef } from "react";
import { useCodePane } from "./code-pane-context";

/**
 * 「いま見ているデモ」と「そのコードの該当行」を線で結ぶ。
 *
 * 画面のこの部分が、コードのこの行から生まれている ——
 * それを目で追えるようにするのがこの線の役割。
 * 行まで届かせたいので、カードから水平に伸ばすのではなく、
 * 両端の位置を毎回測って曲線を引いている。
 *
 * 位置の更新は DOM を直接書き換えて行う。
 * スクロールのたびに state を更新すると、そのたびにページ全体が
 * 描き直されてしまうため。
 */
export const ConnectionLine = () => {
  const pathRef = useRef<SVGPathElement>(null);
  const { active, pinned } = useCodePane();

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const hide = () => path.setAttribute("opacity", "0");

    const update = () => {
      const card = document.querySelector<HTMLElement>(
        '[data-demo-linked="true"]'
      );
      const pane = document.querySelector<HTMLElement>("[data-code-pane]");

      if (!card || !pane) return hide();

      const highlighted = pane.querySelectorAll<HTMLElement>(
        '[data-active="true"]'
      );

      const cardRect = card.getBoundingClientRect();
      const paneRect = pane.getBoundingClientRect();

      // 画面の外に出ているときは引かない
      if (cardRect.bottom < 0 || cardRect.top > window.innerHeight) {
        return hide();
      }

      const startX = cardRect.right;
      const startY = cardRect.top + cardRect.height / 2;
      const endX = paneRect.left;

      let endY: number;

      if (highlighted.length > 0) {
        // 光っている行の中心へ向ける
        const first = highlighted[0].getBoundingClientRect();
        const last = highlighted[highlighted.length - 1].getBoundingClientRect();
        endY = (first.top + last.bottom) / 2;
      } else {
        // 行の指定がないときは、コードの枠の上の方を指す
        endY = paneRect.top + 40;
      }

      // 行がスクロールで枠の外に出ていても、線は枠の中を指すようにする
      endY = Math.min(Math.max(endY, paneRect.top + 10), paneRect.bottom - 10);

      if (endX <= startX) return hide();

      const midX = startX + (endX - startX) / 2;

      path.setAttribute(
        "d",
        `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`
      );
      path.setAttribute("opacity", "1");
    };

    /*
     * スクロールイベントを拾って更新すると、必ず 1 フレーム遅れて線がずれる。
     * とくにコードペインが注目行までなめらかに移動している間は、
     * 行の位置が動き続けるのでイベントでは追いつかない。
     * 毎フレーム測り直すことで、どんな動きの途中でも線が正確につながる。
     */
    let frame = 0;
    const loop = () => {
      update();
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [active, pinned]);

  return (
    <svg
      className="pointer-events-none fixed inset-0 z-30 hidden h-full w-full lg:block"
      aria-hidden
    >
      <path
        ref={pathRef}
        fill="none"
        stroke="var(--connection)"
        strokeWidth={1.5}
        opacity={0}
        className="transition-opacity duration-200"
      />
    </svg>
  );
};
