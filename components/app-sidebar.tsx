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
import { SiGithub, SiX } from "@icons-pack/react-simple-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar() {
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

                  return (
                    <SidebarMenuItem key={lesson.slug}>
                      {/* Base UI 版の shadcn では asChild ではなく render で要素を差し替える */}
                      <SidebarMenuButton
                        render={<Link href={href} />}
                        isActive={pathname === href}
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
