"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn, isActivePath } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [prevPathname, setPrevPathname] = React.useState(pathname);

  // 뒤로 가기는 Link의 onClick을 거치지 않아 시트가 열린 채 남는다. effect 안에서 닫으면
  // eslint의 react-hooks/set-state-in-effect에 걸리므로 렌더 중에 이전 경로와 비교한다.
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          aria-label="메뉴 열기"
        >
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{siteConfig.name}</SheetTitle>
          {/* 시트가 열릴 때 스크린리더가 읽는 설명(aria-describedby)이다. 화면에는 감춘다. */}
          <SheetDescription className="sr-only">
            사이트 페이지로 이동하는 메뉴입니다.
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4 pb-4">
          {siteConfig.mainNav.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                // 현재 페이지 링크는 경로가 바뀌지 않고, 다른 페이지도 이동이 끝나기 전에 닫아야 해서 직접 닫는다.
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                  active
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground",
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
