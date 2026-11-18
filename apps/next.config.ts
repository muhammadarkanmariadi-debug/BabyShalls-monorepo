import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.babyshalls.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-c79bf05ac4c24cbbb6d632ad82b8062c.r2.dev',
      },
    ],
  },
};

export default nextConfig;
