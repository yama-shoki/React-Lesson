// JSX は値なので、変数に入れられる
const badge = <span className="rounded border px-2 py-0.5 text-xs">新着</span>;

// 配列に入れることもできる。これがリスト表示の正体
const rows = ["さとう", "すずき"].map((memberName) => (
  <li key={memberName} className="rounded-md border p-2.5">
    {memberName} {badge}
  </li>
));

export function JsxValue() {
  return <ul className="flex flex-col gap-2.5">{rows}</ul>;
}
