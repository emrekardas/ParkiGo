/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      "fs": false,
      "net": false,
      "tls": false,
      "crypto": false,
    };
    return config;
  },
  experimental: {
    appDir: true,
  },
};

export default nextConfig;
