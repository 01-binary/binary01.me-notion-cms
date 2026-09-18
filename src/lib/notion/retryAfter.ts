const MS_PER_SECOND = 1_000;

/**
 * HTTP Retry-After 헤더 값을 대기 시간(ms)으로 변환합니다.
 *
 * 초 단위 정수("57")와 HTTP-date("Fri, 18 Sep 2026 16:56:47 GMT") 두 형식을 지원하며,
 * 헤더가 없거나 해석할 수 없으면 null을 반환합니다.
 */
export const parseRetryAfterMs = (header: string | null, now = Date.now()): number | null => {
  if (!header) {
    return null;
  }

  const value = header.trim();

  if (/^\d+$/.test(value)) {
    return Number(value) * MS_PER_SECOND;
  }

  const retryAt = Date.parse(value);
  if (Number.isNaN(retryAt)) {
    return null;
  }

  return Math.max(0, retryAt - now);
};
