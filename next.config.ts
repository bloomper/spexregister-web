import type {NextConfig} from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    reactCompiler: true,
    experimental: {
        serverActions: {
            bodySizeLimit: "15mb",
        },
    },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
