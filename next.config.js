/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: ['www.notion.so', 's3.us-west-2.amazonaws.com', 'images.unsplash.com'],
  },
  experimental: {
    scrollRestoration: true,
  },
};

module.exports = nextConfig;
