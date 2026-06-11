import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.googleusercontent.com' },

      { protocol: 'https', hostname: 'raiyansoft.com' },
      { protocol: 'https', hostname: 'portal.raiyan.cc' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    unoptimized: true,
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
