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
        globals: true,
        setupFiles: ["./vitest.setup.ts"],
        include: ["src/**/*.{test,spec}.{ts,tsx}"],
        reporters: process.env.CI ? ["default", "junit"] : ["default"],
        outputFile: {junit: "./test-results/junit.xml"},
        coverage: {
            provider: "v8",
            reporter: ["text", "html", "lcov"],
            reportsDirectory: "./coverage",
            include: ["src/utils/**", "src/hooks/**"],
            exclude: [
                "**/*.d.ts",
                "src/hooks/use-job-tracker.client.tsx",
            ],
            thresholds: {
                statements: 85,
                branches: 80,
                functions: 85,
                lines: 85,
            },
        },
    },
});
