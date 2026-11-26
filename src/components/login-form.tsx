"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2Icon, LogInIcon, UserPlusIcon } from "lucide-react";

import { submitLogin, type LoginFormState } from "@/app/login/actions";
import { loginSchema, type LoginInput } from "@/lib/validations/login";
import { withCallFailure } from "@/lib/form-action";
import { mergeErrors } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const INITIAL_STATE: LoginFormState = { status: "idle" };

// 전송 중에 다른 페이지로 가면 폼이 사라지므로, effect가 아니라 withCallFailure가 부른다.
function notify(state: LoginFormState) {
  if (state.status === "error") {
    toast.error(state.message);
  }
}

const submitAction = withCallFailure(
  submitLogin,
  {
    status: "error",
    message:
      "서버 응답을 받지 못했습니다. 잠시 후 다시 시도해 주세요. 계속되면 새로고침해 주세요.",
  },
  notify,
);

export function LoginForm() {
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
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    // 칸을 벗어날 때 검증하면 버튼을 누르는 순간 오류가 나타나 버튼이 밀리고, 누르던 클릭이 무효가 된다.
    mode: "onSubmit",
    defaultValues: { email: "", password: "" },
  });

  // disabled={pending}은 다시 렌더된 뒤에야 걸린다. 그 전에 겹친 제출은 이 값으로 막는다.
  const submittingRef = React.useRef(false);

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
    return handleSubmit(() => {
      if (submittingRef.current) return;
      submittingRef.current = true;

      React.startTransition(() => formAction(new FormData(form)));
    })(event);
  }

  return (
    <form action={formAction} onSubmit={onSubmit} noValidate>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">이메일</FieldLabel>
          {/*
            * 비밀번호 관리자는 계정 식별 필드를 username으로 인식한다.
            * 이 폼에서는 이메일이 식별자라 email이 아니라 username을 준다.
            */}
          <Input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          <FieldError
            errors={mergeErrors(errors.email, state.fieldErrors?.email)}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">비밀번호</FieldLabel>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
          <FieldError
            errors={mergeErrors(errors.password, state.fieldErrors?.password)}
          />
        </Field>

        <Field>
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? <Loader2Icon className="animate-spin" /> : <LogInIcon />}
            {/* 맨 글자면 브라우저 번역을 켰을 때 React가 그 앞에 새 아이콘을 넣다 예외가 난다. */}
            <span>{pending ? "로그인 중…" : "로그인"}</span>
          </Button>
          {/*
            * 회원가입 페이지가 생기면 Button asChild + Link로 바꾼다.
            * 지금은 없는 경로라 Link에 걸면 typed routes가 타입 오류로 막는다.
            */}
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => toast.info("회원가입은 준비 중입니다.")}
          >
            <UserPlusIcon />
            회원가입
          </Button>
        </Field>
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
