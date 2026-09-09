import {beforeEach, describe, expect, it, vi} from "vitest";
import {NextRequest} from "next/server";
import {proxy} from "@/proxy";

const getAccessTokenMock = vi.fn();

vi.mock("@/auth", () => ({
    auth: {api: {getAccessToken: (...args: unknown[]) => getAccessTokenMock(...args)}},
}));

const ACCOUNT_COOKIE = "better-auth.account_data";

function request(path: string, {cookie = `${ACCOUNT_COOKIE}=abc`, headers = {}} = {}) {
    return new NextRequest(new URL(`http://localhost${path}`), {
        headers: {...(cookie ? {cookie} : {}), ...headers},
    });
}

const refreshed = (cookie: string) => ({
    headers: new Headers({"set-cookie": cookie}),
});

beforeEach(() => {
    getAccessTokenMock.mockReset();
    getAccessTokenMock.mockResolvedValue(refreshed(`${ACCOUNT_COOKIE}=refreshed; Path=/`));
});

describe("proxy", () => {
    it("forwards the refreshed cookie on an app request", async () => {
        const response = await proxy(request("/news"));

        expect(getAccessTokenMock).toHaveBeenCalledWith(
            expect.objectContaining({body: {useAccountCookie: true}, returnHeaders: true}),
        );
        expect(response.headers.getSetCookie()).toContain(`${ACCOUNT_COOKIE}=refreshed; Path=/`);
    });

    // Better Auth rewrites the session and account cookies on these routes itself. A second,
    // independently-computed Set-Cookie set on the same response cannot be reconciled with it:
    // sign-out gets partly undone, and the OAuth callback can pair a new session with the
    // previous user's tokens.
    it.each([
        "/api/auth/callback/keycloak",
        "/api/auth/sign-out",
        "/api/auth/sign-in/social",
        "/api/auth/get-session",
        "/api/auth/login",
    ])("leaves Better Auth's own route %s alone", async (path) => {
        const response = await proxy(request(path));

        expect(getAccessTokenMock).not.toHaveBeenCalled();
        expect(response.headers.getSetCookie()).toEqual([]);
    });

    it("still runs on app routes that merely share the /api/auth prefix", async () => {
        await proxy(request("/api/auth-debug"));

        expect(getAccessTokenMock).toHaveBeenCalled();
    });

    it("skips speculative prefetches", async () => {
        await proxy(request("/news", {headers: {"next-router-prefetch": "1"}}));

        expect(getAccessTokenMock).not.toHaveBeenCalled();
    });

    it("skips anonymous requests", async () => {
        await proxy(request("/news", {cookie: ""}));

        expect(getAccessTokenMock).not.toHaveBeenCalled();
    });

    it("never blocks the request when the refresh fails", async () => {
        getAccessTokenMock.mockRejectedValue(new Error("FAILED_TO_GET_ACCESS_TOKEN"));

        const response = await proxy(request("/news"));

        expect(response.headers.getSetCookie()).toEqual([]);
        expect(response.status).toBe(200);
    });
});
