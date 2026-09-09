import {describe, expect, it} from "vitest";
import {
    appendLogoutParams,
    extractRolesFromClaims,
    isAdmin,
    isAdminOrEditor,
    isEditor,
    isUser,
    normalizeTheme,
} from "@/utils/auth";
import type {AccessTokenClaims} from "@/types/auth";

describe("role predicates", () => {
    it("isAdmin / isEditor / isUser check membership", () => {
        expect(isAdmin(["ADMIN"])).toBe(true);
        expect(isAdmin(["EDITOR", "USER"])).toBe(false);
        expect(isEditor(["EDITOR"])).toBe(true);
        expect(isEditor(["ADMIN"])).toBe(false);
        expect(isUser(["USER"])).toBe(true);
        expect(isUser([])).toBe(false);
    });

    it("isAdminOrEditor is true for either role only", () => {
        expect(isAdminOrEditor(["ADMIN"])).toBe(true);
        expect(isAdminOrEditor(["EDITOR"])).toBe(true);
        expect(isAdminOrEditor(["USER"])).toBe(false);
        expect(isAdminOrEditor([])).toBe(false);
    });
});

describe("extractRolesFromClaims", () => {
    const claimsWith = (roles?: string[]): AccessTokenClaims => ({
        resource_access: {spexregister: {roles}},
    });

    it("returns [] when resource_access is missing", () => {
        expect(extractRolesFromClaims({})).toEqual([]);
    });

    it("returns [] when the spexregister client is missing", () => {
        expect(extractRolesFromClaims({resource_access: {}})).toEqual([]);
    });

    it("normalizes case and trims whitespace", () => {
        expect(extractRolesFromClaims(claimsWith(["admin", " Editor ", "user"])).sort()).toEqual(
            ["ADMIN", "EDITOR", "USER"],
        );
    });

    it("drops unknown roles", () => {
        expect(extractRolesFromClaims(claimsWith(["ADMIN", "SUPERUSER", "guest"]))).toEqual(["ADMIN"]);
    });

    it("de-duplicates roles", () => {
        expect(extractRolesFromClaims(claimsWith(["ADMIN", "admin", "ADMIN"]))).toEqual(["ADMIN"]);
    });
});

describe("normalizeTheme", () => {
    it("accepts the three valid themes", () => {
        expect(normalizeTheme("light")).toBe("light");
        expect(normalizeTheme("dark")).toBe("dark");
        expect(normalizeTheme("system")).toBe("system");
    });

    it("returns undefined for anything else", () => {
        expect(normalizeTheme("blue")).toBeUndefined();
        expect(normalizeTheme(undefined)).toBeUndefined();
        expect(normalizeTheme("")).toBeUndefined();
    });
});

describe("appendLogoutParams", () => {
    const endSession = "https://kc.example/realms/r/protocol/openid-connect/logout";

    it("returns the URL untouched when there is nothing to append", () => {
        expect(appendLogoutParams(endSession)).toBe(endSession);
    });

    it("appends locale and theme", () => {
        const url = new URL(appendLogoutParams(endSession, "sv", "dark"));

        expect(url.searchParams.get("ui_locales")).toBe("sv");
        expect(url.searchParams.get("theme")).toBe("dark");
    });

    it("preserves the params Better Auth already put on the URL", () => {
        const withHint = `${endSession}?id_token_hint=abc&post_logout_redirect_uri=https%3A%2F%2Fapp.example`;

        const url = new URL(appendLogoutParams(withHint, "en"));

        expect(url.searchParams.get("id_token_hint")).toBe("abc");
        expect(url.searchParams.get("post_logout_redirect_uri")).toBe("https://app.example");
        expect(url.searchParams.get("ui_locales")).toBe("en");
        expect(url.searchParams.get("theme")).toBeNull();
    });
});
