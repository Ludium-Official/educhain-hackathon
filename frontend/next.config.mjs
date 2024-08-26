/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['avatar.iran.liara.run'],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
};

export default nextConfig;
