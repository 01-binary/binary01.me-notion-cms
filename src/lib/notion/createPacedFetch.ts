import type { RateLimiter } from './rateLimiter';
import { parseRetryAfterMs } from './retryAfter';

const HTTP_STATUS_TOO_MANY_REQUESTS = 429;

/**
 * `@notionhq/client`의 `fetch` 옵션과 호환되는 시그니처.
 * 표준 fetch보다 좁게 잡아 SDK의 SupportedFetch에 그대로 대입할 수 있게 합니다.
 */
export type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;

export interface RateLimitedEvent {
  url: string;
  /** 이번이 몇 번째 재시도인지 (1부터 시작) */
  attempt: number;
  maxRetries: number;
  /** 재시도 전까지 큐 전체가 정지되는 시간 */
  delayMs: number;
}

export interface PacedFetchOptions {
  /** 요청 시작 간격을 관리하는 스케줄러. 429를 받으면 이 스케줄러를 정지시킵니다 */
  limiter: RateLimiter;
  /** 429 응답에 대한 최대 재시도 횟수 */
  maxRetries: number;
  /** Retry-After 헤더가 없거나 해석할 수 없을 때의 대기 시간 */
  fallbackRetryDelayMs: number;
  /** Retry-After 대기 시간 상한 */
  maxRetryDelayMs: number;
  /** 429를 받아 큐를 정지할 때 호출됩니다 (로깅용) */
  onRateLimited?: (event: RateLimitedEvent) => void;
  /**
   * 실제 요청을 수행하는 fetch.
   * 기본값은 호출 시점의 `globalThis.fetch`로, Next.js가 패치한 fetch(데이터 캐시 등)가 그대로 적용됩니다.
   */
  fetch?: FetchLike;
}

/** 재시도 전 이전 응답의 소켓을 반납합니다 */
const discardBody = async (response: Response) => {
  await response.body?.cancel().catch(() => undefined);
};

/**
 * 모든 요청을 RateLimiter의 슬롯에 맞춰 시작하고,
 * 429 응답을 받으면 Retry-After만큼 큐 전체를 정지시킨 뒤 재시도하는 fetch를 만듭니다.
 *
 * Notion 문서가 권고하는 "단일 outgoing 큐 + Retry-After 준수" 패턴의 구현입니다.
 */
export const createPacedFetch = ({
  limiter,
  maxRetries,
  fallbackRetryDelayMs,
  maxRetryDelayMs,
  onRateLimited,
  fetch: fetchImpl,
}: PacedFetchOptions): FetchLike => {
  const doFetch: FetchLike = fetchImpl ?? ((url, init) => globalThis.fetch(url, init));

  return async (url, init) => {
    for (let attempt = 0; ; attempt++) {
      await limiter.acquire();
      const response = await doFetch(url, init);

      if (response.status !== HTTP_STATUS_TOO_MANY_REQUESTS || attempt >= maxRetries) {
        return response;
      }

      const retryAfterMs = parseRetryAfterMs(response.headers.get('retry-after'));
      const delayMs = Math.min(retryAfterMs ?? fallbackRetryDelayMs, maxRetryDelayMs);

      await discardBody(response);
      limiter.pause(delayMs);
      onRateLimited?.({ url, attempt: attempt + 1, maxRetries, delayMs });
    }
  };
};
