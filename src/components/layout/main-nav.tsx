"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import { cn, isActivePath } from "@/lib/utils";

/**
 * usePathname으로 현재 경로를 읽어야 해서 클라이언트 컴포넌트다.
 * 헤더 전체가 아니라 이 조각만 클라이언트로 두어 번들을 최소화한다.
 */
export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 md:flex">
      {siteConfig.mainNav.map((item) => {
        const active = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm transition-colors hover:text-foreground",
              active ? "font-medium text-foreground" : "text-muted-foreground",
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
