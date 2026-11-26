"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * 클라이언트 경계 진입점. next-themes 번들도 "use client"로 시작해 서버 컴포넌트인
 * 루트 레이아웃에서 바로 쓸 수 있지만, 경계가 프로젝트 파일에서 보이도록 이 파일을 거친다.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
