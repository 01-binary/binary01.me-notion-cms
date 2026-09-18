/**
 * Notion API 요청 한도 정책
 *
 * Notion은 2026-09-09부터 커넥션(integration)당 고정 60초 윈도우 예산을 적용합니다.
 * Business/Enterprise 플랜은 600 req/min, 그 외 플랜은 180 req/min이며,
 * 초과 시 429(rate_limited)와 함께 윈도우 리셋까지 남은 시간이 Retry-After 헤더로 내려옵니다.
 *
 * @see https://developers.notion.com/reference/request-limits
 */

/** 커넥션당 분당 요청 예산 (Business/Enterprise 외 플랜 기준) */
const REQUESTS_PER_MINUTE = 180;

/**
 * 예산 중 이 프로세스의 요청 큐가 사용할 비율.
 *
 * 한도는 integration 토큰 단위인데 큐는 프로세스 단위라, 같은 토큰을 쓰는 다른 프로세스
 * (운영 사이트의 ISR 재검증, 로컬 next dev, 동시에 도는 다른 Vercel 빌드)의 요청이 끼어들면
 * 합계가 한도를 넘을 수 있습니다. 그런 사소한 간섭을 흡수하기 위한 여유입니다.
 */
const BUDGET_USAGE_RATIO = 0.9;

const MS_PER_MINUTE = 60_000;

/** 요청 시작 시각 사이의 최소 간격 (≈371ms, 약 162 req/min) */
export const MIN_REQUEST_INTERVAL_MS = Math.ceil(
  MS_PER_MINUTE / (REQUESTS_PER_MINUTE * BUDGET_USAGE_RATIO),
);

/** 429 응답에 대한 최대 재시도 횟수 */
export const MAX_RETRIES = 3;

/** Retry-After 헤더가 없거나 해석할 수 없을 때의 대기 시간 */
export const FALLBACK_RETRY_DELAY_MS = 5_000;

/** Retry-After 대기 시간 상한. 커넥션 한도의 Retry-After는 최대 60초입니다 */
export const MAX_RETRY_DELAY_MS = 60_000;
