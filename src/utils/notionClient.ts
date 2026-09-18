import { Client } from 'notion-to-utils';

import { env } from '@/lib/env';
import {
  createPacedFetch,
  createRateLimiter,
  FALLBACK_RETRY_DELAY_MS,
  MAX_RETRIES,
  MAX_RETRY_DELAY_MS,
  MIN_REQUEST_INTERVAL_MS,
} from '@/lib/notion';

const MS_PER_SECOND = 1_000;

/**
 * Turbopack이 레이어(page/route)별로 이 모듈을 따로 평가할 수 있으므로,
 * 요청 큐가 프로세스에 하나만 존재하도록 클라이언트를 globalThis에 고정합니다.
 * (워커 1개 = 프로세스 1개 = Notion 커넥션 한도 1개)
 */
const GLOBAL_CLIENT_KEY = Symbol.for('binary01.notionClient');

const createNotionClient = () => {
  const notionFetch = createPacedFetch({
    limiter: createRateLimiter({ minIntervalMs: MIN_REQUEST_INTERVAL_MS }),
    maxRetries: MAX_RETRIES,
    fallbackRetryDelayMs: FALLBACK_RETRY_DELAY_MS,
    maxRetryDelayMs: MAX_RETRY_DELAY_MS,
    onRateLimited: ({ attempt, maxRetries, delayMs }) => {
      const delaySeconds = Math.ceil(delayMs / MS_PER_SECOND);
      console.warn(
        `[notion] rate limited — pausing ${delaySeconds}s before retry ${attempt}/${maxRetries}`,
      );
    },
  });

  // SDK 내부 호출(notion-to-utils의 재귀 blocks.children.list 포함)이 모두 이 fetch를 거칩니다
  return new Client({ auth: env.notionToken, fetch: notionFetch });
};

const globalRegistry = globalThis as unknown as Record<symbol, Client | undefined>;
const notionClient = (globalRegistry[GLOBAL_CLIENT_KEY] ??= createNotionClient());

export default notionClient;
