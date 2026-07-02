import {describe, expect, it} from "vitest";
import {spexCategoryFormSchema} from "@/lib/spex/category/schema";

const currentYear = new Date().getFullYear();
const parseYear = (firstYear: string) => spexCategoryFormSchema.safeParse({name: "Chalmersspexet", firstYear});

describe("spexCategoryFormSchema.firstYear", () => {
    it("accepts a year within [1948, currentYear + 2]", () => {
        expect(parseYear("1950").success).toBe(true);
    });

    it("accepts the boundary years 1948 and currentYear + 2", () => {
        expect(parseYear("1948").success).toBe(true);
        expect(parseYear(String(currentYear + 2)).success).toBe(true);
    });

    it("rejects a year before 1948", () => {
        expect(parseYear("1947").success).toBe(false);
    });

    it("rejects a year beyond currentYear + 2", () => {
        expect(parseYear(String(currentYear + 3)).success).toBe(false);
    });

    it("requires the field", () => {
        expect(parseYear("").success).toBe(false);
    });
});
