/**
 * 요청 시작 시각을 일정 간격으로 벌려주는 스케줄러
 *
 * HTTP나 Notion에 대한 지식 없이 "언제 다음 요청을 시작해도 되는가"만 책임집니다.
 * 슬롯 예약은 동기적으로 이루어지므로 동시에 여러 acquire()가 호출되어도
 * 각 요청은 서로 minIntervalMs 이상 떨어진 시각에 시작됩니다.
 */

export interface RateLimiter {
  /** 다음 요청을 시작해도 되는 시각까지 대기합니다 */
  acquire(): Promise<void>;
  /** 지정한 시간 동안 모든 요청 시작을 정지합니다 (예: 429 Retry-After) */
  pause(durationMs: number): void;
}

export interface RateLimiterOptions {
  /** 요청 시작 시각 사이의 최소 간격 (ms) */
  minIntervalMs: number;
}

const sleepUntil = async (timestamp: number) => {
  const delay = timestamp - Date.now();
  if (delay > 0) {
    await new Promise<void>((resolve) => setTimeout(resolve, delay));
  }
};

export const createRateLimiter = ({ minIntervalMs }: RateLimiterOptions): RateLimiter => {
  /** 다음 요청이 시작할 수 있는 가장 이른 시각 */
  let nextSlotAt = 0;
  /** pause()로 인해 요청 시작이 금지된 시각의 끝 */
  let pausedUntil = 0;

  const reserveSlot = () => {
    const slot = Math.max(Date.now(), nextSlotAt, pausedUntil);
    nextSlotAt = slot + minIntervalMs;
    return slot;
  };

  return {
    async acquire() {
      await sleepUntil(reserveSlot());

      // 대기 중 pause()가 호출됐다면 정지가 풀린 뒤 슬롯을 다시 예약해
      // 대기하던 요청들이 한꺼번에 몰리지 않도록 합니다
      while (Date.now() < pausedUntil) {
        await sleepUntil(reserveSlot());
      }
    },

    pause(durationMs) {
      pausedUntil = Math.max(pausedUntil, Date.now() + durationMs);
      nextSlotAt = Math.max(nextSlotAt, pausedUntil);
    },
  };
};
