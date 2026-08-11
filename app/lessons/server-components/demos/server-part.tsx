/*
  "use client" が付いていない = Server Component。
  この関数はサーバーで 1 回だけ実行され、
  結果の HTML だけがブラウザに届く。
*/

// サーバーでしか読めないもの（例）。ブラウザには渡らない
const SECRET_NOTE = "この文字列はサーバー側にあります";

export function ServerPart() {
  return (
    <div className="rounded-md border p-3 text-sm">
      <p>ここはサーバーで作られました。</p>
      <p className="text-muted-foreground">{SECRET_NOTE}</p>

      {/* useState も onClick も、ここでは使えない */}
    </div>
  );
}
