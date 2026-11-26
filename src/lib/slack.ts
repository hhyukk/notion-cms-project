/**
 * Slack mrkdwn은 `<!channel>`, `<http://...|문구>` 같은 꺾쇠 문법을 해석한다.
 * 사용자 입력을 그대로 넣으면 채널 전체 멘션이나 위장 링크를 심을 수 있으므로 이스케이프한다.
 */
export function escapeSlackText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Incoming Webhook으로 메시지를 보낸다.
 * 예외를 던지면 Server Action이 실패 이유를 담은 상태를 돌려줄 수 없으므로, 실패는 false로 돌려준다.
 */
export async function sendSlackMessage(text: string): Promise<boolean> {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) {
    console.error("[slack] SLACK_WEBHOOK_URL이 설정되지 않았습니다.");
    return false;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      // 액션이 끝날 때까지 방문자의 페이지 이동도 함께 멈추므로, 응답이 없으면 오래 붙잡지 않는다.
      signal: AbortSignal.timeout(5_000),
    });
    if (!res.ok) {
      // URL 자체가 비밀값이므로 로그에는 상태만 남긴다.
      console.error(`[slack] 전송 실패: ${res.status} ${await res.text()}`);
      return false;
    }
    return true;
  } catch (error) {
    // 주소가 잘못되면 예외 메시지와 cause에 URL이 그대로 담기므로 원인 코드만 남긴다.
    // 제한 시간을 넘긴 예외는 cause가 없어 이름(TimeoutError)으로 구분한다.
    const cause = error instanceof Error ? error.cause : undefined;
    const name = error instanceof Error ? error.name : "UNKNOWN";
    const code = cause instanceof Error && "code" in cause ? cause.code : name;
    console.error(`[slack] 전송 중 예외: ${code}`);
    return false;
  }
}
