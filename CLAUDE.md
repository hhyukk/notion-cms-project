# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## 명령어

```bash
npm run dev              # 개발 서버 (http://localhost:3000)
npm run build            # 프로덕션 빌드 + 타입 체크
npm run lint             # eslint (flat config, 타입 오류는 잡지 않음)
npx next typegen         # 라우트 타입 생성 — 새 클론이거나 라우트를 바꿨으면 tsc보다 먼저
npx tsc --noEmit         # 타입 체크만 — dev 서버를 띄운 채로도 안전
npx shadcn@latest add <name>   # shadcn/ui 컴포넌트를 src/components/ui/ 로 복사
```

## 검증

- **테스트 프레임워크가 없다.** 검증은 `npm run lint` + `npx next typegen` + `npx tsc --noEmit` + 브라우저 확인 조합이다.
- lint·tsc는 `/verify`로 돌린다. 선행 오류 분류와 보고 형식은 `.claude/commands/verify.md`가 소유한다.
- **tsc는 오류 0건이 기준이다.** `next.config.ts`의 `typedRoutes: true` 때문에 `<Link href>`와 `siteConfig.mainNav`(`NavItem<Route>[]`)에는 실제 있는 라우트만 들어간다.
- **라우트를 추가하거나 지웠으면 `npx next typegen`을 먼저 돌린다.** 라우트 타입은 `next dev`가 `.next/dev/types`에, `next build`·`next typegen`이 `.next/types`에 만들고 `tsconfig.json`이 둘 다 읽는다. 겹치면 `.next/types`가 이겨서, dev 서버를 다시 띄워도 새 라우트는 TS2322로 남는다(16.4.6 실측).
- 라우트를 지운 뒤 `.next/dev/types/validator.ts`에서 함께 나는 TS2307(없는 `page.js`)과 TS2344(`__InvalidParamMatchingKeys`)는 남은 생성 파일 때문이다. dev 서버를 다시 띄우거나 `.next/dev/types`를 지운다.
- `typedRoutes`를 끄면 `.next/types/link.d.ts`가 다음 `next build`까지 남아 옛 라우트 목록으로 tsc를 실패시킨다.
- 브라우저 확인은 `.mcp.json`에 등록된 Playwright MCP 서버(`@playwright/mcp`)로 한다.
- `next dev`는 `.next/dev`에, `next build`는 `.next`에 출력하므로 동시에 돌려도 충돌하지 않는다(`01-app/03-api-reference/06-cli/next.md`). 타입만 볼 때는 빌드보다 빠른 `npx tsc --noEmit`을 쓴다.

## 프로젝트 커맨드·에이전트

| 이름 | 용도 |
|---|---|
| `/verify` | lint + tsc, 선행 오류 대비 새 오류만 보고 |
| `/new-page` | 라우트 페이지 생성 + `siteConfig.mainNav` 등록 |
| `/new-form` | 문의 폼 구조를 따른 스키마·Server Action·폼 컴포넌트 3파일 생성 |
| `/git:commit` | 컨벤셔널 커밋 |
| `code-reviewer-korean` (에이전트) | 구현 직후 변경분 한국어 리뷰 |

## Next.js 16에서 달라진 것 (이 코드가 실제로 쓰는 것)

`node_modules/next/dist/docs/`의 번들 문서로 확인한 사항이다. 학습 데이터의 Next.js와 다르다.

- **`error.tsx`에서는 `reset`이 아니라 `retry`를 쓴다.** 둘 다 넘어오지만 `retry`(v16.3.0 stable)는 세그먼트를 다시 가져와 렌더하고, `reset`은 재요청 없이 상태만 비운다 (`01-app/03-api-reference/03-file-conventions/error.md`).
- **`error.tsx`의 `error`는 `unknown`이고 `message`를 화면에 내지 않는다.** 클라이언트에서 던진 값은 Error가 아닐 수 있고 원문은 영어다. 컴포넌트 이름 `Error`가 전역을 가려 `instanceof Error`로 좁히면 TS2339가 난다.
- **라우트 props는 전역 타입으로 온다.** `LayoutProps<"/">`, `PageProps<"/blog/[slug]">`를 쓰고 `params`/`children` 타입을 직접 선언하지 않는다. 타입이 생기는 위치와 갱신 방법은 위 검증 절에 있다.
- **`next build`·`next dev`·`next typegen`은 빠진 옵션이 있으면 `tsconfig.json`을 다시 쓴다.** `allowJs`·`resolveJsonModule`은 지워도 한 번에 복구되고 파일 전체가 재포매팅된다. 두 옵션은 건드리지 않고, `tsconfig.json`을 고쳤다면 셋 중 하나를 돌린 뒤 `git diff tsconfig.json`으로 재포매팅이 끼어들지 않았는지 확인한다.

## 아키텍처

### 폼: 하나의 zod 스키마를 클라이언트와 서버가 공유

문의 폼이 이 스타터킷의 핵심 예제다. 아래 파일이 한 세트로 움직인다.

| 파일 | 역할 |
|---|---|
| `src/lib/validations/contact.ts` | `contactSchema` + `ContactInput` 타입 + `CONTACT_TOPICS` 옵션 |
| `src/app/contact/actions.ts` | `"use server"` — `safeParse` 후 `z.flattenError`로 필드 에러 반환, 통과하면 Slack 전송 |
| `src/components/contact-form.tsx` | `useActionState` + react-hook-form |
| `src/lib/form-action.ts` | `withCallFailure` — 요청 자체의 실패를 오류 상태로 바꾸고 결과를 `notify`로 알림 |
| `src/lib/slack.ts` | `sendSlackMessage`(Incoming Webhook) + `escapeSlackText` |

- **검증 규칙은 스키마 파일에만 둔다.** 클라이언트와 서버가 같은 스키마를 import하므로 한쪽에 덧붙이면 어긋난다.
- **서버는 `FormData`를 거친 값을 검사한다.** textarea의 `\n`은 `\r\n`이 되고 체크박스는 `"on"` 또는 없음이 되어, 스키마가 같아도 결과가 갈린다. 줄바꿈은 스키마의 `.overwrite()`로 되돌리고, 체크박스는 액션에서 스키마 타입으로 바꿔 넣는다.
- **숫자 입력은 스키마에서도 문자열로 검사하고, 통과한 뒤 `Number()`로 바꾼다.** `register`와 `FormData`가 모두 문자열을 주므로 `z.number()`는 클라이언트에서 항상 실패하고, 검증 전에 `Number()`로 바꾸면 빈 칸이 0으로 통과한다.
- **서버 검증을 생략하지 않는다.** Server Action은 UI 없이 직접 POST로 호출될 수 있다.
- **`<form action={formAction} onSubmit={...}>` 구조를 유지한다.** JS가 없으면 `action`이, 있으면 `onSubmit`이 클라이언트 검증을 먼저 돌린다. `event.currentTarget`은 비동기 검증 전에 변수로 잡아 둔다.
- **`useActionState`에는 `withCallFailure`로 감싼 액션을 넘긴다.** 네트워크 실패·5xx·재배포로 사라진 액션은 promise 거부로 오고, 감싸지 않으면 렌더 중에 다시 던져져 `error.tsx`로 넘어가 입력이 사라진다. `01-app/02-guides/offline-support.md`가 설명하는 것은 네트워크 단절의 거부까지고, 나머지는 React 코드와 모의 응답 재현으로 확인했다(16.4.6).
- **결과 토스트는 폼의 effect가 아니라 `withCallFailure`의 `notify`에서 띄운다.** 전송 중에 다른 페이지로 가면 이동과 결과가 함께 커밋되며 폼이 사라져, effect로는 실패해도 알릴 수 없다. 하이드레이션 전에 제출한 결과는 `withCallFailure`를 거치지 않고 첫 상태로 오므로 그것만 effect에서 알린다.
- **Select 같은 비네이티브 입력은 `Controller`로 묶고 `name`과 `field.ref`를 준다.** Radix Select는 `name`이 있어야 숨은 `<select>`의 값이 `FormData`에 실리고, `field.ref`를 트리거에 연결해야 오류가 났을 때 포커스가 옮겨 간다.
- **`Controller`를 쓰는 폼은 `shouldFocusError: false`로 두고 `FIELD_ORDER`(화면 순서)로 첫 오류 칸에 `setFocus`한다.** RHF 기본 포커스는 등록 순서를 따르는데 `Controller`는 자식이 렌더될 때 등록되어 맨 뒤로 밀린다.
- **아이콘 같은 형제 옆에서 바뀌는 글자는 `<span>`으로 감싼다.** 브라우저 번역은 글자 노드를 `<font>`로 바꿔치기한다. 맨 글자면 React가 그 글자를 지우거나 그 앞에 새 요소를 넣다 예외가 나고 `error.tsx`가 폼을 대체한다. `ui/select.tsx`는 안내 문구와 항목을 이미 감싸지만, `SelectValue`에 `children`을 넘기면 직접 감싼다.
- 클라이언트 에러와 서버 에러는 `@/lib/utils`의 `mergeErrors`로 합쳐 하나의 `FieldError`에 넘긴다.
- **Server Action 안의 외부 전송은 throw하지 않고 실패를 상태로 돌려준다.** 예외가 나면 사용자에게 실패 이유를 알릴 수 없다.
- **외부 전송에는 `AbortSignal.timeout()`으로 제한 시간을 둔다.** 액션이 끝날 때까지 같은 탭의 페이지 이동이 같은 transition에 묶여 멈춘다. 시간 초과 뒤 다시 보내면 중복될 수 있지만 유실보다 낫다고 본다.
- Slack 메시지에 넣는 사용자 입력은 `escapeSlackText`를 거친다 (`<!channel>`·위장 링크 주입 방지).
- `.env.local`에 `SLACK_WEBHOOK_URL`이 없으면 문의 제출은 항상 실패 메시지를 낸다. URL은 비밀값이라 로그에 남기지 않는다.

새 폼은 `/new-form`으로 이 구조를 그대로 따라 만든다.

### 네비게이션·메타데이터 단일 출처

`src/config/site.ts`의 `siteConfig`가 사이트 이름·설명·URL·`mainNav`를 소유한다. 헤더(`main-nav.tsx`), 모바일 드로어(`mobile-nav.tsx`), 푸터(`site-footer.tsx`)가 모두 이 객체를 읽으므로 **내비게이션 링크는 여기서만 고친다.**

- 알려진 예외: `src/app/page.tsx`의 히어로 CTA 두 개는 경로를 하드코딩한다. 건드릴 때는 `siteConfig`와 맞춘다.
- 활성 링크 판정은 `src/lib/utils.ts`의 `isActivePath`(경로 세그먼트 경계 반영)를 재사용한다.
- 루트 레이아웃 `metadata.title`에 `template: "%s | ${siteConfig.name}"`이 있으므로 **하위 페이지는 `title`에 문자열만 넣는다** (`title: "문의"` → `문의 | Next Starter`).
- `metadataBase`가 `siteConfig.url`로 설정돼 있다. 없어도 빌드는 실패하지 않는다(로컬 빌드에서는 OG 이미지 경고만). 상대 경로 OG 이미지는 localhost(Vercel에서는 프로덕션 도메인) 주소로, canonical은 상대 경로 그대로 나간다. 번들 문서(`generate-metadata.md`)는 빌드 오류라고 적지만 16.4.6의 실제 동작은 다르다.

### 서버/클라이언트 경계

기본은 서버 컴포넌트이고, 상호작용이 필요한 최소 조각만 클라이언트로 내린다.

- `src/app/layout.tsx`(서버) → `ThemeProvider`(`"use client"`)가 클라이언트 경계 진입점이다.
- `SiteHeader`는 서버 컴포넌트이고, 그 안의 `MainNav`·`MobileNav`·`ThemeToggle`만 클라이언트다.
- `Toaster`는 `useTheme`을 쓰므로 `ThemeProvider` 밖으로 옮기지 않는다.
- `<html>`의 `suppressHydrationWarning`은 next-themes가 하이드레이션 전에 클래스를 바꾸기 때문에 필요하다. 지우지 않는다.
- **루트에 `loading.tsx`를 두지 않는다.** 모든 페이지가 Suspense로 감싸이고, 레이아웃과 본문의 HTML이 12.8KB를 넘으면 본문이 숨긴 `<div>`로 나가 JS 없이는 스켈레톤만 보인다. 데이터를 기다리는 하위 라우트에만 둔다.

### 스타일: Tailwind CSS v4 (CSS-first)

**`tailwind.config.ts`가 없다. 만들지 않는다.** v4는 CSS에서 직접 테마를 선언한다.

- 모든 설정은 `src/app/globals.css`에 있다: `@import "tailwindcss"` → `@theme inline`의 `--color-*`/`--font-*` 매핑 → `:root`와 `.dark`의 실제 값.
- 다크 모드는 `@custom-variant dark (&:is(.dark *))`로 클래스 기반이며, next-themes의 `attribute="class"`와 짝을 이룬다.
- 색을 새로 넣을 때는 `:root`/`.dark` 양쪽에 토큰을 추가하고 `@theme inline`에 매핑한다. 하드코딩 색상 대신 `bg-background` 같은 토큰 유틸리티를 쓴다.
- 클래스 병합은 `@/lib/utils`의 `cn()`(clsx + tailwind-merge)을 쓴다.
- shadcn 컴포넌트는 `style: "radix-nova"`, `baseColor: "neutral"`(`components.json`)로 생성된다. `src/components/ui/`는 프로젝트 소유라 직접 고쳐도 된다.
- **`shadcn add`로 받은 파일은 `cn`을 `cn` 패키지에서 import하고 그 의존성도 설치한다**(4.23.0에서 확인). import를 모두 `@/lib/utils`로 바꾼 뒤 `npm uninstall cn`을 한다. 기존 `ui/` 파일을 덮어쓸지 물으면 거절한다.
- 쓰지 않는 export(`buttonVariants` 등)와 sidebar·chart 토큰은 지운 상태다. 받은 컴포넌트가 찾으면 원본 스타터 저장소에서 지우기 직전 커밋을 받아 되살린다: `git fetch https://github.com/hhyukk/claude-nextjs-starters.git 33019e7b717f3005a9fb2570721eefb35969aaa6` 후 `git show FETCH_HEAD:<파일>`. 이 저장소는 스타터 히스토리 없이 시작해서 그 커밋이 로컬에 없다. 토큰은 빠져도 tsc에 걸리지 않는다.

## 코드 컨벤션

- **UI 문구와 주석은 한국어로 쓴다.** 기존 코드 전체가 그렇다.
- 주석은 "무엇"이 아니라 "왜"를 남긴다 — 기존 주석처럼 Next.js 16의 함정이나 라이브러리 제약을 설명하는 밀도를 따른다.
- import 경로는 `@/*` 별칭을 쓴다 (`./src/*`로 매핑).
- `AGENTS.md`는 `next dev`가 자동으로 다시 써넣는 파일이다. diff에서 지워도 다시 생기므로 변경분과 함께 커밋한다.
