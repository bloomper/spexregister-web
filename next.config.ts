import type {NextConfig} from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    output: 'standalone',
    reactCompiler: true,
    cacheComponents: true,
    experimental: {
        serverActions: {
            bodySizeLimit: "15mb",
        },
    },
    images: {
        localPatterns: [
            {
                pathname: '/api/image-download-proxy',
            },
        ],
    },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
