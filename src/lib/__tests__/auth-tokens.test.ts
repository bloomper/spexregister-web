import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {createHash} from "node:crypto";
import {type AppToken, gravatarImageUrl, isTokenExpired, mapInitialToken, refreshAccessToken,} from "@/lib/auth-tokens";

const jwtDecodeMock = vi.fn();
vi.mock("jwt-decode", () => ({jwtDecode: (...args: unknown[]) => jwtDecodeMock(...args)}));

const claimsWithRoles = (roles: string[]) => ({resource_access: {spexregister: {roles}}});

beforeEach(() => {
    jwtDecodeMock.mockReset();
    vi.stubEnv("NEXT_PUBLIC_AUTH_KEYCLOAK_ISSUER", "https://kc.example/realms/r");
    vi.stubEnv("NEXT_PUBLIC_AUTH_KEYCLOAK_ID", "client");
    vi.stubEnv("AUTH_KEYCLOAK_SECRET", "secret");
});

afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe("mapInitialToken", () => {
    it("maps account/user fields and extracts roles from the access token", () => {
        jwtDecodeMock.mockReturnValue(claimsWithRoles(["ADMIN", "user"]));

        const token = mapInitialToken(
            {access_token: "at", expires_at: 1234, refresh_token: "rt"},
            {id: "u1", name: "Ada", email: "ada@example.com"},
        );

        expect(jwtDecodeMock).toHaveBeenCalledWith("at");
        expect(token).toEqual({
            access_token: "at",
            expires_at: 1234,
            refresh_token: "rt",
            roles: ["ADMIN", "USER"],
            sub: "u1",
            name: "Ada",
            email: "ada@example.com",
        });
    });
});

describe("isTokenExpired", () => {
    it("is false when expiry is in the future", () => {
        expect(isTokenExpired({expires_at: 2_000}, 1_000_000)).toBe(false); // 2000*1000 > 1_000_000
    });

    it("is true when expiry is in the past", () => {
        expect(isTokenExpired({expires_at: 1}, 5_000)).toBe(true); // 1*1000 < 5000
    });

    it("treats a missing expiry as expired", () => {
        expect(isTokenExpired({}, 5_000)).toBe(true);
    });
});

describe("refreshAccessToken", () => {
    const existing: AppToken = {access_token: "old", refresh_token: "rt-old", roles: ["USER"], sub: "u1"};

    it("returns a refreshed token on success and rotates the refresh token", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({access_token: "new-at", expires_in: 300, refresh_token: "rt-new"}),
        });
        vi.stubGlobal("fetch", fetchMock);
        jwtDecodeMock.mockReturnValue(claimsWithRoles(["ADMIN"]));

        const nowSpy = vi.spyOn(Date, "now").mockReturnValue(1_000_000);
        const result = await refreshAccessToken("rt-old", existing);
        nowSpy.mockRestore();

        expect(fetchMock).toHaveBeenCalledWith(
            "https://kc.example/realms/r/protocol/openid-connect/token",
            expect.objectContaining({method: "POST"}),
        );
        // Preserves untouched fields, updates the rest.
        expect(result.sub).toBe("u1");
        expect(result.access_token).toBe("new-at");
        expect(result.refresh_token).toBe("rt-new");
        expect(result.roles).toEqual(["ADMIN"]);
        expect(result.expires_at).toBe(Math.floor(1_000_000 / 1000 + 300));
        expect(result.error).toBeUndefined();
    });

    it("keeps the previous refresh token when the response omits a new one", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({ok: true, json: async () => ({access_token: "new-at", expires_in: 60})}),
        );
        jwtDecodeMock.mockReturnValue(claimsWithRoles(["USER"]));

        const result = await refreshAccessToken("rt-old", existing);
        expect(result.refresh_token).toBe("rt-old");
    });

    it("returns a RefreshTokenError token when the endpoint responds non-ok", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({ok: false, json: async () => ({error: "invalid_grant"})}),
        );
        const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {
        });

        const result = await refreshAccessToken("rt-old", existing);

        expect(result).toEqual({...existing, error: "RefreshTokenError"});
        expect(errorSpy).toHaveBeenCalled();
    });

    it("returns a RefreshTokenError token when fetch rejects", async () => {
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
        vi.spyOn(console, "error").mockImplementation(() => {
        });

        const result = await refreshAccessToken("rt-old", existing);
        expect(result.error).toBe("RefreshTokenError");
        expect(result.access_token).toBe("old");
    });
});

describe("gravatarImageUrl", () => {
    it("returns undefined for empty / whitespace-only email", () => {
        expect(gravatarImageUrl(undefined)).toBeUndefined();
        expect(gravatarImageUrl(null)).toBeUndefined();
        expect(gravatarImageUrl("   ")).toBeUndefined();
    });

    it("hashes the normalized email into a gravatar URL", () => {
        const expected = createHash("sha256").update("ada@example.com").digest("hex");
        expect(gravatarImageUrl("  Ada@Example.com ")).toBe(
            `https://www.gravatar.com/avatar/${expected}?d=404&s=128`,
        );
    });
});
