import {beforeEach, describe, expect, it, vi} from "vitest";
import {getAccessToken, getSessionContext, requireAllRoles, requireAnyRole, requireUser} from "@/utils/auth.server";

const getSessionMock = vi.fn();
const getAccessTokenMock = vi.fn();
const jwtDecodeMock = vi.fn();

vi.mock("@/auth", () => ({
    auth: {
        api: {
            getSession: (...args: unknown[]) => getSessionMock(...args),
            getAccessToken: (...args: unknown[]) => getAccessTokenMock(...args),
        },
    },
}));
vi.mock("next/headers", () => ({headers: async () => new Headers()}));
vi.mock("jwt-decode", () => ({jwtDecode: (...args: unknown[]) => jwtDecodeMock(...args)}));

const session = {user: {id: "u1", email: "ada@example.com"}, session: {id: "s1"}};

const signedInAs = (roles: string[]) => {
    getSessionMock.mockResolvedValue(session);
    getAccessTokenMock.mockResolvedValue({accessToken: "kc-token"});
    jwtDecodeMock.mockReturnValue({resource_access: {spexregister: {roles}}});
};

beforeEach(() => {
    getSessionMock.mockReset();
    getAccessTokenMock.mockReset();
    jwtDecodeMock.mockReset();
    vi.spyOn(console, "warn").mockImplementation(() => {
    });
});

describe("getSessionContext", () => {
    it("resolves the session, access token and roles", async () => {
        signedInAs(["USER", "EDITOR"]);

        expect(await getSessionContext()).toEqual({
            session,
            accessToken: "kc-token",
            roles: ["USER", "EDITOR"],
        });
        expect(getAccessTokenMock).toHaveBeenCalledWith(
            expect.objectContaining({body: {useAccountCookie: true}}),
        );
    });

    it("does not ask for an access token when there is no session", async () => {
        getSessionMock.mockResolvedValue(null);

        expect(await getSessionContext()).toEqual({session: null, accessToken: null, roles: []});
        expect(getAccessTokenMock).not.toHaveBeenCalled();
    });

    it("treats a failed token refresh as logged out", async () => {
        getSessionMock.mockResolvedValue(session);
        getAccessTokenMock.mockRejectedValue(new Error("FAILED_TO_GET_ACCESS_TOKEN"));

        expect(await getSessionContext()).toEqual({session: null, accessToken: null, roles: []});
    });

    it("treats a missing access token as logged out", async () => {
        getSessionMock.mockResolvedValue(session);
        getAccessTokenMock.mockResolvedValue({accessToken: undefined});

        expect(await getSessionContext()).toEqual({session: null, accessToken: null, roles: []});
    });
});

describe("getAccessToken", () => {
    it("returns the Keycloak token when signed in", async () => {
        signedInAs(["USER"]);
        expect(await getAccessToken()).toBe("kc-token");
    });

    it("returns null when signed out", async () => {
        getSessionMock.mockResolvedValue(null);
        expect(await getAccessToken()).toBeNull();
    });
});

describe("requireUser", () => {
    it("returns null session when unauthenticated", async () => {
        getSessionMock.mockResolvedValue(null);
        expect(await requireUser()).toEqual({session: null, roles: []});
    });

    it("returns null session when the token cannot be refreshed", async () => {
        getSessionMock.mockResolvedValue(session);
        getAccessTokenMock.mockRejectedValue(new Error("FAILED_TO_GET_ACCESS_TOKEN"));
        expect(await requireUser()).toEqual({session: null, roles: []});
    });

    it("returns the session and roles when authenticated", async () => {
        signedInAs(["USER", "EDITOR"]);
        expect(await requireUser()).toEqual({session, roles: ["USER", "EDITOR"]});
    });

    it("defaults roles to [] when the token carries none", async () => {
        signedInAs([]);
        expect(await requireUser()).toEqual({session, roles: []});
    });
});

describe("requireAnyRole", () => {
    it("returns 401 when unauthenticated", async () => {
        getSessionMock.mockResolvedValue(null);
        expect(await requireAnyRole(["ADMIN"])).toEqual({
            ok: false,
            status: 401,
            message: "Not authenticated",
        });
    });

    it("returns 403 when none of the required roles are present", async () => {
        signedInAs(["USER"]);
        expect(await requireAnyRole(["ADMIN", "EDITOR"])).toEqual({
            ok: false,
            status: 403,
            message: "Not authorized",
        });
    });

    it("returns ok when at least one required role matches", async () => {
        signedInAs(["USER", "EDITOR"]);
        expect(await requireAnyRole(["ADMIN", "EDITOR"])).toEqual({ok: true, roles: ["USER", "EDITOR"]});
    });
});

describe("requireAllRoles", () => {
    it("returns 401 when unauthenticated", async () => {
        getSessionMock.mockResolvedValue(null);
        expect(await requireAllRoles(["ADMIN"])).toEqual({
            ok: false,
            status: 401,
            message: "Not authenticated",
        });
    });

    it("returns 403 when only some required roles are present", async () => {
        signedInAs(["ADMIN"]);
        expect(await requireAllRoles(["ADMIN", "EDITOR"])).toEqual({
            ok: false,
            status: 403,
            message: "Not authorized",
        });
    });

    it("returns ok when every required role is present", async () => {
        signedInAs(["ADMIN", "EDITOR", "USER"]);
        expect(await requireAllRoles(["ADMIN", "EDITOR"])).toEqual({
            ok: true,
            roles: ["ADMIN", "EDITOR", "USER"],
        });
    });
});
