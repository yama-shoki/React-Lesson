"use client";

import type { ReactNode } from "react";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { cn } from "@/lib/utils";

// 見た目の種類を、決まった言葉に絞る
type Tone = "info" | "success" | "danger";

const styles: Record<Tone, string> = {
  info: "border-blue-300 bg-blue-50 text-blue-900",
  success: "border-green-300 bg-green-50 text-green-900",
  danger: "border-red-300 bg-red-50 text-red-900",
};

function Notice({
  tone = "info",
  compact = false,
  children,
}: {
  // ? を付けると任意。付けなければ必須
  tone?: Tone;
  compact?: boolean;
  children: ReactNode;
}) {
  return (
    <p
      className={cn(
        "rounded-md border text-sm",
        compact ? "px-2 py-1" : "p-3",
        styles[tone],
      )}
    >
      {children}
    </p>
  );
}

export function VariantProp() {
  useTrackDemoRender();

  return (
    <div className="flex flex-col gap-2">
      {/* tone を省くと info になる */}
      <Notice>お知らせです</Notice>
      <Notice tone="success">保存しました</Notice>
      <Notice tone="danger">保存に失敗しました</Notice>

      {/* 真偽値は、値を書かずに名前だけで true になる */}
      <Notice tone="info" compact>
        狭い版（compact だけ書いた）
      </Notice>
    </div>
  );
}
