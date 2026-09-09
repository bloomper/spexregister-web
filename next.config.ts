import type {NextConfig} from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
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
