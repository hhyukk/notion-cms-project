import type { Metadata } from "next";
import Link from "next/link";
import { HouseIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  // 없으면 루트 레이아웃의 기본 제목이 나가 홈과 구별되지 않는다.
  title: "페이지를 찾을 수 없습니다",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="font-mono text-5xl font-semibold text-muted-foreground">
        404
      </p>
      <h1 className="font-heading text-2xl font-semibold">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="text-sm text-muted-foreground">
        주소가 바뀌었거나 삭제된 페이지입니다.
      </p>
      <Button asChild size="lg">
        <Link href="/">
          <HouseIcon />
          홈으로 돌아가기
        </Link>
      </Button>
    </div>
  );
}
