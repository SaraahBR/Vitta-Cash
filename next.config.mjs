/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
    ],
  },
  // Suprimir warnings de preload do Next.js 16
  experimental: {
    optimizePackageImports: ['@react-oauth/google'],
  },
};

export default nextConfig;

