import {defineConfig} from "vitest/config";
import {fileURLToPath} from "node:url";
import {dirname, resolve} from "node:path";

const rootDir = dirname(fileURLToPath(import.meta.url));
const noop = resolve(rootDir, "test/noop-module.ts");

export default defineConfig({
    resolve: {
        alias: {
            "@": resolve(rootDir, "src"),
            "server-only": noop,
            "client-only": noop,
        },
    },
    test: {
        environment: "jsdom",
        pool: "vmThreads",
        globals: true,
        setupFiles: ["./vitest.setup.ts"],
        include: ["src/**/*.{test,spec}.{ts,tsx}"],
        reporters: process.env.CI ? ["default", "junit"] : ["default"],
        outputFile: {junit: "./test-results/junit.xml"},
        coverage: {
            provider: "v8",
            reporter: ["text", "html", "lcov", "json-summary", "json"],
            reportsDirectory: "./coverage",
            include: ["src/utils/**", "src/hooks/**", "src/lib/**", "src/app/api/**", "src/app/stats/**", "src/components/**"],
            exclude: [
                "**/*.d.ts",
                "**/__tests__/**",
                "src/hooks/use-mobile.ts",
                "src/components/ui/**",
                "src/hooks/use-job-tracker.client.tsx",
            ],
            // A floor at today's level over the widened scope, to be raised as the components get tests
            thresholds: {
                statements: 68,
                branches: 59,
                functions: 60,
                lines: 68,
            },
        },
    },
});
