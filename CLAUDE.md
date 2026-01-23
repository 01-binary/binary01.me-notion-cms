# CLAUDE.md

이 프로젝트의 코딩 컨벤션과 주의사항을 정리한 문서입니다.

## React Compiler 사용

이 프로젝트는 **React Compiler**를 사용합니다. React Compiler가 자동으로 메모이제이션을 처리하므로:

- `useMemo`, `useCallback`, `React.memo`를 **수동으로 추가하지 마세요**
- 컴파일러가 자동으로 최적화하므로 불필요한 메모이제이션 코드는 오히려 가독성을 해칩니다
- 성능 최적화가 필요한 경우 React DevTools Profiler로 먼저 측정하세요

참고: https://react.dev/learn/react-compiler

## 매직 넘버 vs 스타일링 값

**로직 매직 넘버**와 **스타일링 매직 넘버**는 다르게 취급합니다:

- **로직 매직 넘버**: 상수화 필요 (예: `MAX_RETRY_COUNT = 3`, `TIMEOUT_MS = 5000`)
- **스타일링 값**: Tailwind arbitrary value로 충분 (예: `h-[90px]`, `w-[200px]`)

스타일링 값을 무조건 상수화하지 마세요:
- Tailwind arbitrary value는 이미 그 자체로 의미가 명확함
- 재사용되지 않는 스타일 값을 상수로 뽑으면 코드만 늘어남
- 스켈레톤 컴포넌트는 실제 컴포넌트와 정확히 동기화할 필요 없음
