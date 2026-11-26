import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CircleAlertIcon, InfoIcon, SparklesIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "컴포넌트",
  description: "이 스타터킷에 포함된 shadcn/ui 컴포넌트 목록입니다.",
};

// 실제 cva 정의에서 확인한 목록.
const BUTTON_VARIANTS = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const;
const BUTTON_SIZES = ["xs", "sm", "default", "lg"] as const;
const BUTTON_ICON_SIZES = ["icon-xs", "icon-sm", "icon", "icon-lg"] as const;
const BADGE_VARIANTS = [
  "default",
  "secondary",
  "outline",
  "destructive",
  "ghost",
  "link",
] as const;

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-lg font-medium">{title}</h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="rounded-lg border p-6">{children}</div>
    </section>
  );
}

export default function ComponentsPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          컴포넌트
        </h1>
        <p className="text-muted-foreground">
          스타터킷에 포함된 컴포넌트입니다. 우측 상단 토글로 다크 모드에서의
          모습도 확인해 보세요.
        </p>
      </header>

      <Section
        title="Button"
        description="variant 6종과 size 8종(텍스트 4종 + 아이콘 4종)을 조합해 사용합니다."
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2">
            {BUTTON_VARIANTS.map((variant) => (
              <Button key={variant} variant={variant}>
                {variant}
              </Button>
            ))}
          </div>
          <Separator />
          <div className="flex flex-wrap items-center gap-2">
            {BUTTON_SIZES.map((size) => (
              <Button key={size} size={size} variant="outline">
                {size}
              </Button>
            ))}
            {BUTTON_ICON_SIZES.map((size) => (
              <Button key={size} size={size} variant="outline" aria-label={size}>
                <SparklesIcon />
              </Button>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Badge">
        <div className="flex flex-wrap items-center gap-2">
          {BADGE_VARIANTS.map((variant) => (
            <Badge key={variant} variant={variant}>
              {variant}
            </Badge>
          ))}
        </div>
      </Section>

      <Section
        title="Alert"
        description="아이콘을 넣으면 자동으로 2열 그리드가 됩니다."
      >
        <div className="flex flex-col gap-3">
          <Alert>
            <InfoIcon className="size-4" />
            <AlertTitle>안내</AlertTitle>
            <AlertDescription>
              기본 variant입니다. 일반적인 정보를 전달할 때 씁니다.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <CircleAlertIcon className="size-4" />
            <AlertTitle>주의</AlertTitle>
            <AlertDescription>
              destructive variant입니다. 되돌릴 수 없는 작업에 씁니다.
            </AlertDescription>
          </Alert>
        </div>
      </Section>

      <Section title="Card">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>제목</CardTitle>
              <CardDescription>설명이 들어가는 자리입니다.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              본문 영역에는 어떤 콘텐츠든 넣을 수 있습니다.
            </CardContent>
            <CardFooter>
              <Button size="sm">확인</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Avatar className="size-8">
                  <AvatarFallback>홍</AvatarFallback>
                </Avatar>
                홍길동
              </CardTitle>
              <CardDescription>Avatar와 조합한 예시입니다.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      <Section
        title="폼 요소"
        description="Field는 react-hook-form에 묶여 있지 않아 어떤 폼 라이브러리와도 조합됩니다."
      >
        <div className="flex flex-col gap-5">
          <Field>
            <FieldLabel htmlFor="demo-name">이름</FieldLabel>
            <Input id="demo-name" placeholder="홍길동" />
            <FieldDescription>Field로 감싼 입력입니다.</FieldDescription>
          </Field>

          <div className="flex flex-col gap-2">
            <Label htmlFor="demo-topic">Select</Label>
            <Select>
              <SelectTrigger id="demo-topic">
                <SelectValue placeholder="선택해 주세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a">첫 번째 항목</SelectItem>
                <SelectItem value="b">두 번째 항목</SelectItem>
                <SelectItem value="c">세 번째 항목</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="demo-message">Textarea</Label>
            <Textarea id="demo-message" rows={3} placeholder="내용을 입력하세요" />
          </div>
        </div>
      </Section>

      <Section title="Tooltip">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">마우스를 올려보세요</Button>
          </TooltipTrigger>
          <TooltipContent>루트 레이아웃의 Provider를 씁니다</TooltipContent>
        </Tooltip>
      </Section>

      <Section
        title="Skeleton"
        description="내용을 기다리는 동안 자리를 먼저 보여주는 로딩 자리표시자입니다."
      >
        <div className="flex items-center gap-4">
          <Skeleton className="size-12 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </div>
      </Section>
    </div>
  );
}
