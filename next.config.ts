import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  turbopack: {},
  allowedDevOrigins: ["preview-chat-251a922c-8752-4c24-abdf-8afc71216852.space-z.ai"],
};

export default nextConfig;
