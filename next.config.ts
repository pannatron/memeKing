import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@solana/web3.js', '@solana/spl-token'],
  },
  webpack: (config) => {
    // Externalize large Solana packages to reduce bundle size
    config.externals.push({
      '@solana/web3.js': '@solana/web3.js',
      '@solana/spl-token': '@solana/spl-token',
    });
    return config;
  },
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
