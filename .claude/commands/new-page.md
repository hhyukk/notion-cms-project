---
description: '새 라우트 페이지를 만들고 siteConfig 내비게이션에 등록합니다'
---

# Claude 명령어: New Page

Next.js 16과 이 레포의 규칙에 맞춰 새 페이지를 추가합니다.

## 사용법

```
/new-page <경로> <한국어 제목>
```

예: `/new-page about 소개`

입력: $ARGUMENTS

## 프로세스

1. 참조 구현 `src/app/contact/page.tsx`를 먼저 읽고 구조와 스타일을 따른다.
2. `src/app/<경로>/page.tsx`가 이미 있으면 멈추고 알린다.
3. `src/app/<경로>/page.tsx` 생성
   - `export const metadata: Metadata`의 `title`에는 **문자열만** 넣는다. 루트 레이아웃의
     template이 `| Next Starter`를 붙인다.
   - 동적 세그먼트(`[slug]` 등)나 `searchParams`를 쓸 때만 `PageProps<"/경로/[slug]">` 전역 타입으로 props를 받는다.
     `params`·`searchParams`는 Promise라 `await`하고, 타입을 직접 선언하지 않는다. 동기로 선언하면 tsc를 통과한 채 값이 `undefined`다.
4. `src/config/site.ts`의 `mainNav`에 `{ title, href }` 추가
   - 헤더·모바일 드로어는 이 배열을 읽으므로 **그 파일들은 고치지 않는다.**
   - `mainNav`는 `NavItem<Route>[]`라서 `href`가 실제 라우트여야 한다. tsc가 새 경로를 모르면 `npx next typegen`으로 라우트 타입을 다시 생성한다. dev 서버로는 `.next/types`에 남은 옛 타입이 이겨서 갱신되지 않는다.
   - 동적 세그먼트 페이지는 내비게이션에 넣지 않는다.
5. `src/app/page.tsx`의 히어로 CTA는 경로를 하드코딩하고 있다. 새 경로와 어긋나는지 확인만 하고 고치지 않는다.
6. 끝나면 `/verify`로 검증하라고 안내한다.

## 참고사항

- UI 문구와 주석은 한국어로 쓴다. 주석은 "왜"만 남긴다.
- import 경로는 `@/*` 별칭을 쓴다.
- 새 컴포넌트가 필요하면 `src/components/ui/`에 있는 shadcn 컴포넌트를 먼저 찾는다.
