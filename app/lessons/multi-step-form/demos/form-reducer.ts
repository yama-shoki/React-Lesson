/** 申込の 3 段階。文字列を直接書かず、この 3 つに絞る */
export type Step = "account" | "profile" | "confirm";

export const steps: Step[] = ["account", "profile", "confirm"];

export const stepLabels: Record<Step, string> = {
  account: "アカウント",
  profile: "プロフィール",
  confirm: "確認",
};

export type FormState = {
  step: Step;
  account: { email: string; password: string } | null;
  profile: { name: string; age: number } | null;
  status: "editing" | "sending" | "done" | "error";
  message: string;
};

export const initialState: FormState = {
  step: "account",
  account: null,
  profile: null,
  status: "editing",
  message: "",
};

/**
 * 「どう変えるか」ではなく「何が起きたか」を書く。
 * setStep や setAccount のような setter を並べない。
 */
export type Action =
  | { type: "account_submitted"; values: { email: string; password: string } }
  | { type: "profile_submitted"; values: { name: string; age: number } }
  | { type: "went_back" }
  | { type: "send_started" }
  | { type: "send_succeeded" }
  | { type: "send_failed"; message: string }
  | { type: "restarted" };

export function formReducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case "account_submitted":
      return { ...state, account: action.values, step: "profile" };

    case "profile_submitted":
      return { ...state, profile: action.values, step: "confirm" };

    case "went_back":
      return {
        ...state,
        step: state.step === "confirm" ? "profile" : "account",
      };

    case "send_started":
      return { ...state, status: "sending", message: "" };

    case "send_succeeded":
      return { ...state, status: "done" };

    case "send_failed":
      return { ...state, status: "error", message: action.message };

    case "restarted":
      return initialState;
  }
}
