# 학습 자료 디렉터리

Notion을 CMS로 쓰는 학습 자료 큐레이션 사이트입니다. 큐레이터는 Notion 데이터베이스에서 자료를 관리하고, 방문자는 분야·난이도·형태·가격으로 자료를 찾아봅니다. 방문자가 공개 Notion Form으로 자료를 제보하면, 큐레이터가 검수해 게시합니다.

- 요구사항과 설계: [docs/PRD.md](docs/PRD.md)
- 코드 규칙과 Next.js 16의 함정: [CLAUDE.md](CLAUDE.md)
- [claude-nextjs-starters](https://github.com/hhyukk/claude-nextjs-starters) 스타터에서 시작했습니다.

## 현재 상태

- 기획(PRD)과 Notion 연동 스파이크까지 마쳤습니다.
- 코드는 아직 스타터 상태입니다. PRD 8절의 구현 단계 순서대로 바꿔 나갑니다.

## 기술 스택

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Lucide React · Notion API

## 시작하기

Node.js 20.19 이상(20.x), 22.13 이상(22.x) 또는 24 이상이 필요합니다.

```bash
npm install
npm run dev    # http://localhost:3000
```

## 환경 변수

프로젝트 루트의 `.env.local`에 넣습니다.

| 이름 | 용도 | 상태 |
|---|---|---|
| `NOTION_API_KEY` | Notion 내부 연결(콘텐츠 읽기 전용)의 토큰 | 구현 2단계부터 사용합니다 |
| `NOTION_DATABASE_ID` | 학습 자료 Notion 데이터베이스의 ID | 구현 2단계부터 사용합니다 |
| `SLACK_WEBHOOK_URL` | 문의 내용을 보낼 Slack Incoming Webhook 주소 | 없으면 문의 제출이 항상 실패 메시지를 냅니다 |

- 토큰과 Webhook 주소는 비밀값입니다. `.env*` 파일은 git에 올라가지 않습니다.
- 배포 환경에서는 Vercel 프로젝트의 Environment Variables에 따로 등록합니다. 등록한 값은 다음 배포부터 적용됩니다.

### Notion 준비

데이터베이스 속성과 Status 규칙은 [PRD](docs/PRD.md) 4절에 있습니다.

1. Notion 개발자 포털에서 내부 연결(internal connection)을 만듭니다. 권한은 콘텐츠 읽기만 켭니다.
2. 자료 데이터베이스에 그 연결을 추가합니다.
3. 연결의 토큰과 데이터베이스 ID를 `.env.local`에 넣습니다.

## 명령어

```bash
npm run dev         # 개발 서버
npm run build       # 프로덕션 빌드
npm run lint        # eslint
npx next typegen    # 라우트 타입 생성
npx tsc --noEmit    # 타입 체크
```

방금 클론했거나 페이지를 추가·삭제했다면, 타입 체크 전에 `npx next typegen`을 실행합니다. 라우트 타입이 없거나 오래되면 `tsc`가 `LayoutProps`나 새 경로를 찾지 못합니다.

페이지를 지운 뒤 `.next/dev/types`에서 오류가 나면 `npm run dev`를 다시 띄우거나 그 폴더를 지웁니다.

## 페이지

| 경로 | 지금 | 계획 |
|---|---|---|
| `/` | 스타터 소개 | 자료 목록으로 바꿉니다 |
| `/components` | shadcn/ui 컴포넌트 목록 | 지웁니다 |
| `/contact` | zod 스키마를 클라이언트와 서버가 함께 쓰는 문의 폼 (Slack 전송) | 남기고 문의 주제만 바꿉니다 |
| `/login` | 인증 백엔드가 없는 로그인 폼 예제 | 지웁니다 |

새로 만들 화면(`/resources/[id]`, `/categories/[category]`)은 PRD 5절에 있습니다.

## 알려진 한계

- 로그인은 인증 백엔드가 없어 입력값 검증까지만 합니다. 회원가입 버튼은 안내만 띄웁니다. 로그인 페이지는 지울 예정입니다.
- JavaScript가 꺼져 있으면 문의 유형(Radix Select)을 고를 수 없어 문의를 제출할 수 없습니다.
