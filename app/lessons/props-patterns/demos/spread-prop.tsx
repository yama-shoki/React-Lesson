"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type FieldProps = {
  label: string;
  // 要素そのものを props で渡すこともできる
  hint?: ReactNode;
  // 「input が受け取れるもの全部」を、そのまま受け取れるようにする
} & ComponentProps<"input">;

function Field({ label, hint, className, ...rest }: FieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium">{label}</span>

      {/* 受け取った残りを、まとめて input に渡す */}
      <input
        className={cn("rounded-md border px-3 py-2", className)}
        {...rest}
      />

      {hint && <span className="text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function SpreadProp() {
  return (
    <div className="flex flex-col gap-3">
      {/* placeholder も maxLength も、Field 側では書いていない */}
      <Field label="ニックネーム" placeholder="8 文字まで" maxLength={8} />

      <Field
        label="メールアドレス"
        type="email"
        placeholder="you@example.com"
        hint={
          <>
            通知に使います（<strong>公開されません</strong>）
          </>
        }
      />
    </div>
  );
}
