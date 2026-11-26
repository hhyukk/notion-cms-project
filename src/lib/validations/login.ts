import { z } from "zod";

/** 클라이언트와 서버가 함께 import한다. 규칙을 어느 한쪽에 덧붙이면 둘이 어긋난다. */
export const loginSchema = z.object({
  email: z.email({ error: "올바른 이메일 형식이 아닙니다." }),
  // 로그인에서는 길이·조합 규칙을 검사하지 않는다. 규칙은 가입·변경 시점에 적용할 일이고,
  // 여기서 막으면 규칙이 바뀌기 전에 만든 비밀번호로는 로그인할 수 없게 된다.
  password: z.string().min(1, { error: "비밀번호를 입력해 주세요." }),
});

export type LoginInput = z.infer<typeof loginSchema>;
