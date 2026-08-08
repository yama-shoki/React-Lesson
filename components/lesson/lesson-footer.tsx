import { getNeighbors } from "@/lib/curriculum";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

/** 章の終わり。読み終わったあとの行き先を必ず用意しておく */
export const LessonFooter = ({ slug }: { slug: string }) => {
  const { prev, next } = getNeighbors(slug);

  return (
    <footer className="mt-16 border-t pt-8">
      <div className="grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/lessons/${prev.slug}`}
            className="flex items-start gap-3 rounded-xl border px-4 py-3.5 transition-colors hover:bg-muted/50"
          >
            <ArrowLeft className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <span className="min-w-0">
              <span className="block text-xs text-muted-foreground">前の章</span>
              <span className="block text-sm font-semibold">{prev.title}</span>
            </span>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}

        {next ? (
          <Link
            href={`/lessons/${next.slug}`}
            className="flex items-start justify-between gap-3 rounded-xl border px-4 py-3.5 text-right transition-colors hover:bg-muted/50 sm:col-start-2"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-muted-foreground">次の章</span>
              <span className="block text-sm font-semibold">{next.title}</span>
            </span>
            <ArrowRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          </Link>
        ) : (
          <Link
            href="/"
            className="flex items-start justify-between gap-3 rounded-xl border px-4 py-3.5 text-right transition-colors hover:bg-muted/50 sm:col-start-2"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-muted-foreground">
                次の章はまだ準備中です
              </span>
              <span className="block text-sm font-semibold">目次に戻る</span>
            </span>
            <ArrowRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          </Link>
        )}
      </div>
    </footer>
  );
};
