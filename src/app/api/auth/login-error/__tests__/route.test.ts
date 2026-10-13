import {beforeEach, describe, expect, it, vi} from "vitest";
import {NextRequest} from "next/server";
import {GET} from "@/app/api/auth/login-error/route";

const store = {
    has: vi.fn(),
    set: vi.fn(),
};

vi.mock("next/headers", () => ({cookies: async () => store}));
vi.mock("next/navigation", () => ({
    redirect: (url: string) => {
        throw new Error(`REDIRECT:${url}`);
    },
}));

const makeRequest = (query: string) =>
    new NextRequest(`https://register.test/api/auth/login-error${query}`);

beforeEach(() => {
    store.has.mockReset();
    store.set.mockReset();
    vi.spyOn(console, "warn").mockImplementation(() => {
    });
});

describe("login-error GET", () => {
    it("restarts the login once on a state mismatch", async () => {
        store.has.mockReturnValue(false);

        await expect(GET(makeRequest("?error=state_mismatch"))).rejects.toThrow("REDIRECT:/api/auth/login");

        expect(store.set).toHaveBeenCalledWith("login_retry", "1", expect.objectContaining({
            httpOnly: true,
            secure: true,
            path: "/api/auth",
            maxAge: 60,
        }));
    });

    it("shows the error page and clears the marker when the retry also fails", async () => {
        store.has.mockReturnValue(true);

        await expect(GET(makeRequest("?error=state_mismatch"))).rejects.toThrow("REDIRECT:/login-error");

        expect(store.set).toHaveBeenCalledWith("login_retry", "", {path: "/api/auth", maxAge: 0});
    });

    it.each(["?error=access_denied", ""])("shows the error page without retrying for %j", async (query) => {
        store.has.mockReturnValue(false);

        await expect(GET(makeRequest(query))).rejects.toThrow("REDIRECT:/login-error");

        expect(store.set).not.toHaveBeenCalled();
    });
});
