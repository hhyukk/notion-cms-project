# Next Starter

Next.js 16 App Router · TypeScript · Tailwind CSS v4 · shadcn/ui 기반 스타터킷입니다.

배포: https://claude-nextjs-starters-beta.vercel.app

## 시작하기

Node.js 20.19 이상(20.x), 22.13 이상(22.x) 또는 24 이상이 필요합니다.

```bash
npm install
npm run dev    # http://localhost:3000
```

문의 폼까지 쓰려면 프로젝트 루트에 `.env.local`을 만들고 아래 값을 넣습니다.

## 환경 변수

| 이름 | 용도 | 없으면 |
|---|---|---|
| `SLACK_WEBHOOK_URL` | 문의 내용을 보낼 Slack Incoming Webhook 주소 | 문의 제출이 항상 실패 메시지를 냅니다 |

- 주소 자체가 비밀값입니다. `.env*`는 git에 올라가지 않습니다.
- 배포 환경에는 Vercel 프로젝트의 Environment Variables에 따로 등록합니다. 새 배포부터 적용됩니다.

## 명령어

```bash
npm run dev         # 개발 서버
npm run build       # 프로덕션 빌드
npm run lint        # eslint
npx next typegen    # 라우트 타입 생성
npx tsc --noEmit    # 타입 체크
```

새로 클론한 직후이거나 페이지를 추가·삭제했다면 타입 체크 전에 `npx next typegen`을 실행합니다.
라우트 타입이 없거나 옛것이면 `tsc`가 `LayoutProps`나 새 경로를 찾지 못합니다.
페이지를 지웠는데 `.next/dev/types`에서 오류가 나면 `npm run dev`를 다시 띄우거나 그 폴더를 지웁니다.

## 페이지

| 경로 | 내용 |
|---|---|
| `/` | 소개 |
| `/components` | 포함된 shadcn/ui 컴포넌트 목록 |
| `/contact` | zod 스키마를 클라이언트와 서버가 공유하는 문의 폼 (Slack 전송) |
| `/login` | 같은 구조의 로그인 폼 |

## 알려진 한계

- 로그인은 인증 백엔드가 없어 입력값 검증까지만 합니다. 회원가입 버튼은 안내만 띄웁니다.
- JavaScript가 꺼져 있으면 문의 유형(Radix Select)을 고를 수 없어 문의를 제출하지 못합니다.

폼 구조, 스타일, 서버/클라이언트 경계 같은 설계 규칙은 [CLAUDE.md](CLAUDE.md)에 있습니다.
