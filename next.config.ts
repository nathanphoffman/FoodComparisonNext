import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    DB_VERSION: 'v65',
  },

  // suppress lockfile warning when nested inside a monorepo-style parent
  outputFileTracingRoot: path.join(__dirname, '../'),
  serverExternalPackages: ['sql.js'],
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
