"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { buttonVariants } from "@/components/ui/button";
import { curriculum } from "@/lib/curriculum";
import { cn } from "@/lib/utils";
import { SiGithub, SiX } from "@icons-pack/react-simple-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function AppSidebar() {
  /**
   * 章数が多いので、開いた直後は現在地が画面外にあることが多い。
   * リロードや URL 直開きのたびに探させないよう、1 回だけ寄せる。
   */
  const currentRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: "center" });
  }, []);

  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="gap-0.5 px-4 pt-5 pb-3">
        <Link href="/" className="text-base leading-tight font-bold">
          React 入門
        </Link>
        <p className="text-xs text-muted-foreground">
          手を動かさずに、仕組みから理解する
        </p>
        <div className="-ml-2 flex items-center gap-0.5 pt-1">
          <Link
            href="https://github.com/yama-shoki/React-Lesson"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub リポジトリ"
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <SiGithub className="size-4" />
          </Link>
          <Link
            href="https://x.com/yamayama_studio"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X アカウント"
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <SiX className="size-3.5" />
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {curriculum.map((part) => (
          <SidebarGroup key={part.label}>
            <SidebarGroupLabel className="gap-1.5">
              <span className="font-mono text-[0.688rem] tracking-tight opacity-60">
                {part.label}
              </span>
              <span className="truncate">{part.title}</span>
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {part.lessons.map((lesson) => {
                  const href = `/lessons/${lesson.slug}`;

                  // まだ書いていないページはリンクにしない。
                  // 押せるのに 404 になるより、これから来ると分かるほうがいい
                  if (!lesson.ready) {
                    return (
                      <SidebarMenuItem key={lesson.slug}>
                        <span className="flex h-8 cursor-default items-center gap-2 rounded-md px-2 text-sm text-muted-foreground/70">
                          <span className="truncate">{lesson.title}</span>
                          <span className="ml-auto shrink-0 text-[0.625rem] text-muted-foreground/60">
                            準備中
                          </span>
                        </span>
                      </SidebarMenuItem>
                    );
                  }

                  const isCurrent = pathname === href;

                  return (
                    <SidebarMenuItem key={lesson.slug}>
                      {/* Base UI 版の shadcn では asChild ではなく render で要素を差し替える */}
                      <SidebarMenuButton
                        render={<Link href={href} />}
                        isActive={isCurrent}
                        aria-current={isCurrent ? "page" : undefined}
                        ref={isCurrent ? currentRef : undefined}
                        className={cn(isCurrent && "font-medium text-foreground")}
                        // 既定の active 色は背景との明度差が小さく、hover と
                        // 見分けがつかない。コードの注目行と同じ青を敷いて、
                        // 「いま読んでいるところ」を 1 つの色で統一する。
                        // クラスだと既定のスタイルに負けるので、ここは style で当てる
                        style={
                          isCurrent
                            ? { backgroundColor: "var(--code-line-active)" }
                            : undefined
                        }
                      >
                        <span className="truncate">{lesson.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
