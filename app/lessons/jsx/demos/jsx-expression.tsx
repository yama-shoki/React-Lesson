const name = "さとう";
const price = 1200;
const tags = ["React", "TypeScript"];

export function JsxExpression() {
  return (
    <ul className="flex flex-col gap-2.5">
      {/* 変数をそのまま置ける */}
      <li className="rounded-md border p-2.5">{name} さん</li>

      {/* 計算もできる。式なら何でもよい */}
      <li className="rounded-md border p-2.5">{price * 1.1} 円（税込）</li>

      {/* プロパティの参照も式 */}
      <li className="rounded-md border p-2.5">{name.length} 文字</li>

      {/* 条件による出し分けも、三項演算子なら式として書ける */}
      <li className="rounded-md border p-2.5">
        {tags.length > 0 ? tags.join(" / ") : "タグなし"}
      </li>
    </ul>
  );
}
