import { allLessons, curriculum } from "@/lib/curriculum";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  // 公開済みのうち、いちばん最初の章。「どこから読めばいいか」を迷わせないための導線
  const firstReady = allLessons.find((lesson) => lesson.ready);

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-14 md:px-10 md:py-20">
      <header className="mb-14">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          React 入門
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          仕組みから理解する React + TypeScript
        </p>

        {/* 文章は 1 行が長くなりすぎないよう、目次より狭い幅で止める */}
        <div className="mt-8 max-w-2xl space-y-4 leading-[1.9] text-foreground/90">
          <p>
            この教材は、
            <strong className="font-semibold">
              React を「なんとなく動くもの」ではなく「なぜそう動くのか」まで理解する
            </strong>
            ことを目的にしています。JavaScript がまだあやしくても大丈夫なように、Part
            0 は JavaScript のおさらいから始まります。
          </p>
          {/* 画面が狭いときはコードが解説の下に回るので、「左右」とは書かない */}
          <p>
            解説のとなりには、そのとき説明しているコードが並びます。
            読み進めるとコードが自動で切り替わり、話題になっている行が光ります。
            自分でコードを書く必要はありません。読んで、動かして、理解してください。
          </p>
        </div>

        {firstReady && (
          <Link
            href={`/lessons/${firstReady.slug}`}
            className="group mt-8 flex max-w-2xl items-center justify-between gap-4 rounded-xl border border-foreground/20 bg-muted/50 px-5 py-4 transition-colors hover:border-foreground/40 hover:bg-muted"
          >
            <span className="min-w-0">
              <span className="block text-xs text-muted-foreground">
                いま読める章 · {firstReady.partLabel}
              </span>
              <span className="mt-0.5 block font-semibold">
                {firstReady.title}
              </span>
            </span>
            <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </header>

      <div className="flex flex-col gap-14">
        {curriculum.map((part) => (
          <section key={part.label}>
            <div className="mb-4">
              <p className="font-mono text-xs tracking-wide text-muted-foreground">
                {part.label}
              </p>
              <h2 className="mt-1 text-xl font-bold">{part.title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {part.summary}
              </p>
            </div>

            <ul className="flex flex-col divide-y overflow-hidden rounded-xl border bg-card">
              {part.lessons.map((lesson) => (
                <li key={lesson.slug}>
                  {lesson.ready ? (
                    <Link
                      href={`/lessons/${lesson.slug}`}
                      className="group flex items-start gap-4 px-4 py-3.5 transition-colors hover:bg-muted/60"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold">
                          {lesson.title}
                        </span>
                        <span className="mt-0.5 block text-sm text-muted-foreground">
                          {lesson.summary}
                        </span>
                      </span>
                      <ArrowRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  ) : (
                    // まだ書いていない章。全体を薄くすると読めなくなるので、
                    // 色を落としつつ文字そのものは判読できる濃さを保つ
                    <div className="flex items-start gap-4 px-4 py-3.5">
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-muted-foreground">
                          {lesson.title}
                        </span>
                        <span className="mt-0.5 block text-sm text-muted-foreground/70">
                          {lesson.summary}
                        </span>
                      </span>
                      <span className="mt-0.5 shrink-0 rounded border px-1.5 py-0.5 text-[0.688rem] text-muted-foreground/70">
                        準備中
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
