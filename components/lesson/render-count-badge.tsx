"use client";

import { useEffect, useRef } from "react";

/**
 * デモ内の任意のコンポーネントが何回実行されたかを表示する。
 * state に数えないのは、表示のために再レンダリングが走ると無限ループになるため。
 */
export function RenderCountBadge({ label }: { label?: string }) {
  const textRef = useRef<HTMLSpanElement>(null);
  const count = useRef(0);

  useEffect(() => {
    count.current++;
    if (textRef.current) {
      const prefix = label ? `${label} ` : "";
      textRef.current.textContent = `${prefix}render ${count.current}`;
    }
  });

  return (
    <span
      ref={textRef}
      className="font-mono text-xs tabular-nums text-muted-foreground"
    />
  );
}
