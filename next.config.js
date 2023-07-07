/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: ['www.notion.so', 's3.us-west-2.amazonaws.com', 'images.unsplash.com'],
  },
  async headers() {
    return [
      {
        // 전체 페이지에 대한 캐시 제어 헤더를 설정합니다.
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'max-age=0, s-maxage=60',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
