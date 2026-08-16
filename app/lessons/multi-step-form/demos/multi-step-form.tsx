"use client";

import { useTrackDemoRender } from "@/components/lesson/demo-card";
import { RenderBox } from "@/components/lesson/render-box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useReducer } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  formReducer,
  initialState,
  stepLabels,
  steps,
  type Step,
} from "./form-reducer";

const accountSchema = z.object({
  email: z.email("メールアドレスの形式が正しくありません"),
  password: z.string().min(8, "8 文字以上で入力してください"),
});

const profileSchema = z.object({
  name: z.string().min(1, "名前を入力してください"),
  age: z
    .number({ error: "数字を入力してください" })
    .min(18, "18 歳以上で入力してください"),
});

type AccountValues = z.infer<typeof accountSchema>;
type ProfileValues = z.infer<typeof profileSchema>;

function StepAccount({
  onNext,
}: {
  onNext: (values: AccountValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountValues>({
    resolver: zodResolver(accountSchema),
    mode: "onTouched",
  });

  return (
    <RenderBox title="1. アカウント" tone="highlight">
      <form
        onSubmit={handleSubmit(onNext)}
        className="flex flex-col gap-2"
        noValidate
      >
        <Input
          placeholder="メールアドレス"
          aria-label="メールアドレス"
          {...register("email")}
        />
        {errors.email && (
          <p role="alert" className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}

        <Input
          type="password"
          placeholder="パスワード（8 文字以上）"
          aria-label="パスワード"
          {...register("password")}
        />
        {errors.password && (
          <p role="alert" className="text-sm text-destructive">
            {errors.password.message}
          </p>
        )}

        <Button size="sm" type="submit">
          次へ
        </Button>
      </form>
    </RenderBox>
  );
}

function StepProfile({
  onNext,
  onBack,
}: {
  onNext: (values: ProfileValues) => void;
  onBack: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    mode: "onTouched",
  });

  return (
    <RenderBox title="2. プロフィール" tone="highlight">
      <form
        onSubmit={handleSubmit(onNext)}
        className="flex flex-col gap-2"
        noValidate
      >
        <Input placeholder="名前" aria-label="名前" {...register("name")} />
        {errors.name && (
          <p role="alert" className="text-sm text-destructive">
            {errors.name.message}
          </p>
        )}

        <Input
          placeholder="年齢"
          aria-label="年齢"
          {...register("age", { valueAsNumber: true })}
        />
        {errors.age && (
          <p role="alert" className="text-sm text-destructive">
            {errors.age.message}
          </p>
        )}

        <div className="flex gap-2">
          <Button size="sm" type="button" variant="outline" onClick={onBack}>
            戻る
          </Button>
          <Button size="sm" type="submit">
            次へ
          </Button>
        </div>
      </form>
    </RenderBox>
  );
}

export function MultiStepForm() {
  useTrackDemoRender();

  const [state, dispatch] = useReducer(formReducer, initialState);

  const send = async () => {
    dispatch({ type: "send_started" });

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: state.profile?.name ?? "" }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message ?? "送信に失敗しました");
      }

      dispatch({ type: "send_succeeded" });
    } catch (error) {
      dispatch({
        type: "send_failed",
        message: error instanceof Error ? error.message : "送信に失敗しました",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* いまどこにいるか */}
      <ol className="flex flex-wrap gap-2 text-sm">
        {steps.map((step: Step) => (
          <li
            key={step}
            className={`rounded-md border px-3 py-1 ${
              step === state.step
                ? "border-foreground/40 font-semibold"
                : "text-muted-foreground"
            }`}
          >
            {stepLabels[step]}
          </li>
        ))}
      </ol>

      {state.step === "account" && (
        <StepAccount
          onNext={(values) => dispatch({ type: "account_submitted", values })}
        />
      )}

      {state.step === "profile" && (
        <StepProfile
          onNext={(values) => dispatch({ type: "profile_submitted", values })}
          onBack={() => dispatch({ type: "went_back" })}
        />
      )}

      {state.step === "confirm" && (
        <RenderBox title="3. 確認" tone="highlight">
          <div className="flex flex-col gap-3">
            <dl className="grid grid-cols-[6rem_1fr] gap-1 text-sm">
              <dt className="text-muted-foreground">メール</dt>
              <dd>{state.account?.email}</dd>
              <dt className="text-muted-foreground">名前</dt>
              <dd>{state.profile?.name}</dd>
              <dt className="text-muted-foreground">年齢</dt>
              <dd>{state.profile?.age}</dd>
            </dl>

            {state.status === "error" && (
              <p role="alert" className="text-sm text-destructive">
                {state.message}
              </p>
            )}

            {state.status === "done" ? (
              <p className="text-sm text-emerald-700 dark:text-emerald-400">
                送信しました
              </p>
            ) : (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={() => dispatch({ type: "went_back" })}
                  disabled={state.status === "sending"}
                >
                  戻る
                </Button>
                <Button
                  size="sm"
                  type="button"
                  onClick={send}
                  disabled={state.status === "sending"}
                >
                  {state.status === "sending" ? "送信中…" : "送信する"}
                </Button>
              </div>
            )}
          </div>
        </RenderBox>
      )}

      <Button
        size="sm"
        variant="ghost"
        onClick={() => dispatch({ type: "restarted" })}
      >
        最初からやり直す
      </Button>
    </div>
  );
}
