import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // cacheComponents: true, // Invalid option removed
  experimental: {
    allowedDevOrigins: ["222.106.51.63", "localhost:3000"],
  } as any,
};

export default nextConfig;
