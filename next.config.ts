import type { NextConfig } from "next";
import withPWA from "next-pwa";

const withPwaPlugin = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // ✅ disable PWA in dev (keep it!)
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ], // ✅ required for external image support
  },
  experimental: {
    serverComponentsHmrCache: true, // ✅ cache server component fetches in dev
  },
  logging: {
    fetches: {
      fullUrl: true, // ✅ useful for seeing full API logs in dev
    },
  },
};

export default withPwaPlugin(nextConfig);
