import { ExternalLinkIcon } from "lucide-react";

import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
        <p>
          {siteConfig.name} — Next.js 16 · Tailwind v4 · shadcn/ui
        </p>
        <nav className="flex items-center gap-4">
          <a
            href={siteConfig.links.docs}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 transition-colors hover:text-foreground"
          >
            Next.js 문서
            <ExternalLinkIcon className="size-3.5" />
          </a>
          <a
            href={siteConfig.links.tailwind}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 transition-colors hover:text-foreground"
          >
            Tailwind 문서
            <ExternalLinkIcon className="size-3.5" />
          </a>
          <a
            href={siteConfig.links.shadcn}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 transition-colors hover:text-foreground"
          >
            shadcn/ui
            <ExternalLinkIcon className="size-3.5" />
          </a>
        </nav>
      </div>
    </footer>
  );
}
