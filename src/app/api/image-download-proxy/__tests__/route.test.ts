import {beforeEach, describe, expect, it, vi} from "vitest";
import {NextRequest} from "next/server";
import {GET} from "@/app/api/image-download-proxy/route";

const axiosGet = vi.fn();
vi.mock("@/lib/axios.server", () => ({default: {get: (...a: unknown[]) => axiosGet(...a)}}));

const makeRequest = (query: string, headers?: Record<string, string>) =>
    new NextRequest(`http://localhost/api/image-download-proxy${query}`, {headers});

beforeEach(() => {
    axiosGet.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {
    });
    vi.stubEnv("API_REST_BASE_URL", "https://api.test");
});

describe("image-download-proxy GET", () => {
    it("returns 400 when url is missing", async () => {
        const res = await GET(makeRequest(""));
        expect(res.status).toBe(400);
        await expect(res.json()).resolves.toEqual({error: "Image URL is required"});
    });

    it("prefixes a relative url with the REST base and streams the image", async () => {
        axiosGet.mockResolvedValue({
            status: 200,
            data: new Uint8Array([1, 2, 3]),
            headers: {"content-type": "image/png", "last-modified": "Wed, 01 Jan 2024 00:00:00 GMT"},
        });

        const res = await GET(makeRequest("?url=/api/spexare/1/image&t=1"));

        expect(axiosGet).toHaveBeenCalledWith("https://api.test/api/spexare/1/image", expect.objectContaining({maxRedirects: 0}));
        expect(res.status).toBe(200);
        expect(res.headers.get("Content-Type")).toBe("image/png");
        expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
        expect(res.headers.get("Last-Modified")).toBe("Wed, 01 Jan 2024 00:00:00 GMT");
        expect(res.headers.get("Cache-Control")).toBe("private, max-age=31536000, immutable");
    });

    it("accepts an absolute url on the backend's own origin and revalidates when unversioned", async () => {
        axiosGet.mockResolvedValue({status: 200, data: new Uint8Array([1]), headers: {"content-type": "image/jpeg"}});

        const res = await GET(makeRequest("?url=https://api.test/api/spex/2/poster"));

        expect(axiosGet).toHaveBeenCalledWith("https://api.test/api/spex/2/poster", expect.anything());
        expect(res.headers.get("Content-Type")).toBe("image/jpeg");
        expect(res.headers.get("Cache-Control")).toBe("private, no-cache");
        expect(res.headers.get("Last-Modified")).toBeNull();
    });

    it.each([
        "https://evil.example/x.jpg",
        "//evil.example/api/x",
        "http://api.test/api/spexare/1/image",
        "https://api.test.evil.example/api/x",
        "/actuator/env",
        "/api/../actuator/env",
        "javascript:alert(1)",
    ])("refuses to fetch %s", async (url) => {
        const res = await GET(makeRequest(`?url=${encodeURIComponent(url)}`));

        expect(res.status).toBe(400);
        expect(axiosGet).not.toHaveBeenCalled();
    });

    it.each(["text/html", "image/svg+xml", "application/octet-stream", undefined])(
        "refuses to serve content of type %s",
        async (contentType) => {
            axiosGet.mockResolvedValue({
                status: 200,
                data: new Uint8Array([1]),
                headers: contentType ? {"content-type": contentType} : {},
            });

            const res = await GET(makeRequest("?url=/api/spexare/1/image"));

            expect(res.status).toBe(415);
        }
    );

    it("forwards If-Modified-Since and returns 304 unchanged", async () => {
        axiosGet.mockResolvedValue({status: 304, data: null, headers: {}});

        const res = await GET(makeRequest("?url=/api/spexare/1/image", {"If-Modified-Since": "Wed, 01 Jan 2024 00:00:00 GMT"}));

        const passedConfig = axiosGet.mock.calls[0][1] as { headers: Record<string, string> };
        expect(passedConfig.headers["If-Modified-Since"]).toBe("Wed, 01 Jan 2024 00:00:00 GMT");
        expect(res.status).toBe(304);
    });

    it("maps an axios error with a response to that status", async () => {
        axiosGet.mockRejectedValue({isAxiosError: true, response: {status: 404}});
        const res = await GET(makeRequest("?url=/api/spexare/404/image"));
        expect(res.status).toBe(404);
    });

    it("maps a non-axios error to 500", async () => {
        axiosGet.mockRejectedValue(new Error("network down"));
        const res = await GET(makeRequest("?url=/api/spexare/1/image"));
        expect(res.status).toBe(500);
    });
});
