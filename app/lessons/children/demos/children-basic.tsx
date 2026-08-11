import type { ReactNode } from "react";

// children という名前の props を受け取ると、
// タグで囲んだ中身がそこに入る
function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-md border p-3">{children}</div>;
}

export function ChildrenBasic() {
  return (
    <div className="flex flex-col gap-2.5">
      <Card>
        <p className="font-semibold">タイトル</p>
        <p className="text-muted-foreground">中身は呼ぶ側が自由に決められる</p>
      </Card>

      <Card>
        <p>別の中身を入れても、同じ枠が使える</p>
      </Card>
    </div>
  );
}
