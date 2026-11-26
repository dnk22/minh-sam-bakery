import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentUpgrade: "security",
  },
  cacheComponents: true,
  partialPrefetching: true,
  allowedDevOrigins: ['192.154.19.102'],
  turbopack: {
    rules: {
      // Tailwind is authored only in the app-level global stylesheet. Running
      // its loader over `*.module.css` changes the resource to `.css.css`, so
      // Turbopack no longer recognizes CSS Modules and exports an empty object.
      "*.css": {
        condition: {
          all: [
            { not: { path: /\.module\.css$/ } },
            { content: /@import\s+["']tailwindcss["']/ },
          ],
        },
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
