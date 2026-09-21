import {describe, expect, it} from "vitest";
import {bucketHref} from "@/utils/analytics";
import {parseFacetParams} from "@/utils/utils";

describe("bucketHref", () => {
    it("addresses the search page with the bucket's own facet", () => {
        expect(bucketHref({facet: "spexYears", key: "2024"}))
            .toBe("/spexare/search?f.spexYears=2024");
    });

    it("produces a link the search page parses back to the same selection", () => {
        const href = bucketHref({facet: "tags", key: "grundare"})!;
        const params = new URLSearchParams(href.split("?")[1]);

        expect(parseFacetParams(params)).toEqual({tags: new Set(["grundare"])});
    });

    it("encodes values that are not URL-safe", () => {
        const href = bucketHref({facet: "consents", key: "gdpr:true"})!;

        expect(href).toBe("/spexare/search?f.consents=gdpr%3Atrue");
        expect(parseFacetParams(new URLSearchParams(href.split("?")[1])))
            .toEqual({consents: new Set(["gdpr:true"])});
    });

    it("keeps a year range intact", () => {
        const href = bucketHref({facet: "lastActiveYears", key: "2016..2022"})!;

        expect(parseFacetParams(new URLSearchParams(href.split("?")[1])))
            .toEqual({lastActiveYears: new Set(["2016..2022"])});
    });

    it("returns null for a summary with no list behind it", () => {
        expect(bucketHref({facet: null, key: "veterans"})).toBeNull();
        expect(bucketHref({facet: "spexYears", key: ""})).toBeNull();
    });
});
