import Link from "next/link";
import {
  ArrowRightIcon,
  ComponentIcon,
  MoonIcon,
  PaletteIcon,
  ShieldCheckIcon,
  TypeIcon,
  ZapIcon,
} from "lucide-react";

import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const FEATURES = [
  {
    icon: ZapIcon,
    title: "App Router",
    description:
      "서버 컴포넌트가 기본이고, 데이터 변경은 Server Action으로 처리합니다.",
  },
  {
    icon: TypeIcon,
    title: "TypeScript strict",
    description:
      "라우트 타입까지 자동 생성되어 잘못된 경로는 컴파일에서 걸립니다.",
  },
  {
    icon: PaletteIcon,
    title: "Tailwind CSS v4",
    description:
      "설정 파일 없이 CSS에서 직접 테마 토큰을 선언하는 CSS-first 방식입니다.",
  },
  {
    icon: ComponentIcon,
    title: "shadcn/ui",
    description:
      "코드를 프로젝트 안에 복사해 쓰므로 마음대로 열어 고칠 수 있습니다.",
  },
  {
    icon: MoonIcon,
    title: "다크 모드",
    description:
      "라이트·다크·시스템 3단 전환을 지원하고 새로고침해도 유지됩니다.",
  },
  {
    icon: ShieldCheckIcon,
    title: "검증되는 폼",
    description:
      "하나의 zod 스키마를 클라이언트와 서버가 함께 사용합니다.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <section className="flex flex-col items-center gap-5 py-20 text-center sm:py-28">
        <Badge variant="secondary">Next.js 16 · React 19 · Tailwind v4</Badge>
        <h1 className="font-heading max-w-2xl text-4xl font-semibold tracking-tight text-balance break-keep sm:text-5xl">
          바로 시작하는 모던 웹 스타터킷
        </h1>
        <p className="max-w-xl text-muted-foreground text-pretty">
          {siteConfig.description}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/components">
              컴포넌트 둘러보기
              <ArrowRightIcon />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contact">문의 폼 예제 보기</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon className="size-4 text-muted-foreground" />
                {title}
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>
    </div>
  );
}
