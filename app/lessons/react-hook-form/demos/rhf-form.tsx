"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";

// 入力の決まりを 1 か所に書く。エラー文もここに書く
const schema = z.object({
  name: z.string().min(1, "名前を入力してください"),
  email: z.email("メールアドレスの形式が正しくありません"),
  age: z
    .number({ error: "数字を入力してください" })
    .min(18, "18 歳以上で入力してください"),
});

// 決まりから型を作る。型を別に書かなくてよい
type FormValues = z.infer<typeof schema>;

export function RhfForm() {
  useTrackDemoRender();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    // 一度エラーを出した項目だけ、打つたびに再判定する
    mode: "onTouched",
  });

  const [sent, setSent] = useState<FormValues | null>(null);

  // 検査を通ったときだけ、この中が呼ばれる
  const onSubmit = handleSubmit(async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSent(values);
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        {/* value も onChange も書かない。register が繋いでくれる */}
        <Input placeholder="名前" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Input placeholder="メールアドレス" {...register("email")} />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Input
          type="number"
          placeholder="年齢"
          // 入力欄の値は文字列なので、数値に変換してから検査に渡す
          {...register("age", { valueAsNumber: true })}
        />
        {errors.age && (
          <p className="text-sm text-red-600">{errors.age.message}</p>
        )}
      </div>

      <Button type="submit" size="sm" disabled={isSubmitting}>
        {isSubmitting ? "送信中…" : "送信"}
      </Button>

      {sent && (
        <p className="text-sm text-muted-foreground">
          送信しました: {sent.name} / {sent.email} / {sent.age} 歳
        </p>
      )}
    </form>
  );
}
