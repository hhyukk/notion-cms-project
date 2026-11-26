import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 홈은 정확히 일치할 때만, 나머지는 하위 경로에서도 활성으로 본다.
// "/" 경계까지 확인하는 건 /contact가 /contact-us까지 활성으로 잡지 않게 하기 위해서다.
export function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

// 클라이언트 검증 에러와 서버가 돌려준 에러를 하나의 FieldError로 합친다.
// FieldError가 react-hook-form에 묶여 있지 않은 범용 시그니처라 이게 가능하다.
export function mergeErrors(
  clientError: { message?: string } | undefined,
  serverMessages: string[] | undefined
) {
  return [
    clientError,
    ...(serverMessages ?? []).map((message) => ({ message })),
  ]
}
