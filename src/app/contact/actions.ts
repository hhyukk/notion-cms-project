"use server";

import { z } from "zod";

import { escapeSlackText, sendSlackMessage } from "@/lib/slack";
import {
  CONTACT_TOPICS,
  contactSchema,
  type ContactInput,
} from "@/lib/validations/contact";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof ContactInput, string[]>>;
};

export async function submitContact(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Server Action은 UI를 거치지 않고 직접 POST로도 호출된다.
  // 클라이언트 검증은 우회될 수 있으므로 서버에서 반드시 다시 검증한다.
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    topic: formData.get("topic"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "입력값을 다시 확인해 주세요.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const { name, email, topic, message } = parsed.data;
  const topicLabel =
    CONTACT_TOPICS.find((t) => t.value === topic)?.label ?? topic;

  const sent = await sendSlackMessage(
    [
      "*새 문의가 접수되었습니다*",
      `*이름:* ${escapeSlackText(name)}`,
      `*이메일:* ${escapeSlackText(email)}`,
      `*유형:* ${topicLabel}`,
      `*내용:*\n${escapeSlackText(message)}`,
    ].join("\n"),
  );

  // 지금은 Slack이 문의가 남는 유일한 곳이라, 실패를 성공으로 보이면 문의가 조용히 유실된다.
  if (!sent) {
    return {
      status: "error",
      message: "문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  return {
    status: "success",
    message: "문의가 접수되었습니다. 곧 회신드리겠습니다.",
  };
}
