import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  // 루트 레이아웃의 template 덕분에 "문의 | Next Starter"가 된다.
  title: "문의",
  description: "zod 스키마를 클라이언트와 서버가 공유하는 폼 예제입니다.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">문의 폼 예제</CardTitle>
          <CardDescription>
            입력값은 브라우저에서 한 번, Server Action에서 다시 한 번 검증됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContactForm />
        </CardContent>
      </Card>
    </div>
  );
}
