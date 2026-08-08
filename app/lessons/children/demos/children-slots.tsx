import type { ReactNode } from "react";

// children 以外にも、JSX を受け取る props をいくつでも作れる
function Panel({
  title,
  action,
  children,
}: {
  title: ReactNode;
  action: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between gap-3 border-b p-3">
        <span className="font-semibold">{title}</span>
        {action}
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

export function ChildrenSlots() {
  return (
    <Panel
      title="メンバー"
      action={
        <span className="rounded border px-2 py-0.5 text-xs text-muted-foreground">
          3 名
        </span>
      }
    >
      <p className="text-muted-foreground">
        タイトルの隣にも、中身にも、別々の JSX を差し込める
      </p>
    </Panel>
  );
}
