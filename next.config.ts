import type { NextConfig } from "next";

/**
 * GitHub Pages serves project sites from `/<repo>/`, so the app is built with a
 * base path. Set NEXT_PUBLIC_BASE_PATH to "" when deploying to a custom domain
 * or to a user/organization page (https://<user>.github.io/).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  turbopack: {},
  allowedDevOrigins: ["preview-chat-251a922c-8752-4c24-abdf-8afc71216852.space-z.ai"],
};

export default nextConfig;