import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // suppress lockfile warning when nested inside a monorepo-style parent
  outputFileTracingRoot: path.join(__dirname, '../'),
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
