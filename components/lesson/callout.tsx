import { cn } from "@/lib/utils";
import { Info, Lightbulb, TriangleAlert } from "lucide-react";

// "key" にすると React の key と紛らわしいので "point"
type Variant = "note" | "warn" | "point";

const variants: Record<
  Variant,
  { icon: typeof Info; label: string; className: string; iconClassName: string }
> = {
  note: {
    icon: Info,
    label: "補足",
    className: "border-border bg-muted/40",
    iconClassName: "text-muted-foreground",
  },
  warn: {
    icon: TriangleAlert,
    label: "つまずきやすいところ",
    className: "border-amber-500/40 bg-amber-500/[0.05]",
    iconClassName: "text-amber-600 dark:text-amber-500",
  },
  // 鍵のアイコンは React の key と紛らわしいので使わない
  point: {
    icon: Lightbulb,
    label: "ここが要点",
    className: "border-foreground/25 bg-foreground/[0.04]",
    iconClassName: "text-foreground",
  },
};

/** 本文の流れから少しだけ浮かせて置きたい話 */
export const Callout = ({
  variant = "note",
  title,
  children,
}: {
  variant?: Variant;
  title?: string;
  children: React.ReactNode;
}) => {
  const { icon: Icon, label, className, iconClassName } = variants[variant];

  return (
    <aside className={cn("my-6 rounded-lg border px-4 py-3.5", className)}>
      <p className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold">
        <Icon className={cn("size-4 shrink-0", iconClassName)} />
        {title ?? label}
      </p>
      <div className="callout-body text-[0.938rem] leading-[1.9] text-foreground/90">
        {children}
      </div>
    </aside>
  );
};
