import type { Route } from "next";

/**
 * Vercel은 프리뷰 배포에서도 이 변수에 프로덕션 도메인을 넣어준다.
 * 배포마다 값이 바뀌는 VERCEL_URL과 달라서 OG 이미지나 canonical 주소에 적합하다.
 * 이 파일은 클라이언트 컴포넌트도 import하므로 NEXT_PUBLIC_ 접두사가 붙은 쪽을 쓴다.
 */
const productionUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;

/**
 * string으로 추론되면 typed routes가 켜진 <Link href>가 받지 않는다.
 * href를 Route로 두면 없는 경로를 적는 순간 여기서 타입 오류가 난다 (Next.js TypeScript 공식 문서의 NavItem 패턴).
 */
type NavItem<T extends string = string> = {
  title: string;
  href: T;
};

const mainNav: NavItem<Route>[] = [
  { title: "홈", href: "/" },
  { title: "컴포넌트", href: "/components" },
  { title: "문의", href: "/contact" },
  { title: "로그인", href: "/login" },
];

/**
 * 네비게이션과 사이트 메타데이터의 단일 출처.
 * 헤더·모바일 드로어·푸터가 모두 이 객체를 읽으므로 링크는 여기서만 고친다.
 */
export const siteConfig = {
  name: "Next Starter",
  description:
    "Next.js 16 App Router · TypeScript · Tailwind CSS v4 · shadcn/ui 기반 스타터킷",
  url: productionUrl ? `https://${productionUrl}` : "http://localhost:3000",
  mainNav,
  links: {
    docs: "https://nextjs.org/docs",
    tailwind: "https://tailwindcss.com/docs",
    shadcn: "https://ui.shadcn.com",
  },
};
