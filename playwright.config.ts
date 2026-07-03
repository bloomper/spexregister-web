import {defineConfig, devices} from "@playwright/test";
import {APP_PORT, AUTH_SECRET, BASE_URL, MOCK_PORT, STORAGE_STATE} from "./e2e/constants";

const appEnv: Record<string, string> = {
    AUTH_SECRET,
    AUTH_TRUST_HOST: "true",
    AUTH_URL: BASE_URL,
    AUTH_KEYCLOAK_ID: "e2e",
    AUTH_KEYCLOAK_SECRET: "e2e",
    AUTH_KEYCLOAK_ISSUER: `http://localhost:${MOCK_PORT}/realms/e2e`,
    API_GRAPHQL_ENDPOINT: `http://localhost:${MOCK_PORT}/api/graphql`,
    API_REST_BASE_URL: `http://localhost:${MOCK_PORT}`,
    NEXT_PUBLIC_AUTH_URL: BASE_URL,
    NEXT_PUBLIC_AUTH_KEYCLOAK_ID: "e2e",
    NEXT_PUBLIC_AUTH_KEYCLOAK_ISSUER: `http://localhost:${MOCK_PORT}/realms/e2e`,
    NEXT_PUBLIC_API_BASE_URL: `http://localhost:${MOCK_PORT}/api`,
};

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: false,
    workers: 1,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI
        ? [["github"], ["html", {open: "never"}], ["junit", {outputFile: "test-results/e2e-results.xml"}]]
        : [["list"], ["html", {open: "never"}]],
    timeout: 30_000,
    use: {
        baseURL: BASE_URL,
        trace: "on-first-retry",
    },
    projects: [
        {name: "setup", testMatch: /auth\.setup\.ts/},
        {
            name: "chromium",
            use: {...devices["Desktop Chrome"], storageState: STORAGE_STATE},
            dependencies: ["setup"],
        },
    ],
    webServer: [
        {
            command: "node e2e/mock-backend.mjs",
            port: MOCK_PORT,
            env: {MOCK_PORT: String(MOCK_PORT)},
            reuseExistingServer: !process.env.CI,
            stdout: "pipe",
        },
        {
            command: `next build && next start -p ${APP_PORT}`,
            port: APP_PORT,
            env: {...appEnv, PORT: String(APP_PORT)},
            timeout: 240_000,
            reuseExistingServer: !process.env.CI,
            stdout: "pipe",
        },
    ],
});
