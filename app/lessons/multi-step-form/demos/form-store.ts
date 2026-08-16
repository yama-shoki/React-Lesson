import { create } from "zustand";

/** 申込の 3 段階。文字列を直接書かず、この 3 つに絞る */
export type Step = "account" | "profile" | "confirm";

export const steps: Step[] = ["account", "profile", "confirm"];

export const stepLabels: Record<Step, string> = {
  account: "アカウント",
  profile: "プロフィール",
  confirm: "確認",
};

export type Account = { email: string; password: string };
export type Profile = { name: string; age: number };

type FormStore = {
  step: Step;
  account: Account | null;
  profile: Profile | null;
  /** 真偽値を並べない。ありえない組み合わせを作れなくする */
  status: "editing" | "sending" | "done" | "error";
  message: string;

  /* 更新は「何が起きたか」で名前を付ける。setStep のような setter を並べない */
  submitAccount: (values: Account) => void;
  submitProfile: (values: Profile) => void;
  goBack: () => void;
  send: () => Promise<void>;
  restart: () => void;
};

const initial = {
  step: "account" as Step,
  account: null,
  profile: null,
  status: "editing" as const,
  message: "",
};

export const useFormStore = create<FormStore>((set, get) => ({
  ...initial,

  // 「アカウントが入力された」なら、保存して次へ進むまでが 1 セット。
  // 呼ぶ側が 2 つの操作を組み合わせる必要がない
  submitAccount: (values) => set({ account: values, step: "profile" }),

  submitProfile: (values) => set({ profile: values, step: "confirm" }),

  goBack: () =>
    set((state) => ({
      step: state.step === "confirm" ? "profile" : "account",
    })),

  // 通信もストアの中に置ける。画面側は send() を呼ぶだけ
  send: async () => {
    set({ status: "sending", message: "" });

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: get().profile?.name ?? "" }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message ?? "送信に失敗しました");
      }

      set({ status: "done" });
    } catch (error) {
      set({
        status: "error",
        message: error instanceof Error ? error.message : "送信に失敗しました",
      });
    }
  },

  restart: () => set(initial),
}));
