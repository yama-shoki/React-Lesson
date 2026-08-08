import { falsyValues, truthyButSurprising } from "./falsy";

/** undefined や空文字も、見て分かる形にして並べる */
const display = (value: unknown) => {
  if (value === undefined) return "undefined";
  if (typeof value === "string") return value === "" ? '""' : `"${value}"`;
  if (Array.isArray(value)) return "[]";
  if (value !== null && typeof value === "object") return "{}";
  return String(value);
};

const Chip = ({ value, tone }: { value: unknown; tone: "false" | "true" }) => (
  <li
    className={
      tone === "false"
        ? "rounded-md border border-red-500/40 bg-red-500/[0.06] px-3 py-1.5 font-mono"
        : "rounded-md border border-emerald-500/40 bg-emerald-500/[0.06] px-3 py-1.5 font-mono"
    }
  >
    {display(value)}
  </li>
);

/** 結果を画面に出すだけの入れ物。読者に見せるのは falsy.ts のほう */
export function FalsyList() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground">偽として扱われる（これで全部）</p>
        <ul className="flex flex-wrap gap-2.5">
          {falsyValues.map((value) => (
            <Chip key={display(value)} value={value} tone="false" />
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground">
          真として扱われる（間違えやすいもの）
        </p>
        <ul className="flex flex-wrap gap-2.5">
          {truthyButSurprising.map((value) => (
            <Chip key={display(value)} value={value} tone="true" />
          ))}
        </ul>
      </div>
    </div>
  );
}
