# 학습 자료 디렉터리 PRD

Notion을 CMS로 쓰는 학습 자료 큐레이션 웹 프로젝트의 제품 요구사항 문서다.

- 작성일: 2026-11-26
- 근거
  - 아이디어 후보 7개 비교
  - 실제 Notion DB와 REST API로 돌린 스파이크
  - 이 레포의 현재 코드

## 1. 프로젝트 개요

- **프로젝트명**: 학습 자료 디렉터리
  - 작업명이다. 사이트에 보이는 이름은 `src/config/site.ts`의 `siteConfig.name`에서 바꾼다.
- **목적**: Notion을 CMS로 활용해, 검증된 학습 자료를 분야·난이도·형태·가격으로 찾아보는 큐레이션 목록 사이트를 만든다.
- **선정 근거**
  - 블로그·체인지로그·포트폴리오 등 7개 후보를 같은 기준으로 비교했다.
  - Notion의 강점인 DB 속성·표 보기·Forms를 그대로 쓴다.
  - Notion의 약점인 요청 한도·파일 URL 만료·본문 렌더링은 거의 건드리지 않는다.
- **대상 사용자**
  - 방문자: 공부할 자료를 찾는 학습자
  - 큐레이터: Notion에서 자료를 추가·검수·수정하는 사람
  - 제보자: 공개 폼으로 자료를 추천하는 사람
- **CMS 선택 이유**: Notion API를 활용하여 비개발자도 콘텐츠를 관리할 수 있다.
  - 표 보기에서 여러 자료를 한 번에 고칠 수 있다.
  - Notion Forms로 받은 제보가 같은 DB에 쌓이고, Status 속성 하나로 검수 흐름이 생긴다.
  - 별도 CMS 서버나 관리자 화면을 만들 필요가 없다.
- **Notion Sites로 게시하지 않고 직접 만드는 이유**
  - 방문자가 직접 쓰는 필터·정렬이 필요하다.
    - Notion Sites가 이 기능을 지원하는지는 공식 문서로 확인하지 못했다.
    - 서드파티 빌더(Super.so)가 이 기능을 따로 판다.
  - 자료와 카테고리마다 제목·설명·OG 메타를 갖춘 정적 페이지(SEO)를 만들 수 있다.

## 2. 주요 기능

1. **자료 탐색**
   - 게시된 자료를 카드 목록으로 보여 준다.
   - Category·Format·Level·Pricing 필터, Tags 필터, 이름·설명 검색, 최신순·이름순 정렬을 제공한다.
   - 필터 상태는 URL 쿼리에 남긴다. 그래서 링크를 공유하거나 새로고침해도 유지된다.
2. **자료·카테고리 페이지**
   - 자료마다 상세 페이지를, 분야마다 카테고리 페이지를 정적으로 만들고 제목·설명·OG 메타를 붙인다.
   - 상세 페이지에서 원본 자료로 이동한다.
3. **자료 제보와 검수**
   - 공개 Notion Form으로 받은 제보는 Status 빈 값(미검토)으로 들어와 사이트에 나가지 않는다.
   - 큐레이터가 `게시`로 바꾸면 다음 재생성 때 공개된다.

기존 문의 페이지(`/contact`)는 남겨 "링크 오류 신고·자료 수정 요청·일반 문의"를 받는다.

## 3. 기술 스택

| 영역 | 선택 | 비고 |
|---|---|---|
| 프레임워크 | Next.js 16.4.6 (App Router), React 19.2.8, TypeScript 5 | 템플릿 초안에는 Next.js 15로 적혀 있었다. 이 레포의 `package.json` 버전으로 고쳤다 |
| CMS | Notion API (`Notion-Version: 2026-03-11`), 공식 SDK `@notionhq/client` | DB 행은 data source 쿼리로 읽는다. SDK를 고른 이유는 429·529 응답을 받으면 `Retry-After`만큼 기다렸다 다시 보내기 때문이다 |
| 데이터 검증 | zod 4 | 이미 쓰고 있는 의존성이다. Notion 속성을 파싱하고 검증한다 |
| 스타일 | Tailwind CSS v4 (CSS-first), shadcn/ui (`radix-nova`) | 테마 토큰은 `src/app/globals.css`에 있다 |
| 아이콘 | Lucide React | |
| 렌더링 | 정적 생성 + ISR (`revalidate` 1시간) | ISR은 Node.js 런타임에서만 동작하고 static export에서는 쓸 수 없다(번들 문서 `01-app/02-guides/incremental-static-regeneration.md`) |

## 4. Notion 데이터베이스 구조

DB 이름은 "학습 자료 디렉터리"다. 사이트는 내부 연결(읽기 전용) 토큰으로 이 DB를 읽는다. 아래 표는 2026-11-26 스파이크에서 REST API 응답과 일치하는 것을 확인한 스키마다.

| 필드 | 타입 | 설명 |
|---|---|---|
| Name | title | 자료명 |
| ID | unique_id | 자동으로 매겨지는 번호. 상세 페이지 URL 키로 쓴다. 이름을 바꿔도 URL이 유지된다 |
| Link | url | 원본 자료 주소 |
| Summary | rich_text | 추천 이유 한두 줄. 카드와 메타 설명에 쓴다 |
| Category | select | 분야: 프론트엔드, 백엔드, CS 기초, 데이터·AI, 개발 도구 |
| Format | select | 형태: 강의, 문서, 책, 영상, 인터랙티브 |
| Level | select | 난이도: 입문, 중급, 고급 |
| Pricing | select | 가격: 무료, 유료, 부분 무료 |
| Tags | multi_select | 세부 주제(예: JavaScript, React, Git, 운영체제). 큐레이터가 늘린다 |
| Status | select | 게시, 보관. 빈 값은 미검토 |
| Logo | url | 선택 항목. 외부 이미지 URL만 넣는다 |
| Published | date | 게시일. 최신순 정렬에 쓴다 |
| Edited | last_edited_time | 마지막 수정 시각. MVP 이후 증분 동기화에 쓴다 |

**Status 규칙**
- `게시`만 사이트에 나간다.
- `보관`은 내린 자료다. 다음 재생성 때 사이트에서 사라진다.
- 빈 값은 미검토다. Form 제보는 이 상태로 들어온다.

**제보 폼(Notion Form 뷰 "제보 폼")**
- 질문은 Name·Link·Summary·Category·Format·Level·Pricing이다.
  - Status는 넣지 않는다. 제보자가 공개 여부를 정할 수 없게 하기 위해서다.
- "웹에서 링크가 있는 누구나"로 공유한다. 로그인하지 않은 시크릿 창에서 제출이 되는 것을 확인했다.
- 지금은 질문이 Name 하나뿐이다.
  - 나머지 6개는 Notion 화면에서 추가해야 한다.
  - Notion MCP 커넥터로 폼을 만들었을 때 질문은 추가되지 않았다.

## 5. 화면 구성

| 경로 | 화면 | 내용 |
|---|---|---|
| `/` | 자료 목록 | 소개 한 줄, 필터 바(분야·형태·난이도·가격·태그·검색·정렬), 카드 그리드. 카드에는 이름·Summary·속성 배지·Tags를 보여 준다 |
| `/resources/[id]` | 자료 상세 | `unique_id` 번호로 찾는다. 이름, Summary, 속성 배지, 원본 링크 버튼, 해당 카테고리 페이지 링크를 보여 준다 |
| `/categories/[category]` | 카테고리 | 한 분야의 자료 목록. 카테고리 이름을 그대로 URL에 쓴다 |
| `/contact` | 문의 | 기존 문의 폼을 그대로 두고 문의 주제만 바꾼다 |

**공통 요소**
- 헤더: 메뉴(자료·문의)와 "자료 제보" 버튼. 버튼은 공개 Notion Form으로 가는 외부 링크다.
- 푸터: 제보·문의 링크
- 404: 기존 `src/app/not-found.tsx`를 쓴다. 없는 자료 ID도 여기로 보낸다.

**지울 화면**
- `/components`: 컴포넌트 쇼케이스
- `/login`: 인증 백엔드 없이 항상 실패를 돌려주는 데모

## 6. MVP 범위

**포함**
- 주요 기능 1~3
- 문의 페이지 유지(주제 변경)

**제외**
- 로그인·북마크·평점·댓글·투표
- 자체 제출 API: Notion Form이 같은 일을 한다. 덕분에 연결에 쓰기 권한을 주지 않아도 된다.
- 상세 본문 렌더링: Summary로 대신한다.
- Notion에 업로드한 이미지: Logo는 외부 URL만 쓴다.
- 웹훅 즉시 반영, sitemap·RSS, 다국어

**완료 기준**
- 필터 상태가 URL에 남고, 새로고침해도 유지된다.
- 상세 페이지 HTML에 title·description·og 태그가 있다.
- Status를 `보관`으로 바꾸면 다음 재생성 뒤 사이트에서 사라진다.
- Notion에서 속성 이름을 바꾸면 재생성이 실패하고, 기존 페이지는 그대로 남는다.
- 미검토 제보가 클라이언트로 보내는 데이터에 없다.
- `next build` 출력에서 목록·상세·카테고리 라우트가 정적(ISR)으로 표시된다.

**출시 조건**: 게시된 자료가 50개 이상이어야 한다. 빈 디렉터리는 방문자에게 가치가 없다.

**MVP 이후**
- 웹훅을 받아 바뀐 페이지만 `revalidatePath`로 바로 다시 만든다.
- 상세 본문을 마크다운 엔드포인트(`GET /v1/pages/{id}/markdown`)로 받아, `<callout>` 같은 Notion 고유 블록까지 렌더링한다.
- Notion에 업로드한 이미지를 재생성할 때 자체 저장소로 복사한다.
- sitemap·RSS

## 7. 제약과 설계 원칙

| 원칙 | 이유 |
|---|---|
| 방문자 요청 경로에서는 Notion을 호출하지 않는다. 정적 생성·재생성할 때만 부른다 | 요청 한도가 연결당 분당 180회(평균 초당 3회, Business 미만 플랜)다 |
| 공개 여부(`Status=게시`)는 서버 쿼리에서 거른다 | 클라이언트에서 거르면 미검토 제보와 보관 자료가 번들에 실린다 |
| Notion 속성은 zod로 검증하고, 어긋나면 예외를 던진다 | 재검증 중 오류가 나면 Next.js가 마지막으로 성공한 페이지를 계속 내보낸다. 그래서 속성 이름이 바뀌어도 사이트가 조용히 깨지지 않는다 |
| Logo는 url 타입만 쓴다 | Notion에 업로드한 파일의 URL은 1시간 뒤 만료된다 |
| 토큰은 서버에서만 쓰고, 연결 권한은 콘텐츠 읽기만 준다 | 토큰이 새도 피해가 읽기에 그친다. 쓰기는 Notion Form이 맡는다 |
| 카테고리 URL에 카테고리 이름을 그대로 쓴다 | Notion에서 카테고리를 새로 만들어도 코드를 고칠 필요가 없다. 대신 카테고리 이름을 바꾸면 URL도 바뀐다 |
| 스키마 검증은 REST API 응답을 기준으로 한다 | Notion MCP 커넥터는 같은 속성을 `auto_increment_id`·`text`로 보여 주지만, REST API는 `unique_id`·`rich_text`로 돌려준다 |

**환경 변수**(`.env.local`에 두고 커밋하지 않는다)
- `NOTION_API_KEY`: 내부 연결 "학습 자료 디렉터리 사이트"의 토큰
- `NOTION_DATABASE_ID`: 자료 DB의 ID. 실행할 때 이 ID로 data source ID를 얻는다

## 8. 구현 단계

1. **스타터 정리와 사이트 정체성**
   - `siteConfig`의 name·description·mainNav·links를 바꾼다. 헤더·모바일 드로어·푸터가 모두 이 객체를 읽는다.
   - 홈(`src/app/page.tsx`)의 스타터 소개를 걷어 낸다. 히어로 버튼이 `/components`를 하드코딩하고 있으므로 함께 지운다.
   - `/components`·`/login` 라우트와 로그인 전용 파일(`src/components/login-form.tsx`, `src/lib/validations/login.ts`)을 지운다.
   - 문의 주제(`src/lib/validations/contact.ts`의 enum과 `CONTACT_TOPICS`)를 바꾼다.
   - 푸터의 Next.js·Tailwind·shadcn 문서 링크를 제보·문의 링크로 바꾼다.
   - 라우트를 지웠으므로 `npx next typegen`을 돌린 다음 `npx tsc --noEmit`으로 확인한다.
2. **Notion 데이터 계층**
   - `@notionhq/client`를 설치한다.
   - `src/lib/notion/`에 클라이언트, 게시 자료 쿼리(페이지네이션 포함), zod 속성 파싱, `Resource` 타입을 둔다.
3. **목록 화면**
   - 카드 그리드와 필터·검색·정렬을 만든다. 필터는 클라이언트 컴포넌트에서 처리하고 상태를 URL 쿼리에 둔다.
   - 기존 shadcn 컴포넌트(badge·card·input·select·button·skeleton)와 `cn`을 쓴다.
4. **상세·카테고리 페이지**
   - `generateStaticParams`와 `revalidate`로 정적 생성하고, `generateMetadata`로 제목·설명·OG 메타를 붙인다.
   - 하위 페이지의 `title`에는 문자열만 넣는다. 루트 레이아웃의 title template이 사이트 이름을 붙여 준다.
   - 없는 ID는 `notFound()`로 404를 보낸다.
5. **제보 연결과 검증**
   - 헤더에 "자료 제보" 버튼을 단다.
   - `/verify`(lint + tsc)를 돌리고, `next build` 출력에서 라우트가 정적으로 표시되는지 확인한다.
   - Playwright MCP로 목록·필터·상세·404 화면을 확인한다.

## 9. 남은 확인 사항

- `@notionhq/client`의 어느 버전부터 data source API(`dataSources.query`)와 `Notion-Version: 2026-03-11`을 지원하는가
- Notion 쿼리는 POST 요청이다. 이것이 정적 생성·ISR과 어떻게 맞물리는지 `next build` 출력으로 확인한다
- 필터 상태를 URL 쿼리로 읽을 때 정적 페이지에서 지켜야 할 조건을 번들 문서로 확인한다
