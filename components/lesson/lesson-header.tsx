import { allLessons, findLesson } from "@/lib/curriculum";

/**
 * レッスン冒頭。Part 名・タイトル・「この章で分かること」を出す。
 * タイトルなどは目次と同じ定義（lib/curriculum.ts）から引くので、両者がズレない。
 */
export const LessonHeader = ({
  slug,
  children,
}: {
  slug: string;
  /** 導入の文章 */
  children: React.ReactNode;
}) => {
  const lesson = findLesson(slug);
  if (!lesson) return null;

  // 59 章あるので「あとどれくらいか」が分からないと読者が疲れる。
  // 準備中の章は数に入れない
  const ready = allLessons.filter((item) => item.ready);
  const position = ready.findIndex((item) => item.slug === slug) + 1;

  return (
    <header className="mb-12">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="font-mono text-xs tracking-wide text-muted-foreground">
          {lesson.partLabel} · {lesson.partTitle}
        </p>
        {position > 0 && (
          <p className="font-mono text-xs tabular-nums text-muted-foreground/70">
            {position} / {ready.length} 章
          </p>
        )}
      </div>
      <h1 className="mt-1.5 text-3xl font-bold tracking-tight">
        {lesson.title}
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">{lesson.summary}</p>

      <div className="mt-7 border-l-2 border-foreground/15 pl-5 leading-[1.95] text-foreground/90">
        {children}
      </div>
    </header>
  );
};
