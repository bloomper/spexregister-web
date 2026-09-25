import type {NextConfig} from "next";
import createNextIntlPlugin from "next-intl/plugin";

const isDev = process.env.NODE_ENV === "development";

const contentSecurityPolicy = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
    poweredByHeader: false,
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {key: "Content-Security-Policy", value: contentSecurityPolicy},
                    {key: "X-Content-Type-Options", value: "nosniff"},
                    {key: "X-Frame-Options", value: "DENY"},
                    {key: "Referrer-Policy", value: "strict-origin-when-cross-origin"},
                    {key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()"},
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
    experimental: {
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
