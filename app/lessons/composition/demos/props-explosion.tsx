// 中身のパターンを props で受け取ろうとすると、こうなっていく
function Card({
  title,
  description,
  badgeLabel,
  showBadge,
  showFooter,
  footerText,
}: {
  title: string;
  description: string;
  badgeLabel?: string;
  showBadge?: boolean;
  showFooter?: boolean;
  footerText?: string;
}) {
  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between gap-3 border-b p-3">
        <span className="font-semibold">{title}</span>
        {showBadge && (
          <span className="rounded border px-2 py-0.5 text-xs">
            {badgeLabel}
          </span>
        )}
      </div>
      <p className="p-3 text-muted-foreground">{description}</p>
      {showFooter && (
        <p className="border-t p-3 text-muted-foreground">{footerText}</p>
      )}
    </div>
  );
}

export function PropsExplosion() {
  return (
    <Card
      title="メンバー"
      description="表示したいものが増えるたびに、props も増えていく"
      showBadge
      badgeLabel="3 名"
      showFooter
      footerText="最終更新: 今日"
    />
  );
}
