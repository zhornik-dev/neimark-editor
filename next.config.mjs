/** @type {import('next').NextConfig} */
const nextConfig = {
  // Убираем 'standalone' — Vercel сам это контролирует
  images: {
    unoptimized: true,
  },
};

export default nextConfig;