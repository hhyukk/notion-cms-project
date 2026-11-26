---
description: '문의 폼 구조를 따라 스키마·Server Action·폼 컴포넌트 3파일을 만듭니다'
---

# Claude 명령어: New Form

zod 스키마 하나를 클라이언트와 서버가 공유하는 3파일 폼 세트를 만듭니다.

## 사용법

```
/new-form <이름> <필드 설명>
```

예: `/new-form signup 이름(2~20자), 이메일, 약관 동의 체크박스`

입력: $ARGUMENTS

## 프로세스

1. 참조 구현 세 파일을 먼저 읽는다. 규칙은 이 파일들이 소유한다.
   - `src/lib/validations/contact.ts`
   - `src/app/contact/actions.ts`
   - `src/components/contact-form.tsx`
2. 만들 파일 중 이미 있는 게 있으면 멈추고 알린다.
3. 같은 구조로 세 파일을 만든다.

| 파일 | 내용 |
|---|---|
| `src/lib/validations/<이름>.ts` | `<이름>Schema`, `<이름>Input` 타입, 옵션이 있으면 상수 |
| `src/app/<이름>/actions.ts` | `"use server"`, `safeParse` 후 `z.flattenError`로 필드 에러 반환 |
| `src/components/<이름>-form.tsx` | `useActionState` + react-hook-form |

4. 페이지(`src/app/<이름>/page.tsx`)는 만들지 않는다. 필요하면 `/new-page`를 이어서 쓰라고 안내한다.
5. 끝나면 `/verify`로 검증하라고 안내한다.

## 지켜야 할 점

- **검증 규칙은 스키마 파일에만 둔다.** 클라이언트와 서버 어느 한쪽에 규칙을 덧붙이지 않는다.
- **서버는 `FormData`를 거친 값을 검사한다.** 여러 줄 입력은 `contactSchema`의 `message`처럼 스키마에서 `\r\n`을 되돌린다. 체크박스는 `"on"` 또는 없음으로 오므로 액션에서 스키마 타입으로 바꿔 넣는다(`formData.get("agree") === "on"`). 안 하면 클라이언트를 통과한 값을 서버가 거부한다.
- **숫자 입력은 스키마에서도 문자열로 검사한다.** `register`와 `FormData`가 모두 문자열을 주므로 `z.number()`는 클라이언트에서 항상 실패한다. `z.string().regex(/^\d+$/, { error: "숫자만 입력해 주세요.", abort: true }).refine((value) => Number(value) >= 1, { error: "1 이상이어야 합니다." })`처럼 쓰고 `DEFAULT_VALUES`에는 `""`를 넣는다. 액션에서 통과한 값만 `Number()`로 바꾼다. 검증 전에 바꾸면 빈 칸이 0으로 통과하고, `abort`가 없으면 빈 칸에 오류가 두 개 생긴다.
- **서버 검증을 생략하지 않는다.** Server Action은 UI 없이 직접 POST로 호출될 수 있다.
- **`<form action={formAction} onSubmit={...}>` 구조를 유지한다.** JS가 없으면 `action`이 동작한다.
- `useActionState`에는 `@/lib/form-action`의 `withCallFailure`로 감싼 액션을 넘긴다. 감싸지 않으면 요청이 실패할 때 `error.tsx`로 넘어가 입력이 사라진다.
- 결과 토스트는 `contact-form.tsx`처럼 `withCallFailure`의 세 번째 인자(`notify`)에서 띄우고, 하이드레이션 전에 제출한 결과인 첫 상태만 effect에서 알린다. `state`를 보는 effect에서 띄우면 전송 중에 다른 페이지로 간 방문자가 결과를 못 본다.
- `onSubmit`에서 `event.currentTarget`은 비동기 검증 **전에** 변수로 잡아 둔다.
- `useForm`의 `mode`는 `"onSubmit"`으로 둔다. 칸을 벗어날 때 검증하면 오류가 나타나며 버튼이 밀려 누르던 클릭이 사라진다.
- 실패 문구(`state.message`)는 토스트와 함께 제출 버튼 아래에도 남기고, 다시 보내는 동안(`pending`)에는 감춘다. 토스트는 몇 초 뒤 사라지고 JS가 없으면 뜨지 않는다.
- 제출 버튼처럼 아이콘 옆에서 바뀌는 문구는 `<span>`으로 감싼다. 맨 글자면 브라우저 번역을 켠 방문자에게 폼이 오류 화면으로 바뀐다.
- 중복 제출은 `contact-form.tsx`처럼 `submittingRef`로 막고, `state`가 아니라 `pending`이 끝날 때 푼다.
- Select 같은 비네이티브 입력은 `register`가 아니라 `Controller`로 묶고 `name`을 준다. `field.ref`는 포커스를 받는 요소(트리거)에 연결한다.
- `Controller`를 쓰는 폼은 `contact-form.tsx`처럼 `shouldFocusError: false`로 두고 `FIELD_ORDER`에 화면 순서를 적어 첫 오류 칸에 `setFocus`한다. 기본 포커스는 등록 순서라 `Controller` 칸을 건너뛴다.
- zod v4 문법(`{ error: "..." }`, `z.email()`)은 참조 스키마 파일을 따른다.

## `mergeErrors`

`mergeErrors`는 `@/lib/utils`에 있다. 새 폼은 이것을 import하고 복제하지 않는다.
