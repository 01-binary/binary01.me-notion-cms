/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['www.notion.so', 's3.us-west-2.amazonaws.com', 'images.unsplash.com'],
  },
};

export default nextConfig;
