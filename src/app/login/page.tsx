import type { Metadata } from "next";

import { LoginForm } from "@/components/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  // 루트 레이아웃의 template 덕분에 "로그인 | Next Starter"가 된다.
  title: "로그인",
  description: "공유 zod 스키마와 Server Action으로 검증하는 로그인 폼 예제입니다.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16 md:py-24">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">로그인</CardTitle>
          <CardDescription>이메일과 비밀번호를 입력해 주세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
