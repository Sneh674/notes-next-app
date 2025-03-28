import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Disables TypeScript errors from stopping deployment
  },
};

export default nextConfig;
