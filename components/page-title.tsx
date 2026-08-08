"use client";

import { findLesson } from "@/lib/curriculum";
import { usePathname } from "next/navigation";

const LESSON_PREFIX = "/lessons/";

/** 画面上部に、いま開いている章の名前を出す */
export const PageTitle = () => {
  const pathname = usePathname();

  const lesson = pathname.startsWith(LESSON_PREFIX)
    ? findLesson(pathname.slice(LESSON_PREFIX.length))
    : undefined;

  if (!lesson) {
    return <span className="truncate text-sm font-semibold">目次</span>;
  }

  return (
    <span className="flex min-w-0 items-center gap-2">
      <span className="hidden shrink-0 font-mono text-xs text-muted-foreground sm:inline">
        {lesson.partLabel}
      </span>
      <span className="truncate text-sm font-semibold">{lesson.title}</span>
    </span>
  );
};
