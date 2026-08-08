import type { ReactNode } from "react";

// 枠は「並べる場所」だけを決める。中身が何かは知らない
function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-md border">{children}</div>;
}

function CardHeader({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b p-3">
      {children}
    </div>
  );
}

function CardBody({ children }: { children: ReactNode }) {
  return <div className="p-3 text-muted-foreground">{children}</div>;
}

function CardFooter({ children }: { children: ReactNode }) {
  return <div className="border-t p-3 text-muted-foreground">{children}</div>;
}

export function Composed() {
  return (
    <Card>
      <CardHeader>
        <span className="font-semibold">メンバー</span>
        <span className="rounded border px-2 py-0.5 text-xs">3 名</span>
      </CardHeader>

      <CardBody>必要なものだけを、必要な場所に置く</CardBody>

      <CardFooter>最終更新: 今日</CardFooter>
    </Card>
  );
}
