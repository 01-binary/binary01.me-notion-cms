/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
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
  },
};

export default nextConfig;
