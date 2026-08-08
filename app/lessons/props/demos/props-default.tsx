type Props = {
  label: string;
  // 決まった値のどれか、しか受け取らないようにする
  tone?: "normal" | "warning";
};

// 受け取るところで = を書くと、渡されなかったときの値になる
function Badge({ label, tone = "normal" }: Props) {
  return (
    <span
      className={
        tone === "warning"
          ? "rounded border border-amber-500 px-2 py-0.5 text-amber-700"
          : "rounded border px-2 py-0.5 text-muted-foreground"
      }
    >
      {label}
    </span>
  );
}

export function PropsDefault() {
  return (
    <div className="flex flex-wrap gap-2.5">
      <Badge label="通常" />
      <Badge label="注意" tone="warning" />
    </div>
  );
}
