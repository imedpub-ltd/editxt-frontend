import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: process.env.NEXT_BASE_PATH || '',
  async rewrites() {
    return [
      {
        source: '/api/dataailab/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
