import {beforeEach, describe, expect, it, vi} from "vitest";
import type {AuthzResult} from "@/types/auth";
import {authzFailureResponse, withPolicyAction, withPolicyPage, withPolicyRoute} from "@/utils/route.server";

const redirectMock = vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
});
const forbiddenMock = vi.fn(() => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;403");
});
vi.mock("next/navigation", () => ({
    redirect: (url: string) => redirectMock(url),
    forbidden: () => forbiddenMock(),
}));

vi.mock("next/server", () => ({
    NextResponse: {
        json: (body: unknown, init?: { status?: number }) => ({
            body,
            status: init?.status ?? 200,
        }),
    },
}));

const requireUserMock = vi.fn(async () => ({session: {}, roles: ["USER"]}));
vi.mock("@/utils/auth.server", () => ({requireUser: () => requireUserMock()}));

const ok: AuthzResult = {ok: true, roles: ["ADMIN"]};
const unauth: AuthzResult = {ok: false, status: 401, message: "Not authenticated"};
const forbidden: AuthzResult = {ok: false, status: 403, message: "Not authorized"};

beforeEach(() => {
    redirectMock.mockClear();
});

describe("authzFailureResponse", () => {
    it("serialises the failure message and status", () => {
        const res = authzFailureResponse(forbidden) as unknown as { body: unknown; status: number };
        expect(res.status).toBe(403);
        expect(res.body).toEqual({error: "Not authorized"});
    });
});

describe("withPolicyAction", () => {
    it("invokes the handler with the authz result on success", async () => {
        const handler = vi.fn(async (authz) => `roles:${authz.roles.join(",")}`);
        const result = await withPolicyAction(async () => ok, handler);

        expect(result).toBe("roles:ADMIN");
        expect(handler).toHaveBeenCalledWith(ok);
    });

    it("redirects to the login route on 401 and never calls the handler", async () => {
        const handler = vi.fn();
        await expect(withPolicyAction(async () => unauth, handler)).rejects.toThrow("NEXT_REDIRECT:/api/auth/login");
        expect(redirectMock).toHaveBeenCalledWith("/api/auth/login");
        expect(handler).not.toHaveBeenCalled();
    });

    it("throws the message on 403", async () => {
        const handler = vi.fn();
        await expect(withPolicyAction(async () => forbidden, handler)).rejects.toThrow("Not authorized");
        expect(handler).not.toHaveBeenCalled();
        expect(redirectMock).not.toHaveBeenCalled();
    });
});

describe("withPolicyPage", () => {
    it("invokes the handler on success", async () => {
        const result = await withPolicyPage(async () => ok, async (authz) => authz.roles);
        expect(result).toEqual(["ADMIN"]);
    });

    it("redirects on 401", async () => {
        await expect(withPolicyPage(async () => unauth, vi.fn())).rejects.toThrow("NEXT_REDIRECT:/api/auth/login");
    });

    it("shows the forbidden page on 403", async () => {
        await expect(withPolicyPage(async () => forbidden, vi.fn())).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;403");
        expect(redirectMock).not.toHaveBeenCalled();
    });

    it("redirects to the no-access page on 403 when the user has no role at all", async () => {
        requireUserMock.mockResolvedValueOnce({session: {}, roles: []});
        const handler = vi.fn();

        await expect(withPolicyPage(async () => forbidden, handler)).rejects.toThrow("NEXT_REDIRECT:/no-access");
        expect(handler).not.toHaveBeenCalled();
    });
});

describe("withPolicyRoute", () => {
    const request = {} as never;
    const context = {} as never;

    it("calls the handler with request, context and authz on success", async () => {
        const handler = vi.fn(async () => new Response(null, {status: 200}));
        const route = withPolicyRoute(async () => ok, handler);
        await route(request, context);

        expect(handler).toHaveBeenCalledWith(request, context, ok);
    });

    it("redirects on 401", async () => {
        const route = withPolicyRoute(async () => unauth, vi.fn());
        await expect(route(request, context)).rejects.toThrow("NEXT_REDIRECT:/");
        expect(redirectMock).toHaveBeenCalledWith("/");
    });

    it("returns a 403 json response without calling the handler", async () => {
        const handler = vi.fn();
        const route = withPolicyRoute(async () => forbidden, handler);
        const res = (await route(request, context)) as unknown as { body: unknown; status: number };

        expect(res.status).toBe(403);
        expect(res.body).toEqual({error: "Not authorized"});
        expect(handler).not.toHaveBeenCalled();
    });
});
