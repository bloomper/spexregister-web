import {beforeAll, describe, expect, it, vi} from "vitest";

// The real Better Auth instance, not the stub from vitest.setup.ts.
vi.unmock("@/auth");

vi.hoisted(() => {
    process.env.BETTER_AUTH_URL = "https://app.test";
    process.env.AUTH_SECRET = "test-secret-at-least-32-characters-long";
    process.env.KEYCLOAK_ISSUER = "https://auth.test/realms/test";
    process.env.KEYCLOAK_CLIENT_ID = "app";
    process.env.KEYCLOAK_CLIENT_SECRET = "secret";
});

// No Keycloak here: OIDC discovery gets an answer at once instead of reaching the network.
vi.stubGlobal("fetch", vi.fn(async () => new Response(null, {status: 503})));
vi.spyOn(console, "error").mockImplementation(() => undefined);

type Handler = (request: Request) => Promise<Response>;
let GET: Handler;
let POST: Handler;

beforeAll(async () => {
    ({GET, POST} = await import("@/app/api/auth/[...all]/route"));
});

const request = (method: string, path: string) =>
    new Request(`https://app.test${path}`, {
        method,
        headers: {origin: "https://app.test", "content-type": "application/json"},
        body: method === "POST" ? "{}" : undefined,
    });

describe("Better Auth endpoints that return Keycloak tokens", () => {
    it.each([
        ["POST", "/api/auth/get-access-token"],
        ["POST", "/api/auth/get-access-token/"],
        ["POST", "/api/auth/refresh-token"],
        ["GET", "/api/auth/account-info"],
    ])("answers %s %s with 404", async (method, path) => {
        const response = await (method === "POST" ? POST : GET)(request(method, path));

        expect(response.status).toBe(404);
    });

    it("still serves the session endpoint the browser uses", async () => {
        const response = await GET(request("GET", "/api/auth/get-session"));

        expect(response.status).toBe(200);
    });

    it("still runs getAccessToken in-process on the server", async () => {
        const {auth} = await import("@/auth");

        // Reaches the endpoint itself (no session, so unauthorized) instead of being cut off as not found.
        await expect(auth.api.getAccessToken({body: {useAccountCookie: true}, headers: new Headers()}))
            .rejects.toMatchObject({statusCode: 401});
    });
});
