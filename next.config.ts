import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 없는 경로나 오타를 <Link href>에서 컴파일 단계에 잡는다.
  // 끄면 .next/types/link.d.ts가 다음 next build까지 남아
  // 옛 라우트 목록으로 tsc를 실패시킨다.
  typedRoutes: true,
};

export default nextConfig;
