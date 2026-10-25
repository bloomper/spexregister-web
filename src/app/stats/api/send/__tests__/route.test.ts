import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {POST} from "@/app/stats/api/send/route";

const fetchMock = vi.fn();

const makeRequest = (headers: Record<string, string>) =>
    new Request("http://localhost/stats/api/send", {method: "POST", body: "{\"type\":\"event\"}", headers});

beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "error").mockImplementation(() => {
    });
    vi.stubEnv("UMAMI_URL", "http://umami-server:3000/");
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
});

describe("stats send POST", () => {
    it("returns 404 when Umami is not configured", async () => {
        vi.stubEnv("UMAMI_URL", "");

        const res = await POST(makeRequest({}));

        expect(res.status).toBe(404);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("forwards the event with the visitor's address and browser", async () => {
        fetchMock.mockResolvedValue(new Response("{\"cache\":\"abc\"}", {headers: {"content-type": "application/json"}}));

        const res = await POST(makeRequest({
            "content-type": "application/json",
            "user-agent": "Mozilla/5.0",
            "x-umami-cache": "abc",
            "cf-connecting-ip": "203.0.113.7",
            "x-forwarded-for": "10.0.0.1",
            cookie: "better-auth.session_data=secret",
        }));

        const [url, init] = fetchMock.mock.calls[0];
        const headers = init.headers as Headers;

        expect(url).toBe("http://umami-server:3000/api/send");
        expect(init.body).toBe("{\"type\":\"event\"}");
        expect(headers.get("x-forwarded-for")).toBe("203.0.113.7");
        expect(headers.get("user-agent")).toBe("Mozilla/5.0");
        expect(headers.get("x-umami-cache")).toBe("abc");
        expect(headers.get("cookie")).toBeNull();
        expect(res.status).toBe(200);
        await expect(res.json()).resolves.toEqual({cache: "abc"});
    });

    it("falls back to x-forwarded-for without Cloudflare", async () => {
        fetchMock.mockResolvedValue(new Response("{}"));

        await POST(makeRequest({"x-forwarded-for": "198.51.100.2, 10.0.0.1"}));

        expect((fetchMock.mock.calls[0][1].headers as Headers).get("x-forwarded-for")).toBe("198.51.100.2, 10.0.0.1");
    });

    it("returns 502 when Umami is unreachable", async () => {
        fetchMock.mockRejectedValue(new Error("ECONNREFUSED"));

        const res = await POST(makeRequest({}));

        expect(res.status).toBe(502);
    });

    it("refuses a body larger than an event", async () => {
        const large = new Request("http://localhost/stats/api/send", {method: "POST", body: "x".repeat(16 * 1024 + 1)});

        expect((await POST(large)).status).toBe(413);
        expect(fetchMock).not.toHaveBeenCalled();
    });
});
