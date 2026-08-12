"use client";

import { RenderBox } from "@/components/lesson/render-box";
import { useEffect, useState } from "react";

function WidthLabel() {
  // ここから 8 行
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  // ここまで

  return <RenderBox title="WidthLabel">いまの画面幅: {width}px</RenderBox>;
}

function DeviceLabel() {
  // まったく同じ 8 行が、もう一度
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <RenderBox title="DeviceLabel">
      判定: {width < 768 ? "スマホ向け" : "パソコン向け"}
    </RenderBox>
  );
}

export function Duplicated() {
  return (
    <div className="flex flex-col gap-2">
      <WidthLabel />
      <DeviceLabel />
    </div>
  );
}
