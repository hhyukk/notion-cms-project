import Link from "next/link";
import { LayersIcon } from "lucide-react";

import { siteConfig } from "@/config/site";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";

/** 서버 컴포넌트. 상호작용이 필요한 조각만 클라이언트 컴포넌트로 분리돼 있다. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-2 px-4">
        <MobileNav />
        <Link href="/" className="flex items-center gap-2 font-medium">
          <LayersIcon className="size-5" />
          <span>{siteConfig.name}</span>
        </Link>
        <div className="flex-1" />
        <MainNav />
        <ThemeToggle />
      </div>
    </header>
  );
}
