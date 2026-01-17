'use client';

import { Provider } from 'jotai';
import { PropsWithChildren } from 'react';

/**
 * Jotai Provider 래퍼
 *
 * SSR 환경에서 전역 스토어 공유 문제를 방지합니다.
 * 각 요청마다 독립적인 스토어를 생성하여 사용자 간 상태 격리를 보장합니다.
 */
const JotaiProvider = ({ children }: PropsWithChildren) => {
  return <Provider>{children}</Provider>;
};

export default JotaiProvider;
