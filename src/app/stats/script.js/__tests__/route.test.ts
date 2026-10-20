import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {GET} from "@/app/stats/script.js/route";

vi.mock("next/server", () => ({connection: vi.fn(async () => undefined)}));

const fetchMock = vi.fn();

beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "error").mockImplementation(() => {
    });
    vi.stubEnv("UMAMI_URL", "http://umami-server:3000");
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
});

describe("stats script GET", () => {
    it("returns 404 when Umami is not configured", async () => {
        vi.stubEnv("UMAMI_URL", "");

        const res = await GET();

        expect(res.status).toBe(404);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("serves Umami's tracker", async () => {
        fetchMock.mockResolvedValue(new Response("(function(){})()"));

        const res = await GET();

        expect(fetchMock).toHaveBeenCalledWith("http://umami-server:3000/script.js", expect.anything());
        expect(res.headers.get("Content-Type")).toBe("application/javascript; charset=utf-8");
        await expect(res.text()).resolves.toBe("(function(){})()");
    });

    it("returns 502 when Umami fails", async () => {
        fetchMock.mockResolvedValue(new Response(null, {status: 500}));

        const res = await GET();

        expect(res.status).toBe(502);
    });
});
