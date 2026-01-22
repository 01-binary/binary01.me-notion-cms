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
  experimental: {
    optimizePackageImports: ['dayjs'],
    useCache: true,
  },
};

export default nextConfig;
