import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['kodama-id'],
  serverExternalPackages: ['@resvg/resvg-js'],
};

export default nextConfig;
