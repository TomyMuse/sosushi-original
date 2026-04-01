import type { NextConfig } from "next";

const isStaticBuild = process.env.BUILD_TARGET === 'static'

const nextConfig: NextConfig = {
  output: isStaticBuild ? 'export' : 'standalone',
  trailingSlash: isStaticBuild,
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  images: {
    unoptimized: isStaticBuild,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
      },
      {
        protocol: 'https',
        hostname: 'postimg.cc',
      },
    ],
  },
};

export default nextConfig;
