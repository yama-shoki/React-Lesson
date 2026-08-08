import { allLessons, curriculum } from "@/lib/curriculum";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  // 公開済みのうち、いちばん最初の章。「どこから読めばいいか」を迷わせないための導線
  const firstReady = allLessons.find((lesson) => lesson.ready);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16 md:py-24">
      <header className="mb-16">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          React 入門
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          仕組みから理解する React + TypeScript
        </p>

        <div className="mt-8 space-y-4 leading-[1.9] text-foreground/90">
          <p>
            この教材は、<strong className="font-semibold">React を「なんとなく動くもの」ではなく「なぜそう動くのか」まで理解する</strong>
            ことを目的にしています。JavaScript がまだあやしくても大丈夫なように、Part 0
            は JavaScript のおさらいから始まります。
          </p>
          <p>
            画面は左右に分かれています。左が解説、右がそのとき説明しているコードです。
            読み進めると右のコードが自動で切り替わり、話題になっている行が光ります。
            自分でコードを書く必要はありません。読んで、動かして、理解してください。
          </p>
        </div>

        {firstReady && (
          <Link
            href={`/lessons/${firstReady.slug}`}
            className="mt-8 flex items-center justify-between gap-4 rounded-xl border bg-muted/40 px-5 py-4 transition-colors hover:bg-muted"
          >
            <span className="min-w-0">
              <span className="block text-xs text-muted-foreground">
                いま読める章 · {firstReady.partLabel}
              </span>
              <span className="mt-0.5 block font-semibold">
                {firstReady.title}
              </span>
            </span>
            <ArrowRight className="size-4 shrink-0" />
          </Link>
        )}
      </header>

      <div className="flex flex-col gap-12">
        {curriculum.map((part) => (
          <section key={part.label}>
            <div className="mb-4">
              <p className="font-mono text-xs tracking-wide text-muted-foreground">
                {part.label}
              </p>
              <h2 className="mt-0.5 text-xl font-bold">{part.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {part.summary}
              </p>
            </div>

            <ul className="flex flex-col divide-y rounded-xl border">
              {part.lessons.map((lesson) => {
                const content = (
                  <>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">
                        {lesson.title}
                      </span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">
                        {lesson.summary}
                      </span>
                    </span>
                    {lesson.ready ? (
                      <ArrowRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <span className="mt-0.5 shrink-0 text-xs text-muted-foreground/60">
                        準備中
                      </span>
                    )}
                  </>
                );

                return (
                  <li key={lesson.slug}>
                    {lesson.ready ? (
                      <Link
                        href={`/lessons/${lesson.slug}`}
                        className="flex items-start gap-4 px-4 py-3.5 transition-colors hover:bg-muted/50"
                      >
                        {content}
                      </Link>
                    ) : (
                      <div className="flex items-start gap-4 px-4 py-3.5 opacity-50">
                        {content}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
