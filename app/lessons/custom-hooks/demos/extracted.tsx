"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { RenderBox } from "@/components/lesson/render-box";
import { useWindowWidth } from "./use-window-width";

function WidthLabel() {
  // 8 行が 1 行になった
  const width = useWindowWidth();

  return <RenderBox title="WidthLabel">いまの画面幅: {width}px</RenderBox>;
}

function DeviceLabel() {
  const width = useWindowWidth();

  return (
    <RenderBox title="DeviceLabel">
      判定: {width < 768 ? "スマホ向け" : "パソコン向け"}
    </RenderBox>
  );
}

export function Extracted() {
  useTrackDemoRender();

  return (
    <div className="flex flex-col gap-2">
      <WidthLabel />
      <DeviceLabel />
    </div>
  );
}
