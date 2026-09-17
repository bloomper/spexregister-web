import {describe, expect, it, vi} from "vitest";
import {
    appendFacetParams,
    cn,
    formatDate,
    formatDateTime,
    getProxiedImageUrl,
    parseFacetParams,
    toAggregationFilters,
    translateError
} from "@/utils/utils";

describe("cn", () => {
    it("merges class names and dedupes conflicting tailwind classes", () => {
        expect(cn("px-2", "px-4")).toBe("px-4");
        expect(cn("text-red-500", false && "hidden", "font-bold")).toBe("text-red-500 font-bold");
    });
});

describe("formatDate", () => {
    it("formats an ISO date to yyyy-MM-dd", () => {
        expect(formatDate("2024-03-09T12:34:56Z")).toBe("2024-03-09");
    });

    it("returns empty string for empty input", () => {
        expect(formatDate("")).toBe("");
    });

    it("returns empty string for an unparseable date", () => {
        expect(formatDate("not-a-date")).toBe("");
    });
});

describe("formatDateTime", () => {
    it("formats an ISO date-time to yyyy-MM-dd HH:mm", () => {
        expect(formatDateTime("2024-03-09T08:05:00")).toBe("2024-03-09 08:05");
    });

    it("returns empty string for empty input", () => {
        expect(formatDateTime("")).toBe("");
    });

    it("falls back to formatDate output for an unparseable date", () => {
        // formatDate also fails -> empty string
        expect(formatDateTime("nonsense")).toBe("");
    });
});

describe("getProxiedImageUrl", () => {
    it("returns empty string when url is missing", () => {
        expect(getProxiedImageUrl(null)).toBe("");
        expect(getProxiedImageUrl(undefined)).toBe("");
        expect(getProxiedImageUrl("")).toBe("");
    });

    it("encodes the url into the proxy query", () => {
        const result = getProxiedImageUrl("https://cdn.example/a b.png");
        expect(result.startsWith("/api/image-download-proxy?")).toBe(true);
        const params = new URLSearchParams(result.split("?")[1]);
        expect(params.get("url")).toBe("https://cdn.example/a b.png");
        expect(params.get("t")).toBeNull();
    });

    it("appends a cache-busting timestamp derived from lastModifiedAt", () => {
        const lastModified = "2024-01-02T03:04:05Z";
        const result = getProxiedImageUrl("https://cdn.example/x.png", lastModified);
        const params = new URLSearchParams(result.split("?")[1]);
        expect(params.get("t")).toBe(String(new Date(lastModified).getTime()));
    });
});

describe("translateError", () => {
    const t = vi.fn((key: string) => `translated:${key}`);

    it("returns the error unchanged when there is no message", () => {
        const error: { message?: string; code: number } = {code: 500};
        expect(translateError(t, error)).toBe(error);
    });

    it("returns undefined when error is undefined", () => {
        expect(translateError(t, undefined)).toBeUndefined();
    });

    it("translates the message and preserves other fields", () => {
        const error = {message: "Common.errorOccurred", field: "year"};
        expect(translateError(t, error)).toEqual({
            message: "translated:Common.errorOccurred",
            field: "year",
        });
    });
});

describe("parseFacetParams", () => {
    it("collects repeated f.<facetId> params from a URLSearchParams", () => {
        const params = new URLSearchParams("q=ada&f.tags=Grundare&f.tags=Hedersmedlem&f.deceased=true");
        expect(parseFacetParams(params)).toEqual({
            tags: new Set(["Grundare", "Hedersmedlem"]),
            deceased: new Set(["true"]),
        });
    });

    it("accepts a Next searchParams object with both string and array values", () => {
        expect(parseFacetParams({q: "ada", "f.tags": ["Grundare", "Hedersmedlem"], "f.deceased": "true"})).toEqual({
            tags: new Set(["Grundare", "Hedersmedlem"]),
            deceased: new Set(["true"]),
        });
    });

    it("ignores non-facet params, empty values, a bare prefix and undefined entries", () => {
        expect(parseFacetParams({q: "ada", "f.": "x", "f.tags": "", "f.spex": undefined})).toEqual({});
    });

    it("returns an empty selection when there is nothing to read", () => {
        expect(parseFacetParams(new URLSearchParams())).toEqual({});
    });
});

describe("appendFacetParams", () => {
    it("writes a sorted, therefore stable, query string", () => {
        const params = new URLSearchParams();
        params.set("q", "ada");
        appendFacetParams(params, {tags: new Set(["Hedersmedlem", "Grundare"]), deceased: new Set(["true"])});
        expect(params.toString()).toBe("q=ada&f.deceased=true&f.tags=Grundare&f.tags=Hedersmedlem");
    });

    it("leaves the params untouched for an empty selection", () => {
        const params = new URLSearchParams("q=ada");
        appendFacetParams(params, {});
        expect(params.toString()).toBe("q=ada");
    });
});

describe("toAggregationFilters", () => {
    it("flattens a selection into sorted name/value pairs", () => {
        expect(toAggregationFilters({
            tags: new Set(["Hedersmedlem", "Grundare"]),
            deceased: new Set(["true"])
        })).toEqual([
            {name: "deceased", value: "true"},
            {name: "tags", value: "Grundare"},
            {name: "tags", value: "Hedersmedlem"},
        ]);
    });

    it("returns an empty array for an empty selection", () => {
        expect(toAggregationFilters({})).toEqual([]);
    });
});

describe("facet params round-trip", () => {
    it("survives parse -> append -> parse unchanged", () => {
        const selected = {tags: new Set(["Grundare", "Hedersmedlem"]), deceased: new Set(["true"])};
        const params = appendFacetParams(new URLSearchParams(), selected);
        expect(parseFacetParams(params)).toEqual(selected);
    });
});
