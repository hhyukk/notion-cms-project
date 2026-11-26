import { z } from "zod";

/**
 * 클라이언트(react-hook-form)와 서버(Server Action)가 공유하는 단일 스키마.
 * 검증 규칙이 한 곳에만 있어야 양쪽이 어긋나지 않는다.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, { error: "이름은 2자 이상 입력해 주세요." })
    .max(40, { error: "이름은 40자를 넘을 수 없습니다." }),
  email: z.email({ error: "올바른 이메일 형식이 아닙니다." }),
  topic: z.enum(["general", "bug", "feature"], {
    error: "문의 유형을 선택해 주세요.",
  }),
  message: z
    .string()
    // 브라우저는 폼을 보낼 때 \n을 \r\n으로 바꾼다. 되돌리지 않으면 서버만 줄바꿈을 두 글자로 세어
    // 클라이언트 검증을 통과한 글을 거부한다.
    .overwrite((value) => value.replace(/\r\n/g, "\n"))
    .min(10, { error: "문의 내용을 10자 이상 입력해 주세요." })
    .max(1000, { error: "문의 내용은 1000자를 넘을 수 없습니다." }),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Select 옵션. value는 스키마의 enum과 타입으로 묶여 있어 오타가 나면 컴파일에서 걸린다. */
export const CONTACT_TOPICS: { value: ContactInput["topic"]; label: string }[] =
  [
    { value: "general", label: "일반 문의" },
    { value: "bug", label: "버그 신고" },
    { value: "feature", label: "기능 제안" },
  ];
