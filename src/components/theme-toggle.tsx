"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const THEMES = [
  { value: "light", label: "라이트", icon: SunIcon },
  { value: "dark", label: "다크", icon: MoonIcon },
  { value: "system", label: "시스템", icon: MonitorIcon },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [prevPathname, setPrevPathname] = React.useState(pathname);

  // 열어 둔 채 뒤로 가기를 하면 메뉴가 남아 새 페이지의 클릭과 스크롤이 잠긴다.
  // effect가 아니라 렌더 중에 닫는 이유는 mobile-nav.tsx와 같다.
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="테마 전환">
          {/*
           * theme 값을 읽지 않고 .dark 클래스에만 반응하므로 서버와 클라이언트의
           * 출력이 같다. 덕분에 mounted 가드 없이도 hydration 불일치가 없다.
           */}
          <SunIcon className="dark:hidden" />
          <MoonIcon className="hidden dark:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* 드롭다운 내용은 열릴 때만 마운트되므로 서버 렌더에 포함되지 않는다. */}
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          {THEMES.map(({ value, label, icon: Icon }) => (
            <DropdownMenuRadioItem key={value} value={value}>
              <Icon />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
