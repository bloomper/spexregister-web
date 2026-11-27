import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  turbopack: {
    root: __dirname,
  },
  output: "standalone",
  reactCompiler: true,
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    authInterrupts: true,
    instantInsights: {
      validationLevel: "manual-warning",
    },
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
  images: {
    localPatterns: [
      {
        pathname: "/api/image-download-proxy",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
