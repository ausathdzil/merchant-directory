import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
    viewTransition: true,
  },
  typedRoutes: true,
};

export default nextConfig;
