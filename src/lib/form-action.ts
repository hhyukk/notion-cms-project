import { unstable_rethrow } from "next/navigation";

/**
 * 요청 자체가 실패하면(네트워크 단절, 5xx, 재배포로 사라진 액션) 액션의 promise가 거부되고,
 * useActionState가 그 값을 렌더 중에 다시 던져 error.tsx가 폼을 대체한다. 입력이 남도록 오류 상태로 바꾼다.
 *
 * 결과는 notify로 알린다. 전송 중에 다른 페이지로 가면 이동이 액션을 기다렸다가 결과와 함께 커밋되어 폼이 사라진다.
 * 폼의 effect에서 알리면 실행되지 않아, 실패해도 방문자가 모른다.
 */
export function withCallFailure<State extends object>(
  action: (prevState: State, formData: FormData) => Promise<State>,
  failedState: State,
  notify: (state: State) => void,
): (prevState: State, formData: FormData) => Promise<State> {
  // 감싼 함수에는 JS 없는 제출에 쓰는 $$FORM_ACTION이 없으므로 SSR에는 서버 액션을 그대로 넘긴다.
  // 브라우저의 서버 액션에는 원래 그 값이 없어, 양쪽이 달라도 하이드레이션 결과는 같다.
  if (typeof window === "undefined") return action;

  return async (prevState, formData) => {
    let state = failedState;
    try {
      state = await action(prevState, formData);
    } catch (error) {
      // redirect()·notFound()도 거부로 온다. 삼키면 같은 페이지로 이동할 때 실패 토스트가 뜨고 404 화면은 나오지 않는다.
      unstable_rethrow(error);
      // error.tsx에 닿지 않으므로 원인은 여기서 남긴다.
      console.error(error);
    }
    notify(state);
    return state;
  };
}
