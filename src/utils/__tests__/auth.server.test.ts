import {beforeEach, describe, expect, it, vi} from "vitest";
import {requireAllRoles, requireAnyRole, requireUser} from "@/utils/auth.server";

const authMock = vi.fn();
vi.mock("@/auth", () => ({auth: () => authMock()}));

beforeEach(() => {
    authMock.mockReset();
});

describe("requireUser", () => {
    it("returns null session when unauthenticated", async () => {
        authMock.mockResolvedValue(null);
        expect(await requireUser()).toEqual({session: null, roles: []});
    });

    it("returns null session on a refresh-token error", async () => {
        authMock.mockResolvedValue({error: "RefreshTokenError", roles: ["ADMIN"]});
        expect(await requireUser()).toEqual({session: null, roles: []});
    });

    it("returns the session and roles when authenticated", async () => {
        const session = {access_token: "t", roles: ["USER", "EDITOR"]};
        authMock.mockResolvedValue(session);
        expect(await requireUser()).toEqual({session, roles: ["USER", "EDITOR"]});
    });

    it("defaults roles to [] when the session omits them", async () => {
        authMock.mockResolvedValue({access_token: "t"});
        expect(await requireUser()).toEqual({session: {access_token: "t"}, roles: []});
    });
});

describe("requireAnyRole", () => {
    it("returns 401 when unauthenticated", async () => {
        authMock.mockResolvedValue(null);
        expect(await requireAnyRole(["ADMIN"])).toEqual({
            ok: false,
            status: 401,
            message: "Not authenticated",
        });
    });

    it("returns 403 when none of the required roles are present", async () => {
        authMock.mockResolvedValue({access_token: "t", roles: ["USER"]});
        expect(await requireAnyRole(["ADMIN", "EDITOR"])).toEqual({
            ok: false,
            status: 403,
            message: "Not authorized",
        });
    });

    it("returns ok when at least one required role matches", async () => {
        authMock.mockResolvedValue({access_token: "t", roles: ["USER", "EDITOR"]});
        expect(await requireAnyRole(["ADMIN", "EDITOR"])).toEqual({ok: true, roles: ["USER", "EDITOR"]});
    });
});

describe("requireAllRoles", () => {
    it("returns 401 when unauthenticated", async () => {
        authMock.mockResolvedValue(null);
        expect(await requireAllRoles(["ADMIN"])).toEqual({
            ok: false,
            status: 401,
            message: "Not authenticated",
        });
    });

    it("returns 403 when only some required roles are present", async () => {
        authMock.mockResolvedValue({access_token: "t", roles: ["ADMIN"]});
        expect(await requireAllRoles(["ADMIN", "EDITOR"])).toEqual({
            ok: false,
            status: 403,
            message: "Not authorized",
        });
    });

    it("returns ok when every required role is present", async () => {
        authMock.mockResolvedValue({access_token: "t", roles: ["ADMIN", "EDITOR", "USER"]});
        expect(await requireAllRoles(["ADMIN", "EDITOR"])).toEqual({
            ok: true,
            roles: ["ADMIN", "EDITOR", "USER"],
        });
    });
});
