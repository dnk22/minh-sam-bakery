import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentUpgrade: "security",
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/cms/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, private" }],
      },
      {
        source: "/api/cms/auth/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, private" }],
      },
    ];
  },
};

export default nextConfig;
