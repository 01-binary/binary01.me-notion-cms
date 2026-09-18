/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  // Notion 요청이 프로세스 전역 큐(≈2.7 req/s)를 거치므로 페이지당 대기가 기본 60초를 넘을 수 있음
  staticPageGenerationTimeout: 180,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'www.notion.so' },
      { protocol: 'https', hostname: 's3.us-west-2.amazonaws.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  cacheLife: {
    // hours + expire: never
    hoursForever: {
      stale: 300, // 5분
      revalidate: 3600, // 1시간
    },
    // days + expire: never
    daysForever: {
      stale: 300, // 5분
      revalidate: 86400, // 1일
    },
    // weeks + expire: never
    weeksForever: {
      stale: 300, // 5분
      revalidate: 604800, // 1주
    },
  },
  experimental: {
    optimizePackageImports: ['dayjs'],
    useCache: true,
    // Notion 요청 큐는 프로세스 단위 → 정적 생성 워커를 1개로 고정해야 커넥션 한도가 전역으로 지켜짐
    cpus: 1,
    // 큐를 나눠 쓰는 동시 페이지 수를 줄여 블록이 많은 글이 타임아웃되지 않게 함
    staticGenerationMaxConcurrency: 4,
  },
};

export default nextConfig;
