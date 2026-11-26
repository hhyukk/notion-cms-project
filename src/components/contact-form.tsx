"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2Icon, SendIcon } from "lucide-react";

import { submitContact, type ContactFormState } from "@/app/contact/actions";
import {
  CONTACT_TOPICS,
  contactSchema,
  type ContactInput,
} from "@/lib/validations/contact";
import { withCallFailure } from "@/lib/form-action";
import { mergeErrors } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const INITIAL_STATE: ContactFormState = { status: "idle" };

const DEFAULT_VALUES = { name: "", email: "", message: "" };

// 검증에 실패하면 이 순서로 첫 오류 칸에 포커스를 준다. 화면 순서와 같아야 한다.
const FIELD_ORDER = ["name", "email", "topic", "message"] as const;

// 전송 중에 다른 페이지로 가면 폼이 사라지므로, effect가 아니라 withCallFailure가 부른다.
function notify(state: ContactFormState) {
  if (state.status === "success") {
    toast.success(state.message);
  } else if (state.status === "error") {
    toast.error(state.message);
  }
}

const submitAction = withCallFailure(
  submitContact,
  {
    status: "error",
    // 응답만 끊긴 경우에도 이 문구가 나온다. 서버는 이미 처리했을 수 있어 실패로 단정하지 않는다.
    message:
      "서버 응답을 받지 못했습니다. 잠시 후 다시 시도해 주세요. 계속되면 내용을 복사해 두고 새로고침해 주세요.",
  },
  notify,
);

export function ContactForm() {
  const [state, formAction, pending] = React.useActionState(
    submitAction,
    INITIAL_STATE,
  );

  // 하이드레이션 전에 제출하면 withCallFailure를 거치지 않고 결과가 담긴 페이지가 새로 온다. 그 첫 상태만 여기서 알린다.
  // state를 그대로 보면 withCallFailure가 이미 알린 결과를 한 번 더 알린다.
  const [firstState] = React.useState(state);
  React.useEffect(() => {
    notify(firstState);
  }, [firstState]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    // 칸을 벗어날 때 검증하면 버튼을 누르는 순간 오류가 나타나 버튼이 밀리고, 누르던 클릭이 무효가 된다.
    mode: "onSubmit",
    defaultValues: DEFAULT_VALUES,
    // RHF는 먼저 등록된 칸에 포커스를 준다. Controller는 자식이 렌더될 때 등록되어 뒤의 register보다도 늦으므로
    // 유형과 내용이 함께 틀리면 유형을 건너뛴다. 끄고 onSubmit에서 직접 옮긴다.
    shouldFocusError: false,
  });

  // disabled={pending}만으로는 중복 제출을 다 막지 못한다. 성공하면 버튼이 먼저 켜지고 값은 그 뒤
  // effect에서 비워지므로, 그 사이에 눌린 Enter가 같은 문의를 한 번 더 보낸다.
  const submittingRef = React.useRef(false);

  React.useEffect(() => {
    if (state.status === "success") {
      // 값을 넘기지 않으면 네이티브 form.reset()이 먼저 불려 Radix Select가 빈 값으로 onChange를 보낸다.
      reset(DEFAULT_VALUES);
    }
  }, [state, reset]);

  // 위 effect가 값을 비운 뒤에 풀어야 남은 값이 다시 제출되지 않는다(effect는 선언 순서대로 실행된다).
  // state를 보고 풀면 액션이 prevState를 그대로 돌려줄 때 객체가 같아 영영 풀리지 않는다.
  React.useEffect(() => {
    if (!pending) submittingRef.current = false;
  }, [pending]);

  /**
   * JS가 없으면 이 핸들러가 붙지 않아 form의 action이 그대로 동작한다.
   * JS가 있으면 제출을 가로채 클라이언트 검증을 먼저 돌리고, 통과할 때만 서버로 보낸다.
   */
  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    // 비동기 검증 뒤에는 currentTarget이 비므로 미리 붙잡아 둔다.
    const form = event.currentTarget;

    // trigger()는 제출로 기록되지 않아, 값을 고쳐도 다음 제출까지 오류가 남는다.
    // handleSubmit 뒤에는 입력하는 동안 지워진다.
    return handleSubmit(
      () => {
        if (submittingRef.current) return;
        submittingRef.current = true;

        React.startTransition(() => formAction(new FormData(form)));
      },
      (invalid) => {
        const first = FIELD_ORDER.find((name) => invalid[name]);
        if (first) setFocus(first);
      },
    )(event);
  }

  return (
    <form action={formAction} onSubmit={onSubmit} noValidate>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">이름</FieldLabel>
          <Input
            id="name"
            autoComplete="name"
            placeholder="홍길동"
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />
          <FieldError
            errors={mergeErrors(errors.name, state.fieldErrors?.name)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">이메일</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          <FieldDescription>회신받을 주소를 입력해 주세요.</FieldDescription>
          <FieldError
            errors={mergeErrors(errors.email, state.fieldErrors?.email)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="topic">문의 유형</FieldLabel>
          {/*
            * Select는 네이티브 input이 아니라 register로 묶을 수 없어 Controller를 쓴다.
            * Radix Select에 name을 주면 숨은 <select>의 값이 FormData에 실린다.
            */}
          <Controller
            control={control}
            name="topic"
            render={({ field }) => (
              <Select
                name={field.name}
                value={field.value ?? ""}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="topic"
                  // 없으면 유형만 빠졌을 때 포커스가 이 칸으로 오지 않아, 글이 길면 오류가 화면 밖에 남는다.
                  ref={field.ref}
                  aria-invalid={Boolean(errors.topic)}
                >
                  <SelectValue placeholder="선택해 주세요" />
                </SelectTrigger>
                <SelectContent>
                  {CONTACT_TOPICS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError
            errors={mergeErrors(errors.topic, state.fieldErrors?.topic)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="message">문의 내용</FieldLabel>
          <Textarea
            id="message"
            rows={5}
            placeholder="어떤 점이 궁금하신가요?"
            aria-invalid={Boolean(errors.message)}
            {...register("message")}
          />
          <FieldError
            errors={mergeErrors(errors.message, state.fieldErrors?.message)}
          />
        </Field>

        <Button type="submit" size="lg" disabled={pending} className="w-fit">
          {pending ? <Loader2Icon className="animate-spin" /> : <SendIcon />}
          {/* 맨 글자면 브라우저 번역을 켰을 때 React가 그 앞에 새 아이콘을 넣다 예외가 난다. */}
          <span>{pending ? "보내는 중…" : "문의 보내기"}</span>
        </Button>
        {/*
          * 토스트는 몇 초 뒤 사라지고 JS가 없으면 뜨지 않아 여기에도 남긴다. 낭독은 토스트의 aria-live가 하므로
          * role은 주지 않는다. 버튼 위에 두면 실패할 때 버튼이 밀려 다시 누르는 클릭이 빗나간다.
          * state는 다음 결과가 올 때까지 그대로라, 다시 보내는 동안에는 지난 실패로 읽히지 않게 감춘다.
          */}
        {state.status === "error" && !pending ? (
          <p className="text-sm text-destructive">{state.message}</p>
        ) : null}
      </FieldGroup>
    </form>
  );
}
