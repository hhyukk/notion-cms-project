"use server";

import { z } from "zod";

import { loginSchema, type LoginInput } from "@/lib/validations/login";

export type LoginFormState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof LoginInput, string[]>>;
};

export async function submitLogin(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  // Server Action은 UI를 거치지 않고 직접 POST로도 호출된다.
  // 클라이언트 검증은 우회될 수 있으므로 서버에서 반드시 다시 검증한다.
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "입력값을 다시 확인해 주세요.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  // 인증 백엔드가 아직 없다. 성공처럼 응답하면 사용자는 로그인된 줄 알기 때문에
  // 검증을 통과해도 실패로 돌려준다. 인증을 붙이면 이 자리에서 redirect()한다.
  return {
    status: "error",
    message: "로그인 기능이 아직 연결되지 않았습니다.",
  };
}
