"use client";

import * as React from "react";
import { RotateCwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  retry,
}: {
  // 클라이언트에서 던진 값은 그대로 넘어와 Error가 아닐 수 있다.
  error: unknown;
  // Next.js 16의 에러 경계는 reset도 함께 넘기지만 retry를 쓴다.
  // retry는 세그먼트를 다시 가져와 렌더하고, reset은 재요청 없이 상태만 비운다.
  retry: () => void;
}) {
  React.useEffect(() => {
    // 실제 프로젝트에서는 에러 리포팅 서비스로 전송한다.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="font-heading text-2xl font-semibold">
        문제가 발생했습니다
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        일시적인 문제일 수 있습니다. 잠시 후 다시 시도해 주세요.
      </p>
      <Button size="lg" onClick={() => retry()}>
        <RotateCwIcon />
        다시 시도
      </Button>
    </div>
  );
}
