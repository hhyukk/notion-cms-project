import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { siteConfig } from "@/config/site";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  // 404 화면에서만 쓴다. 미리 받으면 모든 페이지가 쓰지 않는 글꼴을 내려받는다.
  preload: false,
});

export const metadata: Metadata = {
  // 이게 있어야 OG 이미지 같은 URL 기반 metadata에 상대 경로를 쓸 수 있다.
  // 없어도 빌드는 실패하지 않아, Vercel 밖에서는 OG 이미지가 localhost 주소로 나가도 지나치기 쉽다.
  metadataBase: new URL(siteConfig.url),
  // template 덕분에 하위 페이지는 title 문자열만 지정하면 된다.
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      // next-themes가 하이드레이션 전에 html 클래스를 바꾸므로 이 경고만 억제한다.
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </TooltipProvider>
          {/* Toaster는 useTheme을 쓰므로 ThemeProvider 안쪽이어야 한다. */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
